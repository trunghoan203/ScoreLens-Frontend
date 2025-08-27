import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

export const ScoringSystemSection = () => {
  const { t } = useI18n();

  return (
    <section id="scoring-system" className="py-12 sm:py-16 md:py-24 bg-white text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="rounded-lg overflow-hidden order-2 lg:order-1">
          <Image
            src="/images/bida.jpg"
            alt="People playing billiards"
            width={600}
            height={400}
            className="w-full h-auto object-cover filter brightness-75 transition duration-300"
          />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{t('home.scoringSystem.title')}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            {t('home.scoringSystem.description')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 mb-6 sm:mb-8">
            {t('home.scoringSystem.features').map((feature: string, index: number) => (
              <li key={index}>
                {feature.includes('Membership system') ? (
                  <button
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-lime-600 hover:text-lime-700 underline cursor-pointer"
                  >
                    {feature}
                  </button>
                ) : (
                  feature
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}; 