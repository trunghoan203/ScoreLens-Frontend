import React, { useState, useEffect } from 'react';

interface MatchHistorySearchProps {
    search: string;
    setSearch: (value: string) => void;
    isSearching?: boolean;
}

export function MatchHistorySearch({ search, setSearch, isSearching = false }: MatchHistorySearchProps) {
    const [inputValue, setInputValue] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue !== search) {
                setSearch(inputValue);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue, setSearch, search]);

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96 relative">
                <input
                    type="text"
                    placeholder="Nhập tên trận đấu để tìm kiếm"
                    className="bg-transparent outline-none flex-1 text-gray-700 pr-8"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    disabled={isSearching}
                />
                
                <div className="absolute right-3">
                    {isSearching ? (
                        <div className="w-5 h-5 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
} 