import { useState, useEffect } from 'react';
import { authService } from '../services';
import type { User, LoginRequest, RegisterRequest } from '../types';

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);

      // Vérifier s'il y a un token stocké
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Simulation d'une vérification de token
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulation d'un utilisateur authentifié
      const mockUser: AuthUser = {
        id: '1',
        name: 'Utilisateur Test',
        email: 'test@example.com',
        role: 'user',
        avatar: undefined,
      };

      setUser(mockUser);
    } catch (err) {
      console.error('Erreur vérification auth:', err);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      // Simulation d'un appel API de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validation simple pour la demo
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        const mockUser: AuthUser = {
          id: '1',
          name: 'Utilisateur Test',
          email: credentials.email,
          role: 'user',
        };

        // Stocker le token (simulation)
        localStorage.setItem('auth_token', 'mock_token_123');
        setUser(mockUser);
      } else if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
        const mockAdmin: AuthUser = {
          id: '2',
          name: 'Administrateur',
          email: credentials.email,
          role: 'admin',
        };

        localStorage.setItem('auth_token', 'mock_admin_token_456');
        setUser(mockAdmin);
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setError(null);
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
    logout,
    clearError,
  };
};
