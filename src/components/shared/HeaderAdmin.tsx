'use client';

import { ScoreLensLogo } from '@/components/icons/Logo';
import Image from 'next/image';

export function HeaderAdmin() {
  return (
    <header className="w-full flex justify-between items-center py-6 px-8 bg-transparent">
      <div className="flex items-center">
        <ScoreLensLogo />
      </div>
      <div className="hidden sm:flex items-center gap-2 cursor-pointer">
        <Image src="/images/vietNam.png" alt="Vietnam Flag" width={28} height={20} className="rounded-sm" />
        <span className="text-lg font-medium">VI</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </header>
  );
} 