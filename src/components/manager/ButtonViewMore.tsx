import React from 'react';
import { useI18n } from '@/lib/i18n/provider';

interface ButtonViewMoreProps {
  onClick?: () => void;
  children?: React.ReactNode;
  onBack?: () => void;
  backText?: string;
  primaryText?: string;
}

export default function ButtonViewMore({
  onClick,
  children,
  onBack,
  backText,
  primaryText
}: ButtonViewMoreProps) {
  const { t } = useI18n();

  const defaultBackText = t('manager.buttonViewMore.back');
  const defaultPrimaryText = t('manager.buttonViewMore.viewMore');

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
      {onBack && (
        <button
          type="button"
          className="w-full sm:w-32 lg:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
          onClick={onBack}
        >
          {backText || defaultBackText}
        </button>
      )}
      <button
        type="button"
        className="w-full sm:w-32 lg:w-40 bg-[#8ADB10] hover:bg-lime-500 text-[#FFFFFF] font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg shadow"
        onClick={onClick}
      >
        {children || primaryText || defaultPrimaryText}
      </button>
    </div>
  );
} 