import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileStore } from '../../store';
import { useNotifications } from '../shared/NotificationSystem';
import clsx from 'clsx';
import '../styles/components/fileUpload.css';

interface FileUploadProps {
  onUploadComplete?: (fileId: string) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number; // en bytes
  acceptedTypes?: string[];
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB par défaut
  acceptedTypes = ['*/*'],
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { uploads, addUpload, updateUploadProgress, updateUploadStatus } = useFileStore();
  const { showNotification } = useNotifications();

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Gérer les fichiers rejetés
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          errors.forEach((error: any) => {
            const errorMessage = getErrorMessage(error.code, file.name);
            showNotification(errorMessage, 'error');
            onUploadError?.(errorMessage);
          });
        });
        return;
      }

      // Vérifier la limite de fichiers
      if (uploads.length + acceptedFiles.length > maxFiles) {
        const errorMessage = `Maximum ${maxFiles} fichiers autorisés`;
        showNotification(errorMessage, 'error');
        onUploadError?.(errorMessage);
        return;
      }

      setIsUploading(true);

      try {
        for (const file of acceptedFiles) {
          const uploadId = addUpload(file);

          // Simuler l'upload (remplacer par votre logique d'upload)
          await simulateUpload(uploadId, file);
        }

        showNotification(`${acceptedFiles.length} fichier(s) uploadé(s) avec succès`, 'success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'upload";
        showNotification(errorMessage, 'error');
        onUploadError?.(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [uploads.length, maxFiles, addUpload, showNotification, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>
    ),
  });

  const getErrorMessage = (code: string, fileName: string): string => {
    switch (code) {
      case 'file-too-large':
        return `Le fichier ${fileName} est trop volumineux`;
      case 'file-too-small':
        return `Le fichier ${fileName} est trop petit`;
      case 'too-many-files':
        return `Trop de fichiers sélectionnés`;
      case 'file-invalid-type':
        return `Le type de fichier ${fileName} n'est pas supporté`;
      default:
        return `Erreur avec le fichier ${fileName}`;
    }
  };

  const simulateUpload = async (uploadId: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Simuler un succès ou échec aléatoire
          if (Math.random() > 0.1) {
            // 90% de succès
            updateUploadStatus(uploadId, 'completed');
            onUploadComplete?.(uploadId);
            resolve();
          } else {
            updateUploadStatus(uploadId, 'error', 'Erreur simulée');
            reject(new Error('Erreur simulée'));
          }
        } else {
          updateUploadProgress(uploadId, progress);
          updateUploadStatus(uploadId, 'uploading');
        }
      }, 200);
    });
  };

  return (
    <div className={clsx('file-upload-container', className)}>
      <div
        {...getRootProps()}
        className={clsx('dropzone', {
          'dropzone-active': isDragActive,
          'dropzone-reject': isDragReject,
          'dropzone-uploading': isUploading,
        })}
      >
        <input {...getInputProps()} />

        <div className="dropzone-content">
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="7,10 12,15 17,10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="15"
                x2="12"
                y2="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="upload-title">
            {isDragActive
              ? isDragReject
                ? 'Fichiers non supportés'
                : 'Déposez vos fichiers ici'
              : 'Glissez-déposez vos fichiers'}
          </h3>

          <p className="upload-description">ou cliquez pour sélectionner des fichiers</p>

          <div className="upload-limits">
            <span>Maximum {maxFiles} fichiers</span>
            <span>•</span>
            <span>Taille max: {formatFileSize(maxSize)}</span>
          </div>
        </div>
      </div>

      {/* Liste des uploads en cours */}
      {uploads.length > 0 && (
        <div className="uploads-list">
          <h4>Uploads en cours ({uploads.length})</h4>
          {uploads.map(upload => (
            <div key={upload.id} className="upload-item">
              <div className="upload-info">
                <span className="upload-name">{upload.file.name}</span>
                <span className="upload-size">{formatFileSize(upload.file.size)}</span>
              </div>

              <div className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${upload.progress}%` }} />
                </div>
                <span className="progress-text">{Math.round(upload.progress)}%</span>
              </div>

              <div className="upload-status">
                {upload.status === 'completed' && <span className="status-success">✓ Terminé</span>}
                {upload.status === 'error' && <span className="status-error">✗ Erreur</span>}
                {upload.status === 'uploading' && (
                  <span className="status-uploading">⏳ En cours...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
