'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';

interface HeaderUserProps {
  children?: ReactNode;
  showBack?: boolean;
}

export default function HeaderUser({ children, showBack = true }: HeaderUserProps) {
  const router = useRouter();

  return (
    <div className="relative w-full">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="relative w-full py-6">
          {showBack && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
              <BackButton onClick={() => router.back()} />
            </div>
          )}
          <div className="flex items-center justify-center">
            <div className="h-10 sm:h-14 flex items-center">
              <ScoreLensLogo />
            </div>
          </div>
        </div>
      </div>

      {children && (
        <div className="pt-26 flex flex-col items-center text-center space-y-6 py-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          {children}
        </div>
      )}
    </div>
  );
}


