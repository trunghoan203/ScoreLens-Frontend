'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

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
        <div className="relative w-full sm:w-80 h-12 bg-white rounded-xl border-2 border-gray-200 focus-within:border-green-500 transition-all">
          <Input
            type="text"
            placeholder="Tìm kiếm admin..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-full w-full bg-transparent px-4 pr-10 rounded-xl placeholder-gray-400 focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ADB10] pointer-events-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {/* Status Filter*/}
        <div className="relative w-full sm:w-55 h-12 bg-white rounded-xl border-2 border-gray-200 text-black focus-within:border-green-500 transition-all">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-full w-full bg-transparent px-4 pr-10 rounded-xl appearance-none focus:outline-none"
          >
            <option value="">Tất cả</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Chưa duyệt">Chưa duyệt</option>
            <option value="Bị từ chối">Bị từ chối</option>
          </Select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ADB10] pointer-events-none">
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}