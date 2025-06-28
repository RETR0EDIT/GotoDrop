import { httpService } from './httpService';
import { API_ENDPOINTS } from '../config/api';
import type {
  FileItem,
  FileFilters,
  UploadOptions,
  UploadProgress,
  PaginatedResponse,
  ApiResponse,
} from '../types';

class FileService {
  // Récupération de la liste des fichiers
  async getFiles(
    filters?: FileFilters,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<FileItem>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.mimeType && { mimeType: filters.mimeType }),
        ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters?.dateTo && { dateTo: filters.dateTo }),
        ...(filters?.sortBy && { sortBy: filters.sortBy }),
        ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
      });

      if (filters?.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }

      return await httpService.get<PaginatedResponse<FileItem>>(
        `${API_ENDPOINTS.FILES.LIST}?${params}`
      );
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch files');
    }
  }

  // Récupération d'un fichier par ID
  async getFileById(id: string): Promise<ApiResponse<FileItem>> {
    try {
      return await httpService.get<FileItem>(API_ENDPOINTS.FILES.GET(id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch file');
    }
  }

  // Upload d'un fichier
  async uploadFile(
    file: File,
    options?: UploadOptions,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ApiResponse<FileItem>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (options?.isPublic !== undefined) {
        formData.append('isPublic', options.isPublic.toString());
      }
      if (options?.description) {
        formData.append('description', options.description);
      }
      if (options?.expiresAt) {
        formData.append('expiresAt', options.expiresAt);
      }
      if (options?.tags && options.tags.length > 0) {
        options.tags.forEach(tag => formData.append('tags', tag));
      }

      const fileId = crypto.randomUUID();

      return await httpService.upload<FileItem>(API_ENDPOINTS.FILES.UPLOAD, formData, {
        onProgress: progress => {
          onProgress?.({
            fileId,
            fileName: file.name,
            progress,
            status: progress === 100 ? 'completed' : 'uploading',
          });
        },
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to upload file');
    }
  }

  // Upload multiple de fichiers
  async uploadFiles(
    files: File[],
    options?: UploadOptions,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ApiResponse<FileItem>[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, options, onProgress));

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to upload files');
    }
  }

  // Téléchargement d'un fichier
  async downloadFile(id: string, filename?: string): Promise<void> {
    try {
      await httpService.download(API_ENDPOINTS.FILES.DOWNLOAD(id), filename);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to download file');
    }
  }

  // Prévisualisation d'un fichier
  async getFilePreview(id: string): Promise<string> {
    try {
      const response = await fetch(`${httpService['baseURL']}${API_ENDPOINTS.FILES.PREVIEW(id)}`, {
        headers: httpService['defaultHeaders'],
      });

      if (!response.ok) {
        throw new Error('Failed to get preview');
      }

      return response.url;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to get file preview');
    }
  }

  // Mise à jour des métadonnées d'un fichier
  async updateFile(
    id: string,
    updates: Partial<Pick<FileItem, 'name' | 'description' | 'tags' | 'isPublic'>>
  ): Promise<ApiResponse<FileItem>> {
    try {
      return await httpService.put<FileItem>(API_ENDPOINTS.FILES.UPDATE(id), updates);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update file');
    }
  }

  // Suppression d'un fichier
  async deleteFile(id: string): Promise<ApiResponse<void>> {
    try {
      return await httpService.delete<void>(API_ENDPOINTS.FILES.DELETE(id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete file');
    }
  }

  // Suppression multiple de fichiers
  async deleteFiles(ids: string[]): Promise<ApiResponse<void>[]> {
    const deletePromises = ids.map(id => this.deleteFile(id));

    try {
      return await Promise.all(deletePromises);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete files');
    }
  }

  // Recherche de fichiers
  async searchFiles(query: string, limit = 10): Promise<ApiResponse<FileItem[]>> {
    try {
      const params = new URLSearchParams({
        search: query,
        limit: limit.toString(),
      });

      const response = await httpService.get<PaginatedResponse<FileItem>>(
        `${API_ENDPOINTS.FILES.LIST}?${params}`
      );

      return {
        ...response,
        data: response.data?.data || [],
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to search files');
    }
  }

  // Récupération des fichiers récents
  async getRecentFiles(limit = 10): Promise<ApiResponse<FileItem[]>> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const response = await httpService.get<PaginatedResponse<FileItem>>(
        `${API_ENDPOINTS.FILES.LIST}?${params}`
      );

      return {
        ...response,
        data: response.data?.data || [],
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch recent files');
    }
  }

  // Validation du type de fichier
  validateFileType(file: File, allowedTypes?: string[]): boolean {
    if (!allowedTypes || allowedTypes.length === 0) {
      return true;
    }

    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.replace('/*', '');
        return file.type.startsWith(category + '/');
      }
      return file.type === type;
    });
  }

  // Validation de la taille de fichier
  validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  // Formatage de la taille de fichier
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // Récupération de l'icône selon le type MIME
  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
    if (mimeType.includes('text')) return '📄';
    return '📁';
  }
}

// Instance singleton
export const fileService = new FileService();
export default fileService;
