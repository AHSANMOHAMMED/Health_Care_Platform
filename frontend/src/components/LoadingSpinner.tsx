import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-slate-600',
    white: 'text-white',
    current: 'text-current'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 
          className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        />
        {text && (
          <span className={`text-sm ${color === 'white' ? 'text-white' : 'text-slate-600'}`}>
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
