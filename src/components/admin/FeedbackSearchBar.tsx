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

  return (
    <div className="mb-6 backdrop-blur-md bg-white/60 rounded-2xl shadow-l flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-300">
      <div className="flex items-center border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 w-96">
        <input
          type="text"
          placeholder="Nhập chi nhánh hoặc bàn để tìm kiếm"
          className="bg-transparent outline-none flex-1 text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Image src="/icon/search.svg" alt="Search" width={20} height={20} className="text-gray-400" />
      </div>

      <div className="flex gap-3 w-full sm:w-110">
        <div className="relative w-full">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-base font-medium text-black shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none appearance-none"
          >
            <option value="all">Tất cả</option>
            <option value="adminP">Chưa xử lý</option>
            <option value="resolved">Đã xử lý</option>
          </select>
          <Image
            src="/icon/chevron-down_Black.svg"
            alt="Dropdown"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        <div className="relative w-full sm:w-120">
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