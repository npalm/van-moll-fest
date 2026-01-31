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
