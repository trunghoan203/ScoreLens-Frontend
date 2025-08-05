'use client';

import { useState, useRef, useEffect } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Image from 'next/image';
import { logoutSuperAdmin } from '@/lib/saService';

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
  const handleLogout = async () => {
    await logoutSuperAdmin();
    localStorage.removeItem('superAdminAccessToken');
    window.location.href = '/superadmin/login';
  };

  return (
    <header className="w-full flex justify-between items-center py-4 px-8 bg-black">
      <div className="flex items-center gap-4">
        <ScoreLensLogo />
      </div>
      <div className="flex items-center gap-4">
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
        <button
          onClick={handleLogout}
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded transition"
        >
          Đăng xuất
        </button>

      </div>
    </header>
  );
}