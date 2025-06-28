import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser({
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="user-profile loading">
        <LoadingSpinner size="lg" />
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!user) {
    return <div className="alert alert-warning">Aucun utilisateur trouvé</div>;
  }

  return (
    <div className="user-profile">
      <div className="card">
        <div className="card-header">
          <h2>Mon Profil</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Nom</label>
            <div className="form-value">{user.name}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="form-value">{user.email}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Membre depuis</label>
            <div className="form-value">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn btn-primary">Modifier le profil</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
