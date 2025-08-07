import React from 'react';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '', ariaLabel = 'Quay lại' }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-2 py-1 rounded-full bg-white shadow-md hover:shadow-lg active:scale-95 hover:scale-105 transition-transform duration-150 border border-gray-200 ${className}`}
    aria-label={ariaLabel}
    type="button"
    style={{ boxShadow: '0 2px 8px 0 rgba(52,199,89,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08)' }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-6 h-6 text-lime-600"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </button>
); 