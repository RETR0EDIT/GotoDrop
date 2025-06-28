// Types de base
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Utilisateur
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  storageUsed: number;
  storageLimit: number;
}

// Fichier
export interface FileItem extends BaseEntity {
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  ownerId: string;
  owner?: User;
  isPublic: boolean;
  downloadCount: number;
  expiresAt?: string;
  description?: string;
  tags: string[];
}

// Lien de partage
export interface ShareLink extends BaseEntity {
  fileId: string;
  file?: FileItem;
  token: string;
  isActive: boolean;
  expiresAt?: string;
  downloadLimit?: number;
  downloadCount: number;
  password?: string;
  allowPreview: boolean;
  createdBy: string;
  creator?: User;
}

// Session utilisateur
export interface UserSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// Statistiques
export interface UserStats {
  totalFiles: number;
  totalStorage: number;
  totalShares: number;
  totalDownloads: number;
  recentFiles: FileItem[];
  recentShares: ShareLink[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalFiles: number;
  totalStorage: number;
  totalShares: number;
  totalDownloads: number;
  recentUsers: User[];
  storageByDate: Array<{ date: string; storage: number }>;
  usersByDate: Array<{ date: string; users: number }>;
}

// Requêtes API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface CreateShareLinkRequest {
  fileId: string;
  expiresAt?: string;
  downloadLimit?: number;
  password?: string;
  allowPreview?: boolean;
}

export interface UpdateShareLinkRequest {
  isActive?: boolean;
  expiresAt?: string;
  downloadLimit?: number;
  password?: string;
  allowPreview?: boolean;
}

// Réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filtres et recherche
export interface FileFilters {
  search?: string;
  mimeType?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'size' | 'createdAt' | 'downloadCount';
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilters {
  search?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

// Upload
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadOptions {
  isPublic?: boolean;
  description?: string;
  tags?: string[];
  expiresAt?: string;
}
