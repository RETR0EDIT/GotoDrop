import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navigation from './Navigation';

// Navigation items pour différents types d'utilisateurs
const landingNavItems = [
  { path: '/', label: 'Accueil', icon: '🏠' },
  { path: '/features', label: 'Fonctionnalités', icon: '⚡' },
  { path: '/pricing', label: 'Tarifs', icon: '💰' },
  { path: '/auth/login', label: 'Connexion', icon: '🔐' },
];

const userNavItems = [
  { path: '/', label: 'Accueil', icon: '🏠' },
  { path: '/dashboard', label: 'Tableau de bord', icon: '📊' },
  { path: '/files', label: 'Mes fichiers', icon: '�' },
  { path: '/profile', label: 'Mon Profil', icon: '👤' },
];

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Utilisateurs', icon: '👥' },
  { path: '/profile', label: 'Mon Profil', icon: '👤' },
];

interface DynamicNavigationProps {
  className?: string;
}

const DynamicNavigation: React.FC<DynamicNavigationProps> = ({ className }) => {
  const { isAuthenticated, user } = useAuth();

  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return landingNavItems;
    }

    if (user?.role === 'admin') {
      return adminNavItems;
    }

    return userNavItems;
  };

  return (
    <div className={className}>
      <Navigation items={getNavigationItems()} />
    </div>
  );
};

export default DynamicNavigation;
