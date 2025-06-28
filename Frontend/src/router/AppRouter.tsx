import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import DynamicNavigation from '../components/shared/DynamicNavigation';
import ProtectedRoute from '../components/shared/ProtectedRoute';

// Lazy loading des pages
const HomePage = React.lazy(() => import('../pages/HomePage'));
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = React.lazy(() => import('../pages/auth/SignupPage'));
const FeaturesPage = React.lazy(() => import('../pages/FeaturesPage'));
const PricingPage = React.lazy(() => import('../pages/PricingPage'));

// Pages admin
const AdminPage = React.lazy(() => import('../pages/admin/AdminPage'));

// Pages utilisateurs
const UserPage = React.lazy(() => import('../pages/users/UserPage'));

// Pages d'erreur
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));
const UnauthorizedPage = React.lazy(() => import('../pages/UnauthorizedPage'));

// Tableau de bord utilisateur
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));

// Page des fichiers
const FilesPage = React.lazy(() => import('../pages/FilesPage'));

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
                        <DynamicNavigation />
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

              {/* Routes protégées - Administration */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage component="dashboard" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage component="dashboard" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage component="users" />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Utilisateurs */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/files"
                element={
                  <ProtectedRoute>
                    <FilesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserPage component="profile" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute>
                    <UserPage component="profile" />
                  </ProtectedRoute>
                }
              />
              <Route path="/user/login" element={<UserPage component="login" />} />

              {/* Page d'accès refusé */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Pages avec navigation */}
              <Route
                path="/features"
                element={
                  <>
                    <header className="app-header">
                      <div className="container">
                        <DynamicNavigation />
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
                        <DynamicNavigation />
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

              {/* Page 404 */}
              <Route path="/404" element={<NotFoundPage />} />

              {/* Route par défaut - redirige vers 404 pour les pages non trouvées */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRouter;
