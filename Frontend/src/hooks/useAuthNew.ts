import { useState, useEffect } from 'react';
import { authService } from '../services';
import type { User, LoginRequest, RegisterRequest } from '../types';

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialisation au montage du composant
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        authService.initialize();

        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          setUser(userData);

          // Vérifier la validité du token
          const isValid = await authService.checkTokenValidity();
          if (!isValid) {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError("Erreur d'initialisation de l'authentification");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Erreur de connexion');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);

      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Erreur d'inscription");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'inscription";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // On continue même si la déconnexion échoue côté serveur
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.refreshToken();

      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error('Impossible de rafraîchir le token');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de rafraîchissement';
      setError(errorMessage);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };
};

export default useAuth;
