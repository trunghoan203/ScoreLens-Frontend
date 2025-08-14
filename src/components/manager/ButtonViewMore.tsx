import React from 'react';

interface ButtonViewMoreProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function ButtonViewMore({ onClick, children }: ButtonViewMoreProps) {
  return (
    <div className="flex justify-center">
      <button
        className="mt-8 py-3 px-16 rounded-xl bg-[#8ADB10] text-[#FFFFFF] font-bold text-lg shadow hover:bg-lime-500 transition"
        onClick={onClick}
      >
        {children || 'XEM THÊM'}
      </button>
    </div>
  );
} 