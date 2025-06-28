import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { authService } from '../services';
import type { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    setUser,
    setToken,
    setLoading,
    setError,
    setSession,
    clearSession,
    logout: logoutStore,
  } = useAuthStore();

  // Initialisation au montage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        authService.initialize();

        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          const tokenData = authService.getToken();

          if (userData && tokenData) {
            setUser(userData);
            setToken(tokenData);

            // Vérifier la validité du token
            const isValid = await authService.checkTokenValidity();
            if (!isValid) {
              clearSession();
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError("Erreur d'initialisation de l'authentification");
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setLoading, setUser, setToken, setError, clearSession]);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        setSession(response.data);
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
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(userData);

      if (response.success && response.data) {
        setSession(response.data);
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
    try {
      setLoading(true);
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logoutStore();
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.refreshToken();

      if (response.success && response.data) {
        setSession(response.data);
      } else {
        throw new Error('Impossible de rafraîchir le token');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de rafraîchissement';
      setError(errorMessage);
      logoutStore();
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
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };
};
