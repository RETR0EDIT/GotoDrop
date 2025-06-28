import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalFiles: number;
  storageUsed: string;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        setStats({
          totalUsers: 1234,
          activeUsers: 987,
          totalFiles: 5678,
          storageUsed: '2.4 GB',
        });
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error('Erreur de chargement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <LoadingSpinner size="lg" />
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!stats) {
    return <div className="alert alert-warning">Aucune donnée disponible</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Tableau de bord administrateur</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="card">
            <div className="card-body">
              <h3>Utilisateurs totaux</h3>
              <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="card">
            <div className="card-body">
              <h3>Utilisateurs actifs</h3>
              <div className="stat-value">{stats.activeUsers.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="card">
            <div className="card-body">
              <h3>Fichiers totaux</h3>
              <div className="stat-value">{stats.totalFiles.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="card">
            <div className="card-body">
              <h3>Stockage utilisé</h3>
              <div className="stat-value">{stats.storageUsed}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="card">
          <div className="card-header">
            <h2>Actions rapides</h2>
          </div>
          <div className="card-body">
            <div className="action-buttons">
              <button className="btn btn-primary">Ajouter un utilisateur</button>
              <button className="btn btn-secondary">Exporter les données</button>
              <button className="btn btn-outline">Voir les logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
