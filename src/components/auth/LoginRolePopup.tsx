import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LoginRolePopupProps {
  onClose: () => void;
}

export const LoginRolePopup: React.FC<LoginRolePopupProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-12 max-w-lg w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Bạn muốn đăng nhập với vai trò nào?
        </h2>
        <div className="my-6">
          <Image
            src="/images/logoScoreLensBlack.png" // Using black logo on white background
            alt="Character"
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link href="/admin/login" onClick={onClose} className="w-full sm:flex-1">
            <Button className="bg-lime-500 text-gray-900 hover:bg-lime-600 rounded-lg sm:text-base lg:text-base py-2 sm:py-3 transition-transform hover:scale-105 w-full flex justify-center">
              Chủ doanh nghiệp
            </Button>
          </Link>
          <Link href="/manager/login" onClick={onClose} className="w-full sm:flex-1">
            <Button className="bg-lime-500 text-gray-900 hover:bg-lime-600 rounded-lg sm:text-base lg:text-base py-2 sm:py-3 transition-transform hover:scale-105 w-full flex justify-center">
              Quản lý
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}; 