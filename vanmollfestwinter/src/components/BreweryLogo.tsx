import { useState } from 'react';
import { getBreweryInfo, getBreweryInitials } from '../data/breweries';

interface BreweryLogoProps {
  brewery: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

export function BreweryLogo({ brewery, size = 'md', className = '' }: BreweryLogoProps) {
  const info = getBreweryInfo(brewery);
  const initials = getBreweryInitials(brewery);
  const [imageError, setImageError] = useState(false);

  // If we have a logo and it hasn't errored, show the image
  if (info.logo && !imageError) {
    return (
      <img
        src={info.logo}
        alt={`${brewery} logo`}
        className={`rounded-full object-cover shadow-md ${sizeClasses[size]} ${className}`}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // Fallback to colored initials
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shadow-md ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: info.color }}
      title={brewery}
    >
      {initials}
    </div>
  );
}
