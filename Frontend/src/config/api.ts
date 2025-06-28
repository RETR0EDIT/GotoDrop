// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  UPLOAD_TIMEOUT: 300000, // 5 minutes pour les uploads
} as const;

// Endpoints
export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },

  // Utilisateurs
  USERS: {
    LIST: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    STATS: (id: string) => `/api/users/${id}/stats`,
  },

  // Fichiers
  FILES: {
    LIST: '/api/files',
    GET: (id: string) => `/api/files/${id}`,
    UPLOAD: '/api/files/upload',
    DOWNLOAD: (id: string) => `/api/files/${id}/download`,
    DELETE: (id: string) => `/api/files/${id}`,
    UPDATE: (id: string) => `/api/files/${id}`,
    PREVIEW: (id: string) => `/api/files/${id}/preview`,
  },

  // Liens de partage
  SHARES: {
    LIST: '/api/shares',
    GET: (id: string) => `/api/shares/${id}`,
    CREATE: '/api/shares',
    UPDATE: (id: string) => `/api/shares/${id}`,
    DELETE: (id: string) => `/api/shares/${id}`,
    PUBLIC: (token: string) => `/api/public/shares/${token}`,
    DOWNLOAD: (token: string) => `/api/public/shares/${token}/download`,
  },

  // Administration
  ADMIN: {
    STATS: '/api/admin/stats',
    USERS: '/api/admin/users',
    FILES: '/api/admin/files',
    SHARES: '/api/admin/shares',
  },
} as const;

// Headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const;
