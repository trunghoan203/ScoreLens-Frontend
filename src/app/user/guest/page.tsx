'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';

export default function GuestJoinPage() {
  const [fullName, setFullName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams.get('table');
    const room = searchParams.get('room');
    if (table) setTableNumber(table);
    if (room) setRoomCode(room);
  }, [searchParams]);

  const handleSubmit = () => {
    // Gửi thông tin người chơi (fullName) vào phòng roomCode
    console.log(`Joining room ${roomCode} as ${fullName}`);
    router.push(`/user/screencontrol?table=${tableNumber}&room=${roomCode}&name=${encodeURIComponent(fullName)}`);
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

        {/* Title */}
        <h2 className="text-2xl font-bold text-black">
          Bàn {tableNumber} - Pool 8 Ball
        </h2>

        {/* Nhập tên */}
        <div className="w-full text-left">
          <label className="text-base font-semibold text-black mb-1 block">
            Họ Và Tên
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập tên ..."
            className="border border-black rounded-md px-4 py-2 text-base font-medium w-full"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-lime-500 text-white font-semibold py-2 rounded-md hover:bg-lime-600 mt-4"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
