import { httpService } from './httpService';
import { API_ENDPOINTS } from '../config/api';
import type {
  ShareLink,
  CreateShareLinkRequest,
  UpdateShareLinkRequest,
  FileItem,
  PaginatedResponse,
  ApiResponse,
} from '../types';

class ShareService {
  // Récupération de la liste des liens de partage
  async getShareLinks(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<ShareLink>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      return await httpService.get<PaginatedResponse<ShareLink>>(
        `${API_ENDPOINTS.SHARES.LIST}?${params}`
      );
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch share links');
    }
  }

  // Récupération d'un lien de partage par ID
  async getShareLinkById(id: string): Promise<ApiResponse<ShareLink>> {
    try {
      return await httpService.get<ShareLink>(API_ENDPOINTS.SHARES.GET(id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch share link');
    }
  }

  // Création d'un lien de partage
  async createShareLink(data: CreateShareLinkRequest): Promise<ApiResponse<ShareLink>> {
    try {
      return await httpService.post<ShareLink>(API_ENDPOINTS.SHARES.CREATE, data);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create share link');
    }
  }

  // Mise à jour d'un lien de partage
  async updateShareLink(
    id: string,
    updates: UpdateShareLinkRequest
  ): Promise<ApiResponse<ShareLink>> {
    try {
      return await httpService.put<ShareLink>(API_ENDPOINTS.SHARES.UPDATE(id), updates);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update share link');
    }
  }

  // Suppression d'un lien de partage
  async deleteShareLink(id: string): Promise<ApiResponse<void>> {
    try {
      return await httpService.delete<void>(API_ENDPOINTS.SHARES.DELETE(id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete share link');
    }
  }

  // Accès public à un lien de partage
  async getPublicShareLink(
    token: string,
    password?: string
  ): Promise<
    ApiResponse<{
      shareLink: ShareLink;
      file: FileItem;
    }>
  > {
    try {
      const payload = password ? { password } : undefined;

      return await httpService.post<{
        shareLink: ShareLink;
        file: FileItem;
      }>(API_ENDPOINTS.SHARES.PUBLIC(token), payload);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to access share link');
    }
  }

  // Téléchargement via un lien de partage public
  async downloadFromPublicLink(token: string, password?: string): Promise<void> {
    try {
      const endpoint = API_ENDPOINTS.SHARES.DOWNLOAD(token);

      if (password) {
        // Si un mot de passe est requis, faire une requête POST d'abord
        const response = await httpService.post<{ downloadUrl: string }>(endpoint, { password });

        if (response.data?.downloadUrl) {
          window.open(response.data.downloadUrl, '_blank');
          return;
        }
      }

      // Téléchargement direct
      await httpService.download(endpoint);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to download from share link');
    }
  }

  // Activation/désactivation d'un lien de partage
  async toggleShareLinkStatus(id: string, isActive: boolean): Promise<ApiResponse<ShareLink>> {
    try {
      return await this.updateShareLink(id, { isActive });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to toggle share link status');
    }
  }

  // Récupération des liens de partage récents
  async getRecentShareLinks(limit = 10): Promise<ApiResponse<ShareLink[]>> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const response = await httpService.get<PaginatedResponse<ShareLink>>(
        `${API_ENDPOINTS.SHARES.LIST}?${params}`
      );

      return {
        ...response,
        data: response.data?.data || [],
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch recent share links');
    }
  }

  // Récupération des liens de partage pour un fichier spécifique
  async getFileShareLinks(fileId: string): Promise<ApiResponse<ShareLink[]>> {
    try {
      const params = new URLSearchParams({
        fileId,
      });

      const response = await httpService.get<PaginatedResponse<ShareLink>>(
        `${API_ENDPOINTS.SHARES.LIST}?${params}`
      );

      return {
        ...response,
        data: response.data?.data || [],
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch file share links');
    }
  }

  // Génération d'un lien de partage rapide (sans expiration ni protection)
  async createQuickShareLink(fileId: string): Promise<ApiResponse<ShareLink>> {
    try {
      return await this.createShareLink({
        fileId,
        allowPreview: true,
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create quick share link');
    }
  }

  // Génération d'un lien de partage sécurisé
  async createSecureShareLink(
    fileId: string,
    password: string,
    expiresAt: string,
    downloadLimit?: number
  ): Promise<ApiResponse<ShareLink>> {
    try {
      return await this.createShareLink({
        fileId,
        password,
        expiresAt,
        downloadLimit,
        allowPreview: false,
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create secure share link');
    }
  }

  // Vérification de la validité d'un lien de partage
  validateShareLink(shareLink: ShareLink): {
    isValid: boolean;
    reason?: string;
  } {
    if (!shareLink.isActive) {
      return { isValid: false, reason: 'Le lien de partage est désactivé' };
    }

    if (shareLink.expiresAt && new Date(shareLink.expiresAt) < new Date()) {
      return { isValid: false, reason: 'Le lien de partage a expiré' };
    }

    if (shareLink.downloadLimit && shareLink.downloadCount >= shareLink.downloadLimit) {
      return { isValid: false, reason: 'Le nombre maximum de téléchargements a été atteint' };
    }

    return { isValid: true };
  }

  // Génération d'une URL complète pour un lien de partage
  generateShareUrl(token: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${token}`;
  }

  // Copie d'un lien de partage dans le presse-papiers
  async copyShareLinkToClipboard(token: string): Promise<void> {
    try {
      const url = this.generateShareUrl(token);
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
      const textArea = document.createElement('textarea');
      textArea.value = this.generateShareUrl(token);
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy'); // Méthode dépréciée mais nécessaire pour le fallback
      } catch {
        throw new Error('Impossible de copier le lien');
      }
      document.body.removeChild(textArea);
    }
  }

  // Formatage de la date d'expiration
  formatExpirationDate(expiresAt?: string): string {
    if (!expiresAt) return 'Jamais';

    const date = new Date(expiresAt);
    const now = new Date();

    if (date < now) return 'Expiré';

    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Expire demain';
    if (diffDays <= 7) return `Expire dans ${diffDays} jours`;

    return date.toLocaleDateString('fr-FR');
  }
}

// Instance singleton
export const shareService = new ShareService();
export default shareService;
