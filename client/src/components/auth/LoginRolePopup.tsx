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
        className="bg-white rounded-2xl p-10 max-w-md w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Bạn muốn đăng nhập với vai trò nào?
        </h2>
        <div className="my-6">
          <Image
            src="/images/login-character.png" // NOTE: Add this image to public/images
            alt="Character"
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/admins">
            <Button className="bg-lime-500 text-White font-semibold hover:bg-lime-600 rounded-lg text-lg px-12 py-3 transition-transform hover:scale-105">
              Admin
            </Button>
          </Link>
          <Link href="#">
             <Button className="bg-lime-500 text-White font-semibold hover:bg-lime-600 rounded-lg text-lg px-10 py-3 transition-transform hover:scale-105">
              Manager
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}; 