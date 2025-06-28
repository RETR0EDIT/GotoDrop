import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../shared/LoadingSpinner';
import SocialButton from '../shared/SocialButton';
import '../../styles/components/auth.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Redirection après connexion réussie
      navigate('/dashboard');
    } catch (err) {
      // L'erreur est gérée par le hook useAuth
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">Connectez-vous à votre compte GotoDrop</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
            <button className="alert-close" onClick={clearError} aria-label="Fermer l'alerte">
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="votre@email.com"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Votre mot de passe"
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkbox-text">Se souvenir de moi</span>
            </label>

            <Link to="/auth/forgot-password" className="link-secondary">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? <LoadingSpinner size="sm" className="inline" /> : 'Se connecter'}
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="social-auth">
          <SocialButton provider="google" disabled={loading}>
            Continuer avec Google
          </SocialButton>
          <SocialButton provider="facebook" disabled={loading}>
            Continuer avec Facebook
          </SocialButton>
        </div>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/auth/signup" className="link-primary">
              Créer un compte
            </Link>
          </p>
        </div>

        <div className="demo-credentials">
          <details>
            <summary>Comptes de démonstration</summary>
            <div className="demo-accounts">
              <p>
                <strong>Utilisateur :</strong> test@example.com / password
              </p>
              <p>
                <strong>Admin :</strong> admin@example.com / admin
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Login;
