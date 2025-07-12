'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';

export default function GuestLoginPage() {
  const [roomCode, setRoomCode] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const room = searchParams.get('room');
    const table = searchParams.get('table');
    if (room) setRoomCode(room);
    if (table) setTableNumber(table);
  }, [searchParams]);

  const handleContinue = () => {
    router.push(`/user/guest?table=${tableNumber}&room=${roomCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col items-center text-center space-y-6 py-10">
        
        {/* Logo */}
                  <div className="flex justify-center">
                    <div className="sm:w-28 sm:h-28">
                      <ScoreLensLogo />
                    </div>
                  </div>

        {/* Tiêu đề */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
          Bàn {tableNumber || '...'} - Pool 8 Ball
        </h2>

        {/* Nhập mã tham gia */}
        <div className="w-full">
          <label className="text-sm sm:text-base font-semibold text-black mb-1 block">
            Hãy nhập mã
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="border border-black rounded-md px-4 py-2 text-base sm:text-lg text-center font-semibold w-full"
            placeholder="Nhập mã tham gia"
          />
        </div>

        {/* Ghi chú */}
        <p className="text-xs sm:text-sm text-gray-600 italic px-2">
          Note: làm giống nhập mã theo máy hình viên bi nha, tại làm biếng thiết kế giống hệ hệ
        </p>

        {/* Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-lime-500 text-white font-semibold py-2 sm:py-3 rounded-md hover:bg-lime-600 mt-2 sm:mt-4 text-sm sm:text-base"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
