import React from 'react';

interface PageBannerProps {
  title: string;
}

export function PageBanner({ title }: PageBannerProps) {
  return (
    <div
      className="relative flex items-center justify-center 
                 h-56 sm:h-64 md:h-72 lg:h-100 
                 w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/images/banner.png')" }}
    >
      <div className="absolute inset-0 bg-black/25" />
      <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-wider px-4 text-center">
        {title}
      </h1>
    </div>
  );
} 