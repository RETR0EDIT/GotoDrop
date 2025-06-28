import { httpService } from './httpService';
import { API_ENDPOINTS } from '../config/api';
import type {
  AdminStats,
  User,
  FileItem,
  ShareLink,
  PaginatedResponse,
  ApiResponse,
} from '../types';

class AdminService {
  // Récupération des statistiques globales
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    try {
      return await httpService.get<AdminStats>(API_ENDPOINTS.ADMIN.STATS);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch admin stats');
    }
  }

  // Gestion des utilisateurs (admin)
  async getAllUsers(
    page = 1,
    limit = 50,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      return await httpService.get<PaginatedResponse<User>>(
        `${API_ENDPOINTS.ADMIN.USERS}?${params}`
      );
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch users');
    }
  }

  // Gestion des fichiers (admin)
  async getAllFiles(
    page = 1,
    limit = 50,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<FileItem>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      return await httpService.get<PaginatedResponse<FileItem>>(
        `${API_ENDPOINTS.ADMIN.FILES}?${params}`
      );
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch files');
    }
  }

  // Gestion des liens de partage (admin)
  async getAllShareLinks(page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<ShareLink>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      return await httpService.get<PaginatedResponse<ShareLink>>(
        `${API_ENDPOINTS.ADMIN.SHARES}?${params}`
      );
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch share links');
    }
  }

  // Activation/désactivation d'un utilisateur
  async toggleUserStatus(userId: string, isActive: boolean): Promise<ApiResponse<User>> {
    try {
      return await httpService.patch<User>(`/api/admin/users/${userId}`, {
        isActive,
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to toggle user status');
    }
  }

  // Suppression d'un utilisateur (admin)
  async deleteUserAsAdmin(userId: string): Promise<ApiResponse<void>> {
    try {
      return await httpService.delete<void>(`/api/admin/users/${userId}`);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete user');
    }
  }

  // Suppression d'un fichier (admin)
  async deleteFileAsAdmin(fileId: string): Promise<ApiResponse<void>> {
    try {
      return await httpService.delete<void>(`/api/admin/files/${fileId}`);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete file');
    }
  }

  // Suppression d'un lien de partage (admin)
  async deleteShareLinkAsAdmin(shareLinkId: string): Promise<ApiResponse<void>> {
    try {
      return await httpService.delete<void>(`/api/admin/shares/${shareLinkId}`);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete share link');
    }
  }

  // Récupération des logs d'activité
  async getActivityLogs(
    page = 1,
    limit = 100,
    dateFrom?: string,
    dateTo?: string
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
        id: string;
        action: string;
        userId: string;
        user?: User;
        resourceType: 'user' | 'file' | 'share';
        resourceId: string;
        details: Record<string, any>;
        createdAt: string;
      }>
    >
  > {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });

      return await httpService.get<PaginatedResponse<any>>(`/api/admin/logs?${params}`);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch activity logs');
    }
  }

  // Statistiques d'utilisation par période
  async getUsageStats(
    period: 'day' | 'week' | 'month' | 'year',
    dateFrom: string,
    dateTo: string
  ): Promise<
    ApiResponse<{
      storage: Array<{ date: string; value: number }>;
      uploads: Array<{ date: string; value: number }>;
      downloads: Array<{ date: string; value: number }>;
      users: Array<{ date: string; value: number }>;
    }>
  > {
    try {
      const params = new URLSearchParams({
        period,
        dateFrom,
        dateTo,
      });

      return await httpService.get<any>(`/api/admin/stats/usage?${params}`);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch usage stats');
    }
  }

  // Configuration système
  async getSystemConfig(): Promise<
    ApiResponse<{
      maxFileSize: number;
      allowedFileTypes: string[];
      defaultStorageLimit: number;
      registrationEnabled: boolean;
      maintenanceMode: boolean;
    }>
  > {
    try {
      return await httpService.get<any>('/api/admin/config');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch system config');
    }
  }

  // Mise à jour de la configuration système
  async updateSystemConfig(config: {
    maxFileSize?: number;
    allowedFileTypes?: string[];
    defaultStorageLimit?: number;
    registrationEnabled?: boolean;
    maintenanceMode?: boolean;
  }): Promise<ApiResponse<void>> {
    try {
      return await httpService.put<void>('/api/admin/config', config);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update system config');
    }
  }

  // Nettoyage des fichiers expirés
  async cleanupExpiredFiles(): Promise<
    ApiResponse<{
      deletedFiles: number;
      freedSpace: number;
    }>
  > {
    try {
      return await httpService.post<any>('/api/admin/cleanup/files');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to cleanup expired files');
    }
  }

  // Nettoyage des liens de partage expirés
  async cleanupExpiredShareLinks(): Promise<
    ApiResponse<{
      deletedLinks: number;
    }>
  > {
    try {
      return await httpService.post<any>('/api/admin/cleanup/shares');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to cleanup expired share links');
    }
  }

  // Export de données
  async exportData(
    type: 'users' | 'files' | 'shares' | 'all',
    format: 'csv' | 'json'
  ): Promise<void> {
    try {
      const params = new URLSearchParams({
        type,
        format,
      });

      await httpService.download(`/api/admin/export?${params}`, `export_${type}.${format}`);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to export data');
    }
  }

  // Sauvegarde de la base de données
  async createBackup(): Promise<
    ApiResponse<{
      backupId: string;
      filename: string;
      size: number;
      createdAt: string;
    }>
  > {
    try {
      return await httpService.post<any>('/api/admin/backup');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create backup');
    }
  }

  // Liste des sauvegardes
  async getBackups(): Promise<
    ApiResponse<
      Array<{
        id: string;
        filename: string;
        size: number;
        createdAt: string;
      }>
    >
  > {
    try {
      return await httpService.get<any>('/api/admin/backups');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch backups');
    }
  }

  // Téléchargement d'une sauvegarde
  async downloadBackup(backupId: string): Promise<void> {
    try {
      await httpService.download(`/api/admin/backups/${backupId}/download`);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to download backup');
    }
  }

  // Suppression d'une sauvegarde
  async deleteBackup(backupId: string): Promise<ApiResponse<void>> {
    try {
      return await httpService.delete<void>(`/api/admin/backups/${backupId}`);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete backup');
    }
  }
}

// Instance singleton
export const adminService = new AdminService();
export default adminService;
