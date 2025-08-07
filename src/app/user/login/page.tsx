'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

function StartSessionContent() {
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState('');
  const [fullName, setFullName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
 
  useEffect(() => {
    const table = searchParams.get('table');
    if (table) setTableNumber(table);

    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleJoin = () => {
    const safeName = fullName.trim() || 'Khách';
    router.push(`/user/guestlogin?table=${tableNumber}&name=${encodeURIComponent(safeName)}`);
  };

  const handleCreateMatch = () => {
    if (!fullName.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }
    router.push(`/user/hostlogin?table=${tableNumber}&name=${encodeURIComponent(fullName.trim())}`);
  };

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col items-center text-center space-y-8 py-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="sm:w-28 sm:h-28">
            <ScoreLensLogo />
          </div>
        </div>

        {/* Tiêu đề */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Chào mừng bạn đến với ScoreLens
          </h1>
          <p className="text-sm sm:text-base text-black font-medium">
            Bàn {tableNumber || '...'}
          </p>
        </div>

        {/* Form nhập */}
        <div className="w-full max-w-sm space-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold text-black mb-1 text-center">
              Họ và Tên
            </label>
            <input
              type="text"
              placeholder="Nhập họ và tên ..."
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-black rounded-xl px-5 py-3 text-base w-full text-black text-center font-medium placeholder-black/60 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1 text-center">
              Mã Hội Viên (Nếu có)
            </label>
            <input
              type="text"
              placeholder="Nhập mã hội viên ..."
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="border border-black rounded-xl px-5 py-3 text-base w-full text-black text-center font-medium placeholder-black/60 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all duration-200"
            />
          </div>

          <p className="text-sm text-red-500 font-medium text-center">
            * Nếu chưa có mã hội viên, hãy liên hệ nhân viên để đăng ký!
          </p>
        </div>
      </div>

      {/* Nút hành động ở dưới */}
      <div className="w-full p-4 bg-white shadow-inner">
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <button
            onClick={handleJoin}
            className="w-full flex items-center justify-center bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            Tham gia
          </button>
          <button
            onClick={handleCreateMatch}
            className="w-full flex items-center justify-center bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            Tạo trận đấu
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StartSessionPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải..." />}>
      <StartSessionContent />
    </Suspense>
  );
}
