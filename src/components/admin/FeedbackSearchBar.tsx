import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';


interface FeedbackSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  dateFilter?: string;
  setDateFilter?: (s: string) => void;
}

export default function FeedbackSearchBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateFilter = '',
  setDateFilter = () => { }
}: FeedbackSearchBarProps) {
  const { t } = useI18n();

  return (
    <div className="mb-4 sm:mb-6 backdrop-blur-md bg-white/60 rounded-2xl shadow-l flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 transition-all duration-300">
      <div className="flex items-center border border-gray-300 bg-gray-100 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 w-full sm:w-80 lg:w-96">
        <input
          type="text"
          placeholder={t('feedbacks.searchPlaceholder')}
          className="bg-transparent outline-none flex-1 text-gray-700 text-sm sm:text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Image src="/icon/search.svg" alt="Search" width={18} height={18} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-45">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2.5 sm:py-2 pl-3 sm:pl-4 pr-10 text-sm sm:text-base font-medium text-black shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none appearance-none touch-manipulation"
          >
            <option value="all">{t('common.all')}</option>
            <option value="adminP">{t('feedbacks.status.pending')}</option>
            <option value="resolved">{t('feedbacks.status.resolved')}</option>
          </select>
          <Image
            src="/icon/chevron-down_Black.svg"
            alt="Dropdown"
            width={18} height={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 sm:w-5 sm:h-5"
          />
        </div>

        <div className="relative w-full sm:w-55">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2.5 sm:py-2 pl-3 sm:pl-4 pr-4 text-sm sm:text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none touch-manipulation"
          />
        </div>
      </div>
    </div>
  );
} 