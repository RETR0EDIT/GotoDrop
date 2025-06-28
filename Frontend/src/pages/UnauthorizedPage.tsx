import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const UnauthorizedPage: React.FC = () => {
  return (
    <Layout className="unauthorized-page">
      <div className="container">
        <div className="unauthorized-content">
          <div className="error-code">403</div>
          <h1>Accès refusé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <div className="unauthorized-actions">
            <Link to="/" className="btn btn-primary">
              Retour à l'accueil
            </Link>
            <Link to="/auth/login" className="btn btn-outline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;
