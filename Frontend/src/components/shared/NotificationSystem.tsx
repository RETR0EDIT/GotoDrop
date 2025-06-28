import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useUIStore } from '../../store';

interface NotificationSystemProps {
  children: React.ReactNode;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ children }) => {
  const { notifications, removeNotification } = useUIStore();

  // Configuration des toasts
  const toastConfig = {
    duration: 5000,
    position: 'top-right' as const,
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    success: {
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    },
    error: {
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
    warning: {
      iconTheme: {
        primary: '#f59e0b',
        secondary: '#fff',
      },
    },
    info: {
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#fff',
      },
    },
  };

  return (
    <>
      <Toaster {...toastConfig} />
      {children}
    </>
  );
};

// Hook pour utiliser les notifications
export const useNotifications = () => {
  const { addNotification } = useUIStore();

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration?: number
  ) => {
    addNotification({
      type,
      message,
      duration,
    });

    // Afficher aussi avec react-hot-toast pour l'immédiat
    switch (type) {
      case 'success':
        toast.success(message, { duration });
        break;
      case 'error':
        toast.error(message, { duration });
        break;
      case 'warning':
        toast(message, {
          icon: '⚠️',
          style: { background: '#f59e0b', color: '#fff' },
          duration,
        });
        break;
      case 'info':
        toast(message, {
          icon: 'ℹ️',
          style: { background: '#3b82f6', color: '#fff' },
          duration,
        });
        break;
    }
  };

  return {
    showNotification,
    success: (message: string, duration?: number) => showNotification(message, 'success', duration),
    error: (message: string, duration?: number) => showNotification(message, 'error', duration),
    warning: (message: string, duration?: number) => showNotification(message, 'warning', duration),
    info: (message: string, duration?: number) => showNotification(message, 'info', duration),
  };
};
