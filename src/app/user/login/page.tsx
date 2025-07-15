'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function StartSessionPage() {
  const [memberId, setMemberId] = useState('');
  const [fullName, setFullName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams.get('table');
    if (table) setTableNumber(table);

    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleJoin = () => {
    router.push(`/user/guestlogin?table=${tableNumber}`);
  };

  const handleCreateMatch = () => {
    router.push(`/user/hostlogin?table=${tableNumber}`);
  };

  if (loading) {
    return <ScoreLensLoading text="Đang tải..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl flex flex-col items-center text-center space-y-6 py-10">
        {/* Logo lớn hơn */}
        <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40">
          <ScoreLensLogo />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Chào mừng bạn đến với ScoreLens
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">
          Bàn {tableNumber || '...'}
        </p>

        {/* Form */}
        <div className="w-full flex flex-col space-y-4 text-left">
          {/* Full name */}
          <label className="text-sm font-semibold text-gray-700">Họ và Tên</label>
          <input
            type="text"
            placeholder="Nhập họ và tên ..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-base w-full text-black font-medium placeholder-black/70"
          />

          {/* Member ID */}
          <label className="text-sm font-semibold text-gray-700">Mã Hội Viên (Nếu Có)</label>
          <input
            type="text"
            placeholder="Nhập mã hội viên ..."
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-base w-full text-black font-medium placeholder-black/70"
          />

          {/* Warning */}
          <p className="text-sm text-red-500 font-medium">
            * Nếu chưa có mã Hội viên, hãy liên hệ với nhân viên để đăng ký!
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleJoin}
            className="w-full bg-lime-500 text-white font-semibold py-2 rounded-md hover:bg-lime-600"
          >
            Tham gia
          </button>
          <button
            onClick={handleCreateMatch}
            className="w-full bg-lime-500 text-white font-semibold py-2 rounded-md hover:bg-lime-600"
          >
            Tạo trận đấu
          </button>
        </div>
      </div>
    </div>
  );
}
