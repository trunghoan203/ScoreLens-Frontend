import React from 'react';
import Image from 'next/image';

interface TableSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  onAddTable: () => void;
}

export default function TableSearchBar({ search, setSearch, onAddTable }: TableSearchBarProps) {
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
      <button onClick={onAddTable} className="bg-[#8ADB10] hover:bg-lime-500 text-[#FFFFFF] font-bold px-6 py-2 rounded-lg transition">Thêm bàn</button>
    </div>
  );
} 