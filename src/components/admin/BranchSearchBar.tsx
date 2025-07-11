import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';

interface BranchSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  onAddBranch: () => void;
  isSearching?: boolean;
}

export default function BranchSearchBar({ 
  search, 
  setSearch, 
  onAddBranch, 
  isSearching = false 
}: BranchSearchBarProps) {
  const [inputValue, setInputValue] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) {
        setSearch(inputValue);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [inputValue, setSearch, search]);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96 relative">
        <input
          type="text"
          placeholder="Nhập địa chỉ để tìm kiếm"
          className="bg-transparent outline-none flex-1 text-gray-700 pr-8"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={isSearching}
        />
        
        {/* Search icon or loading spinner */}
        <div className="absolute right-3">
          {isSearching ? (
            <LoadingSpinner size="sm" color="lime" />
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>
      
      <button 
        onClick={onAddBranch} 
        className="bg-lime-400 hover:bg-lime-500 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSearching}
      >
        Thêm chi nhánh
      </button>
    </div>
  );
} 