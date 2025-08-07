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
  const [currentLanguage, setCurrentLanguage] = useState<'VI' | 'EN'>('VI');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'VI', name: 'Việt Nam', flag: '/images/vietNam.png' },
    { code: 'EN', name: 'English', flag: '/images/english.png' }
  ];

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

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

  const handleLanguageChange = (languageCode: 'VI' | 'EN') => {
    setCurrentLanguage(languageCode);
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
            <div className="hidden sm:block relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-lime-400 transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Image
                  src={currentLanguageData?.flag || '/images/vietNam.png'}
                  alt={`${currentLanguageData?.name} Flag`}
                  width={30}
                  height={20}
                  className="rounded-sm"
                />
                <span className="text-lg font-medium text-[#FFFFFF]">{currentLanguage}</span>
                <Image
                  src="/icon/chevron-down.svg"
                  alt="Chevron Down"
                  width={26}
                  height={26}
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-50">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${currentLanguage === language.code ? 'bg-lime-50 text-[#8ADB10]' : 'text-gray-700'
                        }`}
                      onClick={() => handleLanguageChange(language.code as 'VI' | 'EN')}
                    >
                      <Image
                        src={language.flag}
                        alt={`${language.name} Flag`}
                        width={24}
                        height={18}
                        className="rounded-sm"
                      />
                      <span className="text-sm font-medium">{language.name}</span>
                      {currentLanguage === language.code && (
                        <Image
                          src="/icon/check-lime.svg"
                          alt="Check"
                          width={15}
                          height={15}
                          className="ml-auto"
                        />
                      )}
                    </div>
                  ))}
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