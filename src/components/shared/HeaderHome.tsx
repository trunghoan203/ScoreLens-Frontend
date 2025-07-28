'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LoginRolePopup } from '@/components/auth/LoginRolePopup';

export function HeaderHome() {
  const [isRolePopupOpen, setIsRolePopupOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [, setLang] = useState<'vi' | 'en'>('vi');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-md text-white shadow-md">
        <div className="container mx-auto flex h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <ScoreLensLogo />
            <div className="hidden md:flex items-center gap-8 text-lg">
              <Link href="/" className="hover:text-lime-400 transition-colors">Trang chủ</Link>
              <Link href="/history" className="hover:text-lime-400 transition-colors">Lịch sử đấu</Link>
              <Link href="/guide" className="hover:text-lime-400 transition-colors">Hướng dẫn</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 cursor-pointer relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <Image src="/images/vietNam.png" alt="Vietnam Flag" width={28} height={20} className="rounded-sm" />
                <span className="text-lg font-medium">VI</span>
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
            <Button 
              onClick={() => setIsRolePopupOpen(true)}
              className="bg-lime-500 text-black font-bold hover:bg-lime-600 rounded-lg text-base px-6 py-3"
            >
              Đăng nhập
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/register'}
              className="bg-white text-lime-600 border border-lime-500 font-bold hover:bg-lime-100 rounded-lg text-base px-6 py-3 ml-2"
            >
              Đăng ký
            </Button>
          </div>
        </div>
      </header>
      {isRolePopupOpen && <LoginRolePopup onClose={() => setIsRolePopupOpen(false)} />}
    </>
  );
} 