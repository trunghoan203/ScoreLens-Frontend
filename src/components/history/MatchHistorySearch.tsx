import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface MatchHistorySearchProps {
    search: string;
    setSearch: (value: string) => void;
    dateFilter?: string;
    setDateFilter?: (value: string) => void;
    isSearching?: boolean;
}

export function MatchHistorySearch({
    search,
    setSearch,
    dateFilter = '',
    setDateFilter = () => { },
    isSearching = false
}: MatchHistorySearchProps) {
    const { t } = useI18n();
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
        <div className="mb-6 backdrop-blur-md bg-white/60 rounded-2xl shadow-l flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-300">
            <div className="flex items-center border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 w-96">
                <input
                    type="text"
                    placeholder={t('matchHistory.search.placeholder')}
                    className="bg-transparent outline-none flex-1 text-gray-700"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    disabled={isSearching}
                />
                {isSearching ? (
                    <div className="w-5 h-5 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Image src="/icon/search.svg" alt="Search" width={20} height={20} className="text-gray-400" />
                )}
            </div>

            <div className="relative w-full sm:w-60">
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-4 text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
                />
            </div>
        </div>
    );
} 