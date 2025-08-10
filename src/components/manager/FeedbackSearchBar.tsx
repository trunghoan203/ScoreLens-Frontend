import React from 'react';
import { Search, Calendar } from 'lucide-react';

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
    { value: 'managerP', label: 'Manager đang xử lý' },
    { value: 'pending', label: 'Chưa xử lý' },
    { value: 'adminP', label: 'Admin đang xử lý' },
    { value: 'superadminP', label: 'Super Admin đang xử lý' },
    { value: 'resolved', label: 'Đã xử lý' },
  ];

  return (
    <div className="mb-6 backdrop-blur-md border-lime-400 bg-white/60 border border-gray-200 rounded-2xl shadow-lg px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-300">
      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm phản hồi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
        />
      </div>

      {/* Status and Date Filters Group */}
      <div className="flex gap-3 w-full sm:w-auto">
        {/* Status Filter */}
        <div className="relative w-full sm:w-60">
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
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Date Picker */}
        <div className="relative w-full sm:w-60">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
          />
        </div>
      </div>
    </div>
  );
} 