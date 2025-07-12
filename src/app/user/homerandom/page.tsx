'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';

export default function HomeRandomPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableNumber = searchParams.get('table') || '??';


  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    // Tạo mã phòng 6 số ngẫu nhiên
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomCode(code);
  }, []);

  const qrJoinUrl = `https://yourdomain.com/user/login?table=${tableNumber}&room=${roomCode}`;

  const handleStart = () => {
  router.push(`/user/screencontrol?table=${tableNumber}&room=${roomCode}`);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 py-10">
        {/* Logo */}
                  <div className="flex justify-center">
                    <div className="sm:w-28 sm:h-28">
                      <ScoreLensLogo />
                    </div>
                  </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-black">
          Bàn {tableNumber} - Pool 8 Ball
        </h2>

        {/* Mã phòng */}
        <div className="space-y-1">
          <p className="text-base font-medium text-black">Mã Tham Gia</p>
          <div className="border border-black rounded-md px-4 py-2 text-lg font-bold text-black inline-block">
            {roomCode}
          </div>
        </div>

        {/* Mã QR */}
        <div className="space-y-1">
          <p className="text-base font-medium text-black">Mã QR</p>
          <div className="p-2 bg-white border rounded-md">
            <QRCodeCanvas value={qrJoinUrl} size={180} />
          </div>
        </div>

        {/* Nút bắt đầu */}
        <button
          onClick={handleStart}
          className="w-full mt-6 bg-lime-500 text-white font-semibold py-2 rounded-md hover:bg-lime-600"
        >
          Bắt đầu
        </button>
      </div>
    </div>
  );
}
