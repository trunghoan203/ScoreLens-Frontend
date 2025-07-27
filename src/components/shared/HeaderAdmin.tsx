'use client';

import { useState, useRef, useEffect } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Image from 'next/image';

export function HeaderAdmin() {
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
    <header className="w-full flex justify-between items-center py-4 px-8 bg-black">
      <div className="flex items-center">
        <ScoreLensLogo />
      </div>
      <div className="hidden sm:block relative mr-6" ref={dropdownRef}>
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
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-50">
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
    </header>
  );
}