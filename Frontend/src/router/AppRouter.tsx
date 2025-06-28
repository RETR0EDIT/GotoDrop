import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Navigation from '../components/shared/Navigation';

// Lazy loading des pages
const HomePage = React.lazy(() => import('../pages/HomePage'));
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = React.lazy(() => import('../pages/auth/SignupPage'));
const FeaturesPage = React.lazy(() => import('../pages/FeaturesPage'));
const PricingPage = React.lazy(() => import('../pages/PricingPage'));

// Navigation items pour la landing page
const landingNavItems = [
  { path: '/', label: 'Accueil', icon: '🏠' },
  { path: '/features', label: 'Fonctionnalités', icon: '⚡' },
  { path: '/pricing', label: 'Tarifs', icon: '💰' },
  { path: '/auth/login', label: 'Connexion', icon: '🔐' },
];

const LoadingFallback: React.FC = () => (
  <div className="loading-fallback">
    <LoadingSpinner size="lg" />
    <p>Chargement de la page...</p>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="app-layout">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Page d'accueil avec navigation */}
              <Route
                path="/"
                element={
                  <>
                    <header className="app-header">
                      <div className="container">
                        <Navigation items={landingNavItems} />
                      </div>
                    </header>
                    <HomePage />
                  </>
                }
              />

              {/* Routes d'authentification (sans navigation) */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />

              {/* Redirections */}
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
              <Route path="/register" element={<Navigate to="/auth/signup" replace />} />

              {/* Pages avec navigation */}
              <Route
                path="/features"
                element={
                  <>
                    <header className="app-header">
                      <div className="container">
                        <Navigation items={landingNavItems} />
                      </div>
                    </header>
                    <FeaturesPage />
                  </>
                }
              />
              <Route
                path="/pricing"
                element={
                  <>
                    <header className="app-header">
                      <div className="container">
                        <Navigation items={landingNavItems} />
                      </div>
                    </header>
                    <PricingPage />
                  </>
                }
              />
              <Route
                path="/demo"
                element={
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Démo</h1>
                    <p>Démo interactive à venir...</p>
                  </div>
                }
              />

              {/* Route par défaut */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRouter;
