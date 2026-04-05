import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { addLoadingListener, removeLoadingListener, isLoading } from '../api/axios';

interface GlobalLoadingProps {
  minDisplayTime?: number;
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = ({ minDisplayTime = 500 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [minDisplayTimer, setMinDisplayTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleLoadingChange = (loading: boolean) => {
      if (loading) {
        // Clear any existing minimum display timer
        if (minDisplayTimer) {
          clearTimeout(minDisplayTimer);
        }

        // Show loading immediately
        setShouldShow(true);
        
        // But only make it visible after a short delay to prevent flickering
        const visibilityTimer = setTimeout(() => {
          setIsVisible(true);
        }, 100);

        // Set minimum display timer
        const displayTimer = setTimeout(() => {
          if (!isLoading()) {
            setIsVisible(false);
            setTimeout(() => setShouldShow(false), 300); // Allow fade out animation
          }
        }, minDisplayTime);

        setMinDisplayTimer(displayTimer);

        return () => {
          clearTimeout(visibilityTimer);
          clearTimeout(displayTimer);
        };
      } else {
        // Hide loading with fade out
        setIsVisible(false);
        
        // Remove from DOM after animation
        setTimeout(() => {
          if (!isLoading()) {
            setShouldShow(false);
          }
        }, 300);
      }
    };

    addLoadingListener(handleLoadingChange);

    return () => {
      removeLoadingListener(handleLoadingChange);
      if (minDisplayTimer) {
        clearTimeout(minDisplayTimer);
      }
    };
  }, [minDisplayTime]);

  if (!shouldShow) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-slate-700 font-medium">Loading...</p>
      </div>
    </div>
  );
};

// Smaller loading spinner for inline use
export const InlineLoading: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  text, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-2">
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      {text && <span className="text-slate-600 text-sm">{text}</span>}
    </div>
  );
};

// Loading skeleton component
export const LoadingSkeleton: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-slate-200 rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// Card skeleton for loading states
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg border border-slate-200 ${className}`}>
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse" />
        </div>
        <div className="h-10 bg-slate-200 rounded w-1/3 animate-pulse" />
      </div>
    </div>
  );
};

// Table skeleton for data loading
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3 text-left">
                  <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div 
                      className="h-4 bg-slate-200 rounded animate-pulse"
                      style={{
                        width: `${Math.random() * 40 + 60}%`,
                        animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s`
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlobalLoading;
