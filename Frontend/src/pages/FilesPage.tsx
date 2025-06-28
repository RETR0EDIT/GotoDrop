import React, { useState } from 'react';
import Layout from '../components/shared/Layout';

interface FileItem {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  isShared: boolean;
  shareLink?: string;
}

const FilesPage: React.FC = () => {
  const [files] = useState<FileItem[]>([
    {
      id: '1',
      name: 'document.pdf',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      isShared: true,
      shareLink: 'https://gotodrop.com/s/abc123',
    },
    {
      id: '2',
      name: 'image.jpg',
      size: '1.2 MB',
      uploadDate: '2024-01-14',
      isShared: false,
    },
    {
      id: '3',
      name: 'archive.zip',
      size: '15.8 MB',
      uploadDate: '2024-01-13',
      isShared: true,
      shareLink: 'https://gotodrop.com/s/def456',
    },
  ]);

  const handleShare = (fileId: string) => {
    console.log('Partager le fichier:', fileId);
    // Logique de partage à implémenter
  };

  const handleDownload = (fileId: string) => {
    console.log('Télécharger le fichier:', fileId);
    // Logique de téléchargement à implémenter
  };

  const handleDelete = (fileId: string) => {
    console.log('Supprimer le fichier:', fileId);
    // Logique de suppression à implémenter
  };

  return (
    <Layout className="files-page">
      <div className="container">
        <div className="page-header">
          <h1>Mes fichiers</h1>
          <button className="btn btn-primary">📤 Uploader un fichier</button>
        </div>

        <div className="files-content">
          <div className="files-stats">
            <div className="stat-item">
              <span className="stat-value">{files.length}</span>
              <span className="stat-label">Fichiers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">19.4 MB</span>
              <span className="stat-label">Utilisés</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{files.filter(f => f.isShared).length}</span>
              <span className="stat-label">Partagés</span>
            </div>
          </div>

          <div className="files-list">
            {files.length === 0 ? (
              <div className="empty-state">
                <h3>Aucun fichier</h3>
                <p>Commencez par uploader votre premier fichier</p>
                <button className="btn btn-primary">📤 Uploader</button>
              </div>
            ) : (
              <div className="files-table">
                <div className="table-header">
                  <div className="col-name">Nom</div>
                  <div className="col-size">Taille</div>
                  <div className="col-date">Date</div>
                  <div className="col-status">Statut</div>
                  <div className="col-actions">Actions</div>
                </div>

                {files.map(file => (
                  <div key={file.id} className="table-row">
                    <div className="col-name">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{file.name}</span>
                    </div>
                    <div className="col-size">{file.size}</div>
                    <div className="col-date">
                      {new Date(file.uploadDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="col-status">
                      {file.isShared ? (
                        <span className="status-badge shared">Partagé</span>
                      ) : (
                        <span className="status-badge private">Privé</span>
                      )}
                    </div>
                    <div className="col-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleDownload(file.id)}
                        title="Télécharger"
                      >
                        ⬇️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleShare(file.id)}
                        title="Partager"
                      >
                        🔗
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(file.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FilesPage;
