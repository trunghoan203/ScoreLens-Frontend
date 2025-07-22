'use client';

import { useState, useRef, useEffect } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Image from 'next/image';

export function HeaderAdmin() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [, setLang] = useState<'vi' | 'en'>('vi');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSelectLang = (selected: 'vi' | 'en') => {
    setLang(selected);
    setDropdownOpen(false);
    // Nếu muốn lưu vào localStorage: localStorage.setItem('lang', selected);
  };

  return (
    <header className="w-full flex justify-between items-center py-4 px-8 bg-black">
      <div className="flex items-center">
        <ScoreLensLogo />
      </div>
      <div className="hidden sm:flex items-center gap-2 cursor-pointer relative mr-6" ref={dropdownRef}>
        <div
          className="flex items-center gap-2"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <Image src="/images/vietNam.png" alt="Vietnam Flag" width={30} height={20} className="rounded-sm" />
          <span className="text-lg font-medium text-[#FFFFFF]">VI</span>
          <Image src="/icon/chevron-down.svg" alt="Chevron Down" width={26} height={26} />
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-42 bg-white rounded-lg shadow-lg z-50 py-2">
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectLang('vi')}
            >
              <Image src="/images/vietNam.png" alt="Vietnam Flag" width={28} height={20} className="rounded-sm" />
              <span className="text-base text-gray-900">Tiếng Việt</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectLang('en')}
            >
              <Image src="/images/english.png" alt="English Flag" width={28} height={20} className="rounded-sm" />
              <span className="text-base text-gray-900">Tiếng Anh</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}