import React from 'react';

interface PageBannerProps {
  title: string;
}

export function PageBanner({ title }: PageBannerProps) {
  return (
    <div
      className="relative flex h-70 items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/banner.png')" }}
    >
      <div className="absolute inset-0 bg-black/25" />
      <h1 className="relative text-6xl font-extrabold text-white tracking-wider">
        {title}
      </h1>
    </div>
  );
} 