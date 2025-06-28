import { httpService } from './httpService';
import { API_ENDPOINTS } from '../config/api';
import type { User, UserSession, LoginRequest, RegisterRequest, ApiResponse } from '../types';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  // Connexion
  async login(credentials: LoginRequest): Promise<ApiResponse<UserSession>> {
    try {
      const response = await httpService.post<UserSession>(API_ENDPOINTS.AUTH.LOGIN, credentials);

      if (response.success && response.data) {
        this.setSession(response.data);
      }

      return response;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  // Inscription
  async register(userData: RegisterRequest): Promise<ApiResponse<UserSession>> {
    try {
      const response = await httpService.post<UserSession>(API_ENDPOINTS.AUTH.REGISTER, userData);

      if (response.success && response.data) {
        this.setSession(response.data);
      }

      return response;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Registration failed');
    }
  }

  // Rafraîchissement du token
  async refreshToken(): Promise<ApiResponse<UserSession>> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await httpService.post<UserSession>(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      if (response.success && response.data) {
        this.setSession(response.data);
      }

      return response;
    } catch (error) {
      this.clearSession();
      throw error instanceof Error ? error : new Error('Token refresh failed');
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await httpService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // On continue même si la requête échoue
      console.warn('Logout request failed:', error);
    } finally {
      this.clearSession();
    }
  }

  // Récupération du profil utilisateur
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await httpService.get<User>(API_ENDPOINTS.AUTH.ME);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to get current user');
    }
  }

  // Gestion de la session locale
  private setSession(session: UserSession): void {
    localStorage.setItem(this.TOKEN_KEY, session.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, session.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(session.user));

    httpService.setAuthToken(session.token);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    httpService.removeAuthToken();
  }

  // Getters pour les données de session
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Vérification de l'authentification
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Vérification du rôle
  hasRole(role: 'admin' | 'user'): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Initialisation (à appeler au démarrage de l'application)
  initialize(): void {
    const token = this.getToken();
    if (token) {
      httpService.setAuthToken(token);
    }
  }

  // Vérification automatique de l'expiration du token
  async checkTokenValidity(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      await this.getCurrentUser();
      return true;
    } catch {
      // Si le token est expiré, essayer de le rafraîchir
      try {
        await this.refreshToken();
        return true;
      } catch {
        this.clearSession();
        return false;
      }
    }
  }
}

// Instance singleton
export const authService = new AuthService();
export default authService;
