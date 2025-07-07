
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TacLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center relative`}>
      <svg viewBox="0 0 32 32" className="w-full h-full">
        {/* Outer diamond */}
        <path
          d="M16 2 L28 16 L16 30 L4 16 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-tactical-accent"
        />
        
        {/* Inner cross/compass */}
        <path
          d="M16 8 L16 24 M8 16 L24 16"
          stroke="currentColor"
          strokeWidth="2"
          className="text-tactical-primary"
        />
        
        {/* Center dot */}
        <circle
          cx="16"
          cy="16"
          r="2"
          fill="currentColor"
          className="text-tactical-gold"
        />
        
        {/* Corner accents */}
        <circle cx="16" cy="6" r="1" fill="currentColor" className="text-tactical-accent" />
        <circle cx="16" cy="26" r="1" fill="currentColor" className="text-tactical-accent" />
        <circle cx="6" cy="16" r="1" fill="currentColor" className="text-tactical-accent" />
        <circle cx="26" cy="16" r="1" fill="currentColor" className="text-tactical-accent" />
      </svg>
    </div>
  );
};
