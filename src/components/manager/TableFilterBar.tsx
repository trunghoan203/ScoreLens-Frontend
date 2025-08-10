import React from 'react';
import Image from 'next/image';

interface TableFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  type: string;
  onTypeChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
}

export default function TableFilterBar({ search, onSearchChange, type, onTypeChange, status, onStatusChange }: TableFilterBarProps) {
  return (
    <div className="w-full mb-8">
      <div
        className="backdrop-blur-md border-lime-400 bg-white/60 border border-gray-200 rounded-2xl shadow-lg px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-300"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
      >
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-80 bg-white/80 rounded-xl border border-gray-200 shadow-sm focus-within:border-lime-400 transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm bàn..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              className="bg-transparent outline-none flex-1 text-[#000000] text-base px-4 py-2 rounded-xl placeholder-gray-400 font-medium"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500 hover:text-lime-600 transition-colors">
              <Image src="/icon/search.svg" alt="Search" width={24} height={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-44">
            <select
              value={type}
              onChange={e => onTypeChange(e.target.value)}
              className="w-full text-base font-bold text-[#000000] bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-10 shadow-sm focus:border-[#8ADB10] focus:ring-2 focus:ring-lime-100 appearance-none cursor-pointer transition-all"
            >
              <option value="">Tất cả</option>
              <option value="pool-8">Pool-8</option>
              <option value="carom">Carom</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lime-500">
              <Image src="/icon/chevron-down_Black.svg" alt="Dropdown" width={22} height={22} />
            </span>
          </div>
          <div className="relative w-full sm:w-44">
            <select
              value={status}
              onChange={e => onStatusChange(e.target.value)}
              className="w-full text-base font-bold text-[#000000] bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-10 shadow-sm focus:border-[#8ADB10] focus:ring-2 focus:ring-lime-100 appearance-none cursor-pointer transition-all"
            >
              <option value="">Tất cả</option>
              <option value="using">Đang sử dụng</option>
              <option value="available">Bàn trống</option>
              <option value="maintenance">Bảo trì</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lime-500">
              <Image src="/icon/chevron-down_Black.svg" alt="Dropdown" width={22} height={22} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 