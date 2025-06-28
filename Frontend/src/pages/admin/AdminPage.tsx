import React, { Suspense } from 'react';
import Layout from '../../components/shared/Layout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import '../../styles/pages/admin.css';

// Lazy loading des composants admin
const AdminDashboard = React.lazy(() => import('../../components/admin/AdminDashboard'));
const AdminUserList = React.lazy(() => import('../../components/admin/AdminUserList'));

interface AdminPageProps {
  component: 'dashboard' | 'users';
}

export const AdminPage: React.FC<AdminPageProps> = ({ component }) => {
  const renderComponent = () => {
    switch (component) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUserList />;
      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <Layout className="admin-page">
      <div className="container">
        <Suspense
          fallback={
            <div className="loading-container">
              <LoadingSpinner size="lg" />
              <p>Chargement de la page admin...</p>
            </div>
          }
        >
          {renderComponent()}
        </Suspense>
      </div>
    </Layout>
  );
};

export default AdminPage;
