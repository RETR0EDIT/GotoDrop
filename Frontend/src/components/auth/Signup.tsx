import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../shared/LoadingSpinner';
import '../../styles/components/auth.css';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  newsletter: boolean;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validation du prénom
    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }

    // Validation du nom
    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }

    // Validation du mot de passe
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }

    // Validation de la confirmation du mot de passe
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation des conditions d'utilisation
    if (!formData.acceptTerms) {
      errors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear global error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Implémenter l'inscription via API
      console.log('Inscription:', formData);

      // Simulation d'une inscription réussie
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirection vers la page de vérification email ou dashboard
      navigate('/auth/verify-email');
    } catch (err) {
      console.error("Erreur d'inscription:", err);
    }
  };

  const getPasswordStrength = (): { score: number; text: string; color: string } => {
    const password = formData.password;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) return { score, text: 'Faible', color: 'var(--error-color)' };
    if (score <= 3) return { score, text: 'Moyen', color: 'var(--warning-color)' };
    if (score <= 4) return { score, text: 'Bon', color: 'var(--success-color)' };
    return { score, text: 'Excellent', color: 'var(--success-color)' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-subtitle">
            Rejoignez GotoDrop et commencez à publier sur toutes les plateformes
          </p>
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-input ${validationErrors.firstName ? 'error' : ''}`}
                placeholder="Votre prénom"
                required
                autoComplete="given-name"
                disabled={loading}
              />
              {validationErrors.firstName && (
                <span className="form-error">{validationErrors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-input ${validationErrors.lastName ? 'error' : ''}`}
                placeholder="Votre nom"
                required
                autoComplete="family-name"
                disabled={loading}
              />
              {validationErrors.lastName && (
                <span className="form-error">{validationErrors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${validationErrors.email ? 'error' : ''}`}
              placeholder="votre@email.com"
              required
              autoComplete="email"
              disabled={loading}
            />
            {validationErrors.email && <span className="form-error">{validationErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${validationErrors.password ? 'error' : ''}`}
                placeholder="Choisissez un mot de passe"
                required
                autoComplete="new-password"
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

            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                <span className="strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}

            {validationErrors.password && (
              <span className="form-error">{validationErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmer le mot de passe *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirmez votre mot de passe"
                required
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                }
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span className="form-error">{validationErrors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className={validationErrors.acceptTerms ? 'error' : ''}
                disabled={loading}
              />
              <span className="checkbox-text">
                J'accepte les{' '}
                <Link to="/terms" className="link-primary">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="link-primary">
                  politique de confidentialité
                </Link>
              </span>
            </label>
            {validationErrors.acceptTerms && (
              <span className="form-error">{validationErrors.acceptTerms}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkbox-text">
                Je souhaite recevoir les actualités et conseils de GotoDrop
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !formData.acceptTerms}
          >
            {loading ? <LoadingSpinner size="sm" className="inline" /> : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="social-auth">
          <button className="btn btn-social google" disabled={loading}>
            <span className="social-icon">🔍</span> S'inscrire avec Google
          </button>
          <button className="btn btn-social facebook" disabled={loading}>
            <span className="social-icon">📘</span> S'inscrire avec Facebook
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Déjà un compte ?{' '}
            <Link to="/auth/login" className="link-primary">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
