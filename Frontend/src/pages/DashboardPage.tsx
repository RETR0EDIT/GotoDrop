import React from 'react';
import Layout from '../components/shared/Layout';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Tableau de bord</h1>
          <p>Bienvenue, {user?.name || 'Utilisateur'} !</p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Fichiers</h3>
              <div className="stat-value">12</div>
              <p>fichiers stockés</p>
            </div>

            <div className="stat-card">
              <h3>Stockage</h3>
              <div className="stat-value">2.4 GB</div>
              <p>utilisés sur 10 GB</p>
            </div>

            <div className="stat-card">
              <h3>Partages</h3>
              <div className="stat-value">5</div>
              <p>liens actifs</p>
            </div>
          </div>

          <div className="dashboard-actions">
            <div className="action-grid">
              <div className="action-card">
                <h3>📁 Mes fichiers</h3>
                <p>Gérer vos fichiers stockés</p>
                <button className="btn btn-primary">Voir les fichiers</button>
              </div>

              <div className="action-card">
                <h3>📤 Nouveau partage</h3>
                <p>Uploader et partager un fichier</p>
                <button className="btn btn-secondary">Uploader</button>
              </div>

              <div className="action-card">
                <h3>🔗 Liens de partage</h3>
                <p>Gérer vos liens actifs</p>
                <button className="btn btn-outline">Voir les liens</button>
              </div>

              <div className="action-card">
                <h3>⚙️ Paramètres</h3>
                <p>Configurer votre compte</p>
                <button className="btn btn-outline">Paramètres</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
