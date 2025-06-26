import React from 'react';

interface ButtonXemThemProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function ButtonXemThem({ onClick, children }: ButtonXemThemProps) {
  return (
    <div className="flex justify-center">
      <button
        className="mt-8 py-3 px-16 rounded-xl bg-lime-400 text-white font-bold text-lg shadow hover:bg-lime-500 transition"
        onClick={onClick}
      >
        {children || 'XEM THÊM'}
      </button>
    </div>
  );
} 