import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/navigation.css';

interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

interface NavigationProps {
  items: NavItem[];
  className?: string;
  showBurger?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  className = '',
  showBurger = true,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Fermer le menu lors du clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector('.navigation');
      if (nav && !nav.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Empêche le scroll en arrière-plan
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navigation ${className}`}>
      {/* Logo/Brand */}
      <div className="navigation-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">📹</span>
          <span className="brand-text">GotoDrop</span>
        </Link>
      </div>

      {/* Menu burger (mobile) */}
      {showBurger && (
        <button
          className={`burger-menu ${isMenuOpen ? 'burger-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>
      )}

      {/* Liste de navigation */}
      <ul className={`navigation-list ${isMenuOpen ? 'navigation-open' : ''}`}>
        {items.map(item => (
          <li key={item.path} className="navigation-item">
            <Link
              to={item.path}
              className={`navigation-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon && <span className="navigation-icon">{item.icon}</span>}
              <span className="navigation-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Overlay pour mobile */}
      {isMenuOpen && (
        <button
          className="navigation-overlay"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setIsMenuOpen(false);
            }
          }}
          aria-label="Close navigation menu"
        />
      )}
    </nav>
  );
};

export default Navigation;
