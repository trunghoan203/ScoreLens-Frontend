import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface BranchSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  onAddBranch: () => void;
}

export default function BranchSearchBar({ search, setSearch, onAddBranch }: BranchSearchBarProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex items-center border border-gray-300 bg-gray-100 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 w-full sm:w-80 lg:w-96">
        <input
          type="text"
          placeholder={t('branches.searchPlaceholder')}
          className="bg-transparent outline-none flex-1 text-gray-700 text-sm sm:text-base"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Image src="/icon/search.svg" alt="Search" width={18} height={18} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
      </div>
      <button
        onClick={onAddBranch}
        className="bg-lime-400 hover:bg-lime-500 text-white font-bold px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg transition text-sm sm:text-base touch-manipulation"
      >
        {t('branches.addBranch')}
      </button>
    </div>
  );
} 