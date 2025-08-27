import React from 'react';
import { useI18n } from '@/lib/i18n/provider';

interface FeatureCardProps {
  title: string;
  items: string[];
  backgroundImage: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, items, backgroundImage }) => (
  <div
    className="relative rounded-2xl overflow-hidden p-6 sm:p-8 lg:p-10 flex flex-col justify-end min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-cover bg-center"
    style={{ backgroundImage: `url('${backgroundImage}')` }}
  >
    <div className="absolute inset-0 bg-black/2"></div>
    <div className="relative z-10">
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{title}</h3>
      <ul className="list-disc list-inside mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-sm sm:text-base">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);

export const FeatureCardsSection = () => {
  const { t } = useI18n();

  const features: FeatureCardProps[] = [
    {
      title: t('home.features.clubManagement.title'),
      items: t('home.features.clubManagement.items'),
      backgroundImage: "/images/clubManagement.jpg",
    },
    {
      title: t('home.features.memberSystem.title'),
      items: t('home.features.memberSystem.items'),
      backgroundImage: "/images/memberSystem.png",
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6 sm:gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}; 