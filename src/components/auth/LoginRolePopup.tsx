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
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 max-w-lg w-full text-center mx-4"

        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Bạn muốn đăng nhập với vai trò nào?
        </h2>
        <div className="my-4 sm:my-6">
          <Image
            src="/images/logoScoreLensBlack.png"
            alt="Character"
            width={150}
            height={150}
            className="mx-auto w-24 sm:w-32 lg:w-[150px] h-auto"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link href="/admin/login" onClick={onClose} className="w-full sm:w-auto">
            <Button className="bg-lime-500 text-gray-900 font-semibold hover:bg-lime-600 rounded-lg text-sm sm:text-base lg:text-lg py-2 sm:py-3 transition-transform hover:scale-105 w-full sm:w-[200px] flex justify-center">
              Chủ doanh nghiệp
            </Button>
          </Link>
          <Link href="/manager/login" onClick={onClose} className="w-full sm:w-auto">
            <Button className="bg-lime-500 text-gray-900 font-semibold hover:bg-lime-600 rounded-lg text-sm sm:text-base lg:text-lg py-2 sm:py-3 transition-transform hover:scale-105 w-full sm:w-[200px] flex justify-center">
              Quản lý
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}; 