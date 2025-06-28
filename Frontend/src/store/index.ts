import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, UserSession } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSession: (session: UserSession) => void;
  clearSession: () => void;
  logout: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;

  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface FileState {
  uploads: Array<{
    id: string;
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
  }>;

  // Actions
  addUpload: (file: File) => string;
  updateUploadProgress: (id: string, progress: number) => void;
  updateUploadStatus: (
    id: string,
    status: FileState['uploads'][0]['status'],
    error?: string
  ) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;
}

// Store d'authentification
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      set => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        setUser: user => set({ user, isAuthenticated: !!user }),
        setToken: token => set({ token }),
        setLoading: loading => set({ loading }),
        setError: error => set({ error }),
        setSession: session =>
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
            error: null,
          }),
        clearSession: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          }),
        logout: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          }),
      }),
      {
        name: 'auth-storage',
        partialize: state => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

// Store UI
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        sidebarOpen: false,
        theme: 'light',
        notifications: [],

        toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: theme => set({ theme }),
        addNotification: notification => {
          const id = Math.random().toString(36).substr(2, 9);
          const newNotification = { ...notification, id };
          set(state => ({
            notifications: [...state.notifications, newNotification],
          }));

          // Auto-remove notification after duration
          if (notification.duration !== 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, notification.duration || 5000);
          }
        },
        removeNotification: id =>
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== id),
          })),
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'ui-storage',
        partialize: state => ({ theme: state.theme }),
      }
    )
  )
);

// Store fichiers
export const useFileStore = create<FileState>()(
  devtools(set => ({
    uploads: [],

    addUpload: file => {
      const id = Math.random().toString(36).substr(2, 9);
      set(state => ({
        uploads: [
          ...state.uploads,
          {
            id,
            file,
            progress: 0,
            status: 'pending',
          },
        ],
      }));
      return id;
    },
    updateUploadProgress: (id, progress) =>
      set(state => ({
        uploads: state.uploads.map(upload => (upload.id === id ? { ...upload, progress } : upload)),
      })),
    updateUploadStatus: (id, status, error) =>
      set(state => ({
        uploads: state.uploads.map(upload =>
          upload.id === id ? { ...upload, status, error } : upload
        ),
      })),
    removeUpload: id =>
      set(state => ({
        uploads: state.uploads.filter(upload => upload.id !== id),
      })),
    clearUploads: () => set({ uploads: [] }),
  }))
);
