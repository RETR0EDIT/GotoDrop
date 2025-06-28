import { httpService } from './httpService';
import {
  GOOGLE_OAUTH_CONFIG,
  GOOGLE_OAUTH_URLS,
  generateGoogleAuthUrl,
} from '../config/googleOAuth';
import type { User, UserSession } from '../types';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  verified_email?: boolean;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export interface GoogleAuthResponse {
  user: User;
  session: UserSession;
  token: string;
}

class GoogleOAuthService {
  private state: string | null = null;

  /**
   * Initie le processus de connexion Google OAuth
   */
  public initiateGoogleLogin(): void {
    // Générer un état aléatoire pour la sécurité CSRF
    this.state = this.generateRandomState();

    // Stocker l'état en localStorage pour validation
    localStorage.setItem('google_oauth_state', this.state);

    // Rediriger vers Google OAuth
    const authUrl = generateGoogleAuthUrl(this.state);
    window.location.href = authUrl;
  }

  /**
   * Gère le callback de Google OAuth
   */
  public async handleGoogleCallback(code: string, state: string): Promise<GoogleAuthResponse> {
    try {
      // Vérifier l'état pour prévenir les attaques CSRF
      const storedState = localStorage.getItem('google_oauth_state');
      if (!storedState || storedState !== state) {
        throw new Error('État OAuth invalide');
      }

      // Nettoyer l'état stocké
      localStorage.removeItem('google_oauth_state');

      // Échanger le code contre un token d'accès
      const tokenResponse = await this.exchangeCodeForToken(code);

      // Récupérer les informations utilisateur
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      // Envoyer les données au backend pour authentification/création de compte
      const authResponse = await this.authenticateWithBackend(userInfo, tokenResponse);

      return authResponse;
    } catch (error) {
      console.error('Erreur lors du callback Google OAuth:', error);
      throw error;
    }
  }

  /**
   * Échange le code d'autorisation contre un token d'accès
   */
  private async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
    });

    const response = await fetch(GOOGLE_OAUTH_URLS.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Erreur d'échange de token: ${errorData.error_description || errorData.error}`
      );
    }

    return response.json();
  }

  /**
   * Récupère les informations utilisateur depuis Google
   */
  private async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(`${GOOGLE_OAUTH_URLS.USERINFO}?access_token=${accessToken}`);

    if (!response.ok) {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }

    return response.json();
  }

  /**
   * Authentifie l'utilisateur avec le backend
   */
  private async authenticateWithBackend(
    userInfo: GoogleUserInfo,
    tokenResponse: GoogleTokenResponse
  ): Promise<GoogleAuthResponse> {
    const response = await httpService.post<GoogleAuthResponse>('/auth/google', {
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      picture: userInfo.picture,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
    });

    if (!response.data) {
      throw new Error('Réponse invalide du serveur');
    }

    return response.data;
  }

  /**
   * Génère un état aléatoire pour la sécurité CSRF
   */
  private generateRandomState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Déconnexion Google (révoque les tokens)
   */
  public async revokeGoogleTokens(accessToken: string): Promise<void> {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (error) {
      console.warn('Impossible de révoquer les tokens Google:', error);
    }
  }

  /**
   * Vérifie si Google OAuth est configuré
   */
  public isGoogleOAuthConfigured(): boolean {
    return !!(GOOGLE_OAUTH_CONFIG.CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_SECRET);
  }
}

export const googleOAuthService = new GoogleOAuthService();
