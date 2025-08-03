import React from 'react';
import Image from 'next/image';

interface FeedbackSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
}

export default function FeedbackSearchBar({ search, setSearch }: FeedbackSearchBarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
        <input
          type="text"
          placeholder="Tìm kiếm phản hồi..."
          className="bg-transparent outline-none flex-1 text-[#000000]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Image src="/icon/search.svg" alt="Search" width={20} height={20} className="text-gray-400" />
      </div>
    </div>
  );
} 