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
    <div className="mb-8 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="relative flex-grow md:flex-grow-0 md:w-80">
        <Input
          type="text"
          placeholder="Tìm kiếm admin"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pr-10"
        />
        <button
          onClick={() => {
            /* Handle search click */
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
          Trạng thái
        </label>
        <Select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full md:w-48"
        >
          <option value="">Tất cả</option>
          <option value="Đã duyệt">Đã duyệt</option>
          <option value="Chưa duyệt">Chưa duyệt</option>
          <option value="Bị từ chối">Bị từ chối</option>
        </Select>
      </div>
    </div>
  );
} 