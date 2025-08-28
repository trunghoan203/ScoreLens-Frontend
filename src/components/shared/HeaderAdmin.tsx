'use client';

import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import LanguageSelector from '@/components/shared/LanguageSelector';

export function HeaderAdmin() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 lg:px-8 bg-black shadow-lg z-50">
      <div className="flex items-center gap-3 sm:gap-4">
        <ScoreLensLogo />
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSelector variant="dark" />
      </div>
    </header>
  );
}