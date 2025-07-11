import React from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  title = 'Đang tải...',
  subtitle = 'Vui lòng chờ trong giây lát',
  showLogo = true
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
      {/* Logo */}
      {showLogo && (
        <div className="mb-8 animate-fade-in">
          <div className="w-32 h-32">
            <ScoreLensLogo />
          </div>
        </div>
      )}

      {/* Loading Animation */}
      <div className="flex flex-col items-center space-y-6 animate-scale-in">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-lime-500 rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-lime-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">
            {title}
          </h2>
          <p className="text-gray-600 animate-fade-in">
            {subtitle}
          </p>
        </div>

        {/* Dots Animation */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-lime-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 