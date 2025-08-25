"use client";
import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface CameraSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  onAddCamera: () => void;
}

export default function CameraSearchBar({ search, setSearch, onAddCamera }: CameraSearchBarProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6">
      <div className="flex items-center border border-gray-300 bg-gray-100 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-80 lg:w-96">
        <input
          type="text"
          placeholder={t('cameras.searchPlaceholder')}
          className="bg-transparent outline-none flex-1 text-gray-700 text-sm sm:text-base"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Image src="/icon/search.svg" alt="Search" width={20} height={20} className="text-gray-400" />
      </div>
      <button
        onClick={onAddCamera}
        className="w-full sm:w-32 lg:w-40 bg-[#8ADB10] hover:bg-lime-500 text-[#FFFFFF] font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base"
      >
        {t('cameras.addCamera')}
      </button>
    </div>
  );
} 