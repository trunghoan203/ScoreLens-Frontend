import React from 'react';

interface FooterButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const FooterButton: React.FC<FooterButtonProps> = ({ children, className = '' }) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );
};

export default FooterButton;
