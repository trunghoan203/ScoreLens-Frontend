'use client';

import { useState, useRef, useEffect } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

export function HeaderAdmin() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentLanguage, changeLanguage } = useI18n();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'vi', name: 'Việt Nam', flag: '/images/vietNam.png' },
    { code: 'en', name: 'English', flag: '/images/english.png' }
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

  const handleLanguageChange = (languageCode: 'vi' | 'en') => {
    changeLanguage(languageCode);
    setDropdownOpen(false);
  };
  return (
    <header className="fixed top-0 left-0 right-0 w-full flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 lg:px-8 bg-black shadow-lg z-50">
      <div className="flex items-center gap-3 sm:gap-4">
        <ScoreLensLogo />
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:block relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-lime-400 transition-colors touch-manipulation"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Image
              src={currentLanguageData?.flag || '/images/vietNam.png'}
              alt={`${currentLanguageData?.name} Flag`}
              width={24}
              height={16}
              className="sm:w-[30px] sm:h-[20px] rounded-sm"
            />
            <span className="text-base sm:text-lg font-medium text-[#FFFFFF]">{currentLanguage.toUpperCase()}</span>
            <Image
              src="/icon/chevron-down.svg"
              alt="Chevron Down"
              width={20}
              height={20}
              className={`sm:w-[26px] sm:h-[26px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[140px] sm:min-w-[160px] z-50">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors touch-manipulation ${currentLanguage === language.code ? 'bg-lime-50 text-[#8ADB10]' : 'text-gray-700'
                    }`}
                  onClick={() => handleLanguageChange(language.code as 'vi' | 'en')}
                >
                  <Image
                    src={language.flag}
                    alt={`${language.name} Flag`}
                    width={20}
                    height={15}
                    className="sm:w-[24px] sm:h-[18px] rounded-sm"
                  />
                  <span className="text-xs sm:text-sm font-medium">{language.name}</span>
                  {currentLanguage === language.code && (
                    <Image
                      src="/icon/check-lime.svg"
                      alt="Check"
                      width={12}
                      height={12}
                      className="sm:w-[15px] sm:h-[15px] ml-auto"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sm:hidden relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-lime-400 transition-colors touch-manipulation"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Image
              src={currentLanguageData?.flag || '/images/vietNam.png'}
              alt={`${currentLanguageData?.name} Flag`}
              width={20}
              height={14}
              className="rounded-sm"
            />
            <span className="text-sm font-medium text-[#FFFFFF]">{currentLanguage}</span>
            <Image
              src="/icon/chevron-down.svg"
              alt="Chevron Down"
              width={16}
              height={16}
              className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[120px] z-50">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors touch-manipulation ${currentLanguage === language.code ? 'bg-lime-50 text-[#8ADB10]' : 'text-gray-700'
                    }`}
                  onClick={() => handleLanguageChange(language.code as 'vi' | 'en')}
                >
                  <Image
                    src={language.flag}
                    alt={`${language.name} Flag`}
                    width={18}
                    height={12}
                    className="rounded-sm"
                  />
                  <span className="text-xs font-medium">{language.name}</span>
                  {currentLanguage === language.code && (
                    <Image
                      src="/icon/check-lime.svg"
                      alt="Check"
                      width={10}
                      height={10}
                      className="ml-auto"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}