import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setUsers([
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'user',
            status: 'active',
            createdAt: '2023-01-15T10:30:00Z',
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'admin',
            status: 'active',
            createdAt: '2023-02-20T14:15:00Z',
          },
          {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            role: 'user',
            status: 'inactive',
            createdAt: '2023-03-10T09:45:00Z',
          },
        ]);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        console.error('Erreur de chargement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = (userId: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  if (loading) {
    return (
      <div className="admin-user-list loading">
        <LoadingSpinner size="lg" />
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="admin-user-list">
      <div className="card">
        <div className="card-header">
          <h2>Gestion des utilisateurs</h2>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body">
          {filteredUsers.length === 0 ? (
            <div className="alert alert-info">Aucun utilisateur trouvé</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}
                      >
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleStatusToggle(user.id)}
                      >
                        {user.status === 'active' ? 'Désactiver' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
