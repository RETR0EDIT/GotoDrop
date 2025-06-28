import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const NotFoundPage: React.FC = () => {
  return (
    <Layout className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page non trouvée</h1>
          <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              Retour à l'accueil
            </Link>
            <Link to="/features" className="btn btn-outline">
              Découvrir les fonctionnalités
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
