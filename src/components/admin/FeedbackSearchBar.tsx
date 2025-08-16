import React from 'react';
import Image from 'next/image';


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
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'managerP', label: 'Manager đang xử lý' },
    { value: 'adminP', label: 'Admin đang xử lý' },
    { value: 'superadminP', label: 'SuperAdmin đang xử lý' },
    { value: 'resolved', label: 'Đã giải quyết' },
  ];

  return (
    <div className="mb-6 backdrop-blur-md bg-white/60 rounded-2xl shadow-l flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-300">
      {/* Search */}
      <div className="flex items-center border border-gray-400 bg-gray-100 rounded-lg px-4 py-2 w-96">
        <input
          type="text"
          placeholder="Nhập chi nhánh hoặc bàn để tìm kiếm"
          className="bg-transparent outline-none flex-1 text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Image src="/icon/search.svg" alt="Search" width={20} height={20} className="text-gray-400" />
      </div>

      {/* Status and Date Filters Group */}
      <div className="flex gap-3 w-full sm:w-auto">
        {/* Status Filter */}
        <div className="relative w-full">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-base font-medium text-black shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none appearance-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Image
            src="/icon/chevron-down_Black.svg"
            alt="Dropdown"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Date Picker */}
        <div className="relative w-full sm:w-50">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-4 text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
          />
        </div>
      </div>
    </div>
  );
} 