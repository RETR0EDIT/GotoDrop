import React from 'react';
import { GoogleIcon, FacebookIcon, GitHubIcon, LinkedInIcon } from './Icons';
import clsx from 'clsx';

interface SocialButtonProps {
  provider: 'google' | 'facebook' | 'github' | 'linkedin';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onClick,
  disabled = false,
  children,
  className,
  size = 'md',
}) => {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

    switch (provider) {
      case 'google':
        return <GoogleIcon size={iconSize} className="social-icon" />;
      case 'facebook':
        return <FacebookIcon size={iconSize} className="social-icon" />;
      case 'github':
        return <GitHubIcon size={iconSize} className="social-icon" />;
      case 'linkedin':
        return <LinkedInIcon size={iconSize} className="social-icon" />;
      default:
        return null;
    }
  };

  const getProviderStyles = () => {
    switch (provider) {
      case 'google':
        return 'btn-social-google';
      case 'facebook':
        return 'btn-social-facebook';
      case 'github':
        return 'btn-social-github';
      case 'linkedin':
        return 'btn-social-linkedin';
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'btn-social-sm';
      case 'lg':
        return 'btn-social-lg';
      default:
        return 'btn-social-md';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx('btn-social', getProviderStyles(), getSizeStyles(), className)}
    >
      {getIcon()}
      {children}
    </button>
  );
};

export default SocialButton;
