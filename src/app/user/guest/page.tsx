'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function GuestJoinPage() {
  const [fullName, setFullName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams.get('table');
    const room = searchParams.get('room');
    if (table) setTableNumber(table);
    if (room) setRoomCode(room);

    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleSubmit = () => {
    console.log(`Joining room ${roomCode} as ${fullName}`);
    router.push(`/user/screencontrol?table=${tableNumber}&room=${roomCode}&name=${encodeURIComponent(fullName)}`);
  };

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
  <div className="min-h-screen flex flex-col bg-white px-4 pt-6 pb-safe">
    {/* Phần nội dung chính */}
    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 px-2 sm:px-4">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28">
          <ScoreLensLogo />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-black">
        Bàn {tableNumber} - Pool 8 Ball
      </h2>

      {/* Input Họ và Tên */}
      <div className="w-full flex flex-col items-center">
        <label className="text-base sm:text-lg font-semibold text-black mb-1">
          Họ Và Tên
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập tên ..."
          className="border border-black rounded-full px-5 py-2 text-base font-medium w-full max-w-sm text-center placeholder-black/60 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all duration-200"
        />
      </div>
    </div>

    {/* Nút cố định dưới cùng */}
    <div className="w-full p-4 sm:p-6">
      <button
        onClick={handleSubmit}
        className="w-full bg-lime-500 text-white font-semibold py-3 rounded-xl hover:bg-lime-600 text-base sm:text-lg"
      >
        Tiếp tục
      </button>
    </div>
  </div>
);


}
