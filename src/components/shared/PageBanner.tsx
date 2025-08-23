import React from 'react';

interface PageBannerProps {
  title: string;
}

export function PageBanner({ title }: PageBannerProps) {
  return (
    <div
      className="relative flex h-40 sm:h-50 md:h-60 lg:h-70 items-center justify-center bg-cover bg-center mt-16 sm:mt-20 md:mt-24 lg:mt-24"
      style={{ backgroundImage: "url('/images/banner.png')" }}
    >
      <div className="absolute inset-0 bg-black/25" />
      <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-wider px-4 text-center">
        {title}
      </h1>
    </div>
  );
} 