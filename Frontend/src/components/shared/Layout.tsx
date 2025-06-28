import React from 'react';
import '../../styles/components/layout.css';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return <div className={`min-h-screen bg-background ${className}`}>{children}</div>;
};

export default Layout;
