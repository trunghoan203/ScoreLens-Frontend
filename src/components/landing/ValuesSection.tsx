import React from 'react';
import { useI18n } from '@/lib/i18n/provider';

interface ValueCardProps {
  num: string;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ num, title, description }) => (
  <div className="bg-[#000000] p-6 sm:p-8 rounded-xl">
    <div className="text-lime-400 text-xl sm:text-2xl font-bold">{num}</div>
    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mt-3 sm:mt-4">{title}</h3>
    <p className="text-gray-400 mt-2 text-sm sm:text-base">{description}</p>
  </div>
);

export const ValuesSection = () => {
  const { t } = useI18n();

  const values: ValueCardProps[] = t('home.values.items').map((item: any, index: number) => ({
    num: `0${index + 1}`,
    title: item.title,
    description: item.description,
  }));

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left mb-8 sm:mb-12 text-black">{t('home.values.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {values.map((value) => (
            <ValueCard key={value.num} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}; 