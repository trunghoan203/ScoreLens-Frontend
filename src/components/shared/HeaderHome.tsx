'use client';

import React, { useState } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LoginRolePopup } from '@/components/auth/LoginRolePopup';

export function HeaderHome() {
  const [isRolePopupOpen, setIsRolePopupOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-20 bg-transparent text-white">
        <div className="container mx-auto flex h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <ScoreLensLogo />
            <div className="hidden md:flex items-center gap-8 text-lg">
              <Link href="/" className="hover:text-lime-400 transition-colors">Trang chủ</Link>
              <Link href="#" className="hover:text-lime-400 transition-colors">Lịch sử đấu</Link>
              <Link href="#" className="hover:text-lime-400 transition-colors">Hướng dẫn</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 cursor-pointer">
              <Image src="/images/vietNam.png" alt="Vietnam Flag" width={28} height={20} className="rounded-sm" />
              <span className="text-lg font-medium">VI</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
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