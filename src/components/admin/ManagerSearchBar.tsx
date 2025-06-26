import React from 'react';

interface ManagerSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  onAddManager: () => void;
}

export default function ManagerSearchBar({ search, setSearch, onAddManager }: ManagerSearchBarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
        <input
          type="text"
          placeholder="Nhập tên tìm kiếm"
          className="bg-transparent outline-none flex-1 text-gray-700"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <button onClick={onAddManager} className="bg-lime-400 hover:bg-lime-500 text-white font-bold px-6 py-2 rounded-lg transition">Thêm quản lý</button>
    </div>
  );
} 