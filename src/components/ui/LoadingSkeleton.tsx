import React from 'react';

interface LoadingSkeletonProps {
  type?: 'text' | 'card' | 'table' | 'avatar' | 'button';
  lines?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'text',
  lines = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{
                  width: i === lines - 1 ? '75%' : '100%'
                }}
              />
            ))}
          </div>
        );

      case 'card':
        return (
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              </div>
            ))}
          </div>
        );

      case 'avatar':
        return (
          <div className={`flex items-center space-x-3 ${className}`}>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className={`h-10 bg-gray-200 rounded-lg animate-pulse ${className}`} />
        );

      default:
        return null;
    }
  };

  return renderSkeleton();
};

// Predefined skeleton components for common use cases
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="grid grid-cols-4 gap-4 p-4 bg-white border border-gray-200 rounded-lg">
        {Array.from({ length: 4 }).map((_, j) => (
          <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ cards?: number }> = ({ cards = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: cards }).map((_, i) => (
      <LoadingSkeleton key={i} type="card" />
    ))}
  </div>
); 