import { httpService } from './httpService';
import { API_ENDPOINTS } from '../config/api';
import type {
  User,
  UserStats,
  UpdateUserRequest,
  UserFilters,
  PaginatedResponse,
  ApiResponse,
} from '../types';

class UserService {
  // Récupération de la liste des utilisateurs (admin)
  async getUsers(
    filters?: UserFilters,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.role && { role: filters.role }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive.toString() }),
        ...(filters?.sortBy && { sortBy: filters.sortBy }),
        ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
      });

      return await httpService.get<PaginatedResponse<User>>(
        `${API_ENDPOINTS.USERS.LIST}?${params}`
      );
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch users');
    }
  }

  // Récupération d'un utilisateur par ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      return await httpService.get<User>(API_ENDPOINTS.USERS.GET(id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch user');
    }
  }

  // Mise à jour d'un utilisateur
  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      return await httpService.put<User>(API_ENDPOINTS.USERS.UPDATE(id), userData);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update user');
    }
  }

  // Suppression d'un utilisateur (admin)
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      return await httpService.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete user');
    }
  }

  // Récupération des statistiques d'un utilisateur
  async getUserStats(id: string): Promise<ApiResponse<UserStats>> {
    try {
      return await httpService.get<UserStats>(API_ENDPOINTS.USERS.STATS(id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch user stats');
    }
  }

  // Mise à jour du profil de l'utilisateur connecté
  async updateProfile(userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      return await httpService.put<User>(API_ENDPOINTS.AUTH.ME, userData);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update profile');
    }
  }

  // Upload d'avatar
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      return await httpService.upload<{ avatarUrl: string }>('/api/users/avatar', formData);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to upload avatar');
    }
  }

  // Changement de mot de passe
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      return await httpService.post<void>('/api/users/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to change password');
    }
  }

  // Désactivation/activation d'un compte (admin)
  async toggleUserStatus(id: string, isActive: boolean): Promise<ApiResponse<User>> {
    try {
      return await httpService.patch<User>(API_ENDPOINTS.USERS.UPDATE(id), {
        isActive,
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to toggle user status');
    }
  }

  // Récupération des utilisateurs récents (admin)
  async getRecentUsers(limit = 10): Promise<ApiResponse<User[]>> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const response = await httpService.get<PaginatedResponse<User>>(
        `${API_ENDPOINTS.USERS.LIST}?${params}`
      );

      return {
        ...response,
        data: response.data?.data || [],
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch recent users');
    }
  }

  // Recherche d'utilisateurs
  async searchUsers(query: string, limit = 10): Promise<ApiResponse<User[]>> {
    try {
      const params = new URLSearchParams({
        search: query,
        limit: limit.toString(),
      });

      const response = await httpService.get<PaginatedResponse<User>>(
        `${API_ENDPOINTS.USERS.LIST}?${params}`
      );

      return {
        ...response,
        data: response.data?.data || [],
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to search users');
    }
  }
}

// Instance singleton
export const userService = new UserService();
export default userService;
