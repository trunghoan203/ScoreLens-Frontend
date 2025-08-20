'use client';

import React from 'react';
import Image from 'next/image';

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
  return (
    <div className="w-full mb-8">
      <div
        className="backdrop-blur-md border-lime-400 bg-white/60 border border-gray-200 rounded-2xl shadow-lg px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-300"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
      >
        {/* Search Input*/}
        <div className="relative w-full sm:w-80 h-12 bg-white rounded-xl border-2 border-gray-200 focus:border-lime-400 transition-all">
          <input
            type="text"
            placeholder="Nhập tên hoặc email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-full w-full bg-transparent px-4 pr-10 rounded-xl placeholder-gray-400 focus:outline-none"
          />
          <Image
            src="/icon/search.svg"
            alt="Search"
            width={24}
            height={24}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-6"
          />
        </div>

        {/* Status Filter*/}
        <div className="relative w-full sm:w-55 h-12 bg-white rounded-xl border-2 border-gray-200 text-black focus-within:border-green-500 transition-all">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-full w-full bg-transparent px-4 pr-10 rounded-xl appearance-none focus:outline-none"
          >
            <option value="">Tất cả</option>
            <option value="approved">Đã duyệt</option>
            <option value="pending">Chưa duyệt</option>
            <option value="rejected">Bị từ chối</option>
          </select>
          <Image
            src="/icon/chevron-down_Black.svg"
            alt="Dropdown"
            width={22}
            height={22}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}