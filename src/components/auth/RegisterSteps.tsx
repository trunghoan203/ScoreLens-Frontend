import React from 'react';
import { useI18n } from '@/lib/i18n/provider';

interface RegisterStepsProps {
  currentStep: number;
  steps?: string[];
}

export function RegisterSteps({ currentStep, steps }: RegisterStepsProps) {
  const { t } = useI18n();

  const defaultSteps = [
    t('registerSteps.brandInfo'),
    t('registerSteps.branchInfo'),
    t('registerSteps.confirm'),
  ];

  const displaySteps = steps || defaultSteps;

  return (
    <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {displaySteps.map((label, idx) => {
        const isActive = currentStep === idx + 1;
        const isFirst = idx === 0;
        const isLast = idx === displaySteps.length - 1;
        return (
          <button
            key={label}
            type="button"
            className={
              'flex-1 flex justify-center items-center py-2 sm:py-3 font-semibold text-sm sm:text-base lg:text-lg whitespace-nowrap transition-colors duration-300 ' +
              (isActive
                ? 'bg-lime-400 text-black shadow-md'
                : 'bg-black text-white') +
              (isFirst
                ? ' sm:rounded-tl-lg sm:rounded-bl-lg rounded-t-lg'
                : '') +
              (isLast
                ? ' sm:rounded-tr-lg sm:rounded-br-lg rounded-b-lg'
                : '') +
              (idx > 0 && idx < displaySteps.length - 1
                ? ' sm:rounded-none'
                : '')
            }
            disabled
          >
            <span className="px-2 sm:px-4 text-center">{label}</span>
          </button>
        );
      })}
    </div>
  );
} 