'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LoginRolePopup } from '@/components/auth/LoginRolePopup';
import { useI18n } from '@/lib/i18n/provider';
import LanguageSelector from './LanguageSelector';

export function HeaderHome() {
  const [isRolePopupOpen, setIsRolePopupOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-md text-white shadow-md">
        <div className="container mx-auto flex h-16 sm:h-20 md:h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
            <ScoreLensLogo />
            <div className="hidden md:flex items-center gap-4 sm:gap-6 lg:gap-8 text-sm sm:text-base lg:text-lg">
              <Link href="/" className="hover:text-lime-400 transition-colors">{t('nav.home')}</Link>
              <Link href="/history" className="hover:text-lime-400 transition-colors">{t('nav.matchHistory')}</Link>
              <Link href="/guide" className="hover:text-lime-400 transition-colors">{t('nav.guide')}</Link>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <button
              className="md:hidden p-2 text-white hover:text-lime-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <LanguageSelector variant="dark" />
            <Button
              onClick={() => setIsRolePopupOpen(true)}
              className="bg-lime-500 text-black font-bold hover:bg-lime-600 rounded-lg text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3"
            >
              {t('common.login')}
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/register'}
              className="bg-white text-lime-600 border border-lime-500 font-bold hover:bg-lime-100 rounded-lg text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 ml-1 sm:ml-2"
            >
              {t('common.register')}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-700">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-white hover:text-lime-400 transition-colors py-2 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>
                <Link
                  href="/history"
                  className="text-white hover:text-lime-400 transition-colors py-2 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.matchHistory')}
                </Link>
                <Link
                  href="/guide"
                  className="text-white hover:text-lime-400 transition-colors py-2 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.guide')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      {isRolePopupOpen && <LoginRolePopup onClose={() => setIsRolePopupOpen(false)} />}
    </>
  );
} 