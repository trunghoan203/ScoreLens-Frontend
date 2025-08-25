"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n/provider';

export default function CameraPageBanner() {
  const { t } = useI18n();

  return (
    <div className="w-full rounded-xl bg-[#8ADB10] shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6">
      <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#FFFFFF] tracking-widest flex items-center gap-2 sm:gap-3">
        {t('cameras.managementTitle')}
      </span>
    </div>
  );
} 