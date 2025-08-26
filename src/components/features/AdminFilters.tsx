'use client';

import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface AdminFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function AdminFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: AdminFiltersProps) {
  const { t } = useI18n();

  return (
    <div className="w-full mb-6 sm:mb-8">
      <div
        className="backdrop-blur-md border-lime-400 bg-white/60 border border-gray-200 rounded-2xl shadow-lg px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 transition-all duration-300"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
      >
        <div className="relative w-full sm:w-80 h-10 sm:h-12 bg-white rounded-xl border-2 border-gray-200 focus:border-lime-400 transition-all">
          <input
            type="text"
            placeholder={t('superAdminHome.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-full w-full bg-transparent px-3 sm:px-4 pr-8 sm:pr-10 rounded-xl placeholder-gray-400 focus:outline-none text-[#000000] sm:text-base"
          />
          <Image
            src="/icon/search.svg"
            alt="Search"
            width={24}
            height={24}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 sm:w-6 sm:h-6"
          />
        </div>

        <div className="relative w-full sm:w-55 h-10 sm:h-12 bg-white rounded-xl border-2 border-gray-200 text-black focus-within:border-green-500 transition-all">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-full w-full bg-transparent px-3 sm:px-4 pr-8 sm:pr-10 rounded-xl appearance-none focus:outline-none text-sm sm:text-base"
          >
            <option value="">{t('superAdminHome.allStatus')}</option>
            <option value="approved">{t('superAdminHome.approvedStatus')}</option>
            <option value="pending">{t('superAdminHome.pendingStatus')}</option>
            <option value="rejected">{t('superAdminHome.rejectedStatus')}</option>
          </select>
          <Image
            src="/icon/chevron-down_Black.svg"
            alt="Dropdown"
            width={22}
            height={22}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 sm:w-6 sm:h-6"
          />
        </div>
      </div>
    </div>
  );
}