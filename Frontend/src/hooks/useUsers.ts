import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: Date | null;
  createdAt: Date;
}

export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredUsers: User[];
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  refetch: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation de données - à remplacer par un appel API réel
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Alice Martin',
      email: 'alice@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date('2024-06-27'),
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Bob Dupont',
      email: 'bob@example.com',
      role: 'user',
      status: 'active',
      lastLogin: new Date('2024-06-26'),
      createdAt: new Date('2024-02-20'),
    },
    {
      id: '3',
      name: 'Claire Moreau',
      email: 'claire@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: null,
      createdAt: new Date('2024-03-10'),
    },
    {
      id: '4',
      name: 'David Bernard',
      email: 'david@example.com',
      role: 'user',
      status: 'active',
      lastLogin: new Date('2024-06-25'),
      createdAt: new Date('2024-04-05'),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Remplacer par un véritable appel API
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setUsers(data);

      setUsers(mockUsers);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Erreur fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    toggleUserStatus,
    deleteUser,
    refetch,
  };
};
