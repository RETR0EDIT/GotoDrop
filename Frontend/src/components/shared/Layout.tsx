import React from 'react';
import { useUIStore } from '../../store';
import { NotificationSystem } from './NotificationSystem';
import clsx from 'clsx';
import '../styles/components/layout.css';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = false,
  showHeader = true,
  className,
}) => {
  const { sidebarOpen, theme, toggleSidebar } = useUIStore();

  return (
    <NotificationSystem>
      <div className={clsx('app-layout', `theme-${theme}`, className)}>
        {showHeader && (
          <header className="app-header">
            <div className="header-content">
              <div className="header-left">
                {showSidebar && (
                  <button
                    className="sidebar-toggle"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 12H21M3 6H21M3 18H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                <div className="logo">
                  <span className="logo-text">GotoDrop</span>
                </div>
              </div>

              <div className="header-right">
                <button
                  className="theme-toggle"
                  onClick={() =>
                    useUIStore.getState().setTheme(theme === 'light' ? 'dark' : 'light')
                  }
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </header>
        )}

        <div className="main-content">
          {showSidebar && (
            <aside className={clsx('sidebar', { 'sidebar-open': sidebarOpen })}>
              <nav className="sidebar-nav">
                <ul className="nav-list">
                  <li className="nav-item">
                    <a href="/dashboard" className="nav-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="9,22 9,12 15,12 15,22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Dashboard</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/files" className="nav-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="14,2 14,8 20,8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="16"
                          y1="13"
                          x2="8"
                          y2="13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="16"
                          y1="17"
                          x2="8"
                          y2="17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="10,9 9,9 8,9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Fichiers</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/profile" className="nav-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="7"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Profil</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>
          )}

          <main className={clsx('main', { 'with-sidebar': showSidebar })}>{children}</main>
        </div>

        {/* Overlay pour fermer la sidebar sur mobile */}
        {showSidebar && sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
      </div>
    </NotificationSystem>
  );
};

export default Layout;
