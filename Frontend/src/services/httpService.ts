import { API_CONFIG, DEFAULT_HEADERS } from '../config/api';
import type { ApiResponse } from '../types';

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

class HttpService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = { ...DEFAULT_HEADERS };
  }

  // Gestion du token d'authentification
  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  // Méthode générique pour les requêtes
  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { headers = {}, timeout = API_CONFIG.TIMEOUT, signal, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }

      throw new Error('Unknown error occurred');
    }
  }

  // Méthodes HTTP
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...config });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config });
  }

  // Upload de fichiers
  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig & { onProgress?: (progress: number) => void }
  ): Promise<ApiResponse<T>> {
    const { onProgress, headers = {}, timeout = API_CONFIG.UPLOAD_TIMEOUT } = config || {};

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Gestion du timeout
      const timeoutId = setTimeout(() => {
        xhr.abort();
        reject(new Error('Upload timeout'));
      }, timeout);

      // Gestion du progrès
      if (onProgress) {
        xhr.upload.addEventListener('progress', event => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            onProgress(progress);
          }
        });
      }

      // Gestion de la réponse
      xhr.addEventListener('load', () => {
        clearTimeout(timeoutId);

        try {
          const response = JSON.parse(xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response);
          } else {
            reject(new Error(response.message || `HTTP Error: ${xhr.status}`));
          }
        } catch {
          reject(new Error('Invalid JSON response'));
        }
      });

      xhr.addEventListener('error', () => {
        clearTimeout(timeoutId);
        reject(new Error('Network error'));
      });

      xhr.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Upload cancelled'));
      });

      // Configuration et envoi
      xhr.open('POST', `${this.baseURL}${endpoint}`);

      // Headers (sauf Content-Type pour FormData)
      Object.entries({
        ...this.defaultHeaders,
        ...headers,
      }).forEach(([key, value]) => {
        if (key.toLowerCase() !== 'content-type') {
          xhr.setRequestHeader(key, value);
        }
      });

      xhr.send(formData);
    });
  }

  // Téléchargement de fichiers
  async download(endpoint: string, filename?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.defaultHeaders,
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Download failed');
    }
  }
}

// Instance singleton
export const httpService = new HttpService();
export default httpService;
