'use client';

import React, { useState } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LoginRolePopup } from '@/components/auth/LoginRolePopup';

export function HeaderHome() {
  const [isRolePopupOpen, setIsRolePopupOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'VI' | 'EN'>('VI');

  const languages = [
    { code: 'VI', name: 'Việt Nam', flag: '/images/vietNam.png' },
    { code: 'EN', name: 'English', flag: '/images/english.png' }
  ];

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode: 'VI' | 'EN') => {
    setCurrentLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
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
            <div className="hidden sm:block relative">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-lime-400 transition-colors"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              >
                <Image 
                  src={currentLanguageData?.flag || '/images/vietNam.png'} 
                  alt={`${currentLanguageData?.name} Flag`} 
                  width={28} 
                  height={20} 
                  className="rounded-sm" 
                />
                <span className="text-lg font-medium">{currentLanguage}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Dropdown Menu */}
              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-50">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                        currentLanguage === language.code ? 'bg-lime-50 text-lime-600' : 'text-gray-700'
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
                        <svg className="w-4 h-4 ml-auto text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
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