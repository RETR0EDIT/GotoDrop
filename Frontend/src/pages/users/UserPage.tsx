import React, { Suspense } from 'react';
import Layout from '../../components/shared/Layout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import '../../styles/pages/user.css';

// Lazy loading des composants utilisateurs
const UserProfile = React.lazy(() => import('../../components/users/UserProfile'));
const UserLogin = React.lazy(() => import('../../components/users/UserLogin'));

interface UserPageProps {
  component: 'profile' | 'login';
}

export const UserPage: React.FC<UserPageProps> = ({ component }) => {
  const renderComponent = () => {
    switch (component) {
      case 'profile':
        return <UserProfile />;
      case 'login':
        return <UserLogin />;
      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <Layout className="user-page">
      <div className="container">
        <Suspense
          fallback={
            <div className="loading-container">
              <LoadingSpinner size="lg" />
              <p>Chargement de la page...</p>
            </div>
          }
        >
          {renderComponent()}
        </Suspense>
      </div>
    </Layout>
  );
};

export default UserPage;
