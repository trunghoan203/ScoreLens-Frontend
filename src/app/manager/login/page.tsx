'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ManagerLoginPage() {
  const [clubCode, setClubCode] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập xác thực thành công, chuyển hướng sang trang verification
    setTimeout(() => {
      router.push(`/manager/verification?clubCode=${encodeURIComponent(clubCode)}`);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative z-30 flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
        {/* FORM LOGIN */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-[400px] h-[500px]">
          <div className="flex flex-col items-center">
            <Image
              src="/images/logoScoreLensBlack.png"
              alt="ScoreLens Logo"
              width={200}
              height={50}
              priority
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="clubCode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã quản lý
                </label>
                <PasswordInput
                  id="clubCode"
                  name="clubCode"
                  value={clubCode}
                  onChange={e => setClubCode(e.target.value)}
                  className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:text-black focus:border-transparent"
                  placeholder="Nhập mã quản lý"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-500 transition-all hover:scale-105"
              >
                Đăng nhập
              </Button>
            </form>
          </div>
        </div>

        {/* IMAGE */}
        <div className="hidden md:block w-[400px] h-[500px]">
          <Image
            src="/images/imgLogin.png"
            alt="Billiards table"
            width={400}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
} 