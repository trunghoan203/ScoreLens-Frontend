import React from 'react';
import Image from 'next/image';

interface TableSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  onAddTable: () => void;
}

export default function TableSearchBar({ search, setSearch, categoryFilter, setCategoryFilter, onAddTable }: TableSearchBarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
        <input
          type="text"
          placeholder="Nhập tên tìm kiếm"
          className="bg-transparent outline-none flex-1 text-[#000000]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Image src="/icon/search.svg" alt="Search" width={20} height={20} className="text-gray-400" />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="appearance-none bg-gray-100 rounded-lg px-4 py-2 pr-10 text-[#000000] font-bold outline-none min-w-[140px] cursor-pointer hover:bg-gray-200 transition"
          >
            <option value="">Tất cả</option>
            <option value="pool-8">Pool-8</option>
            <option value="carom">Carom</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Image src="/icon/chevron-down_Black.svg" alt="Dropdown" width={16} height={16} className="font-bold" />
          </div>
        </div>
        <button onClick={onAddTable} className="bg-[#8ADB10] hover:bg-lime-500 text-[#FFFFFF] font-bold px-6 py-2 rounded-lg transition">Thêm bàn</button>
      </div>
    </div>
  );
} 