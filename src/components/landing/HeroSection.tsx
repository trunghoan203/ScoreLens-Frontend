import React from 'react';
import { useI18n } from '@/lib/i18n/provider';

export const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url('/images/bannerHome.png')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-3xl text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#FFFFFF] font-bold tracking-tighter">
            {t('home.hero.title')}
          </h1>
          <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-[#FFFFFF] max-w-2xl">
            {t('home.hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}; 