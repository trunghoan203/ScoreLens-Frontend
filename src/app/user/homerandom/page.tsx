'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { BackButton } from '@/components/ui/BackButton';

function HomeRandomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableNumber = searchParams.get('table') || '??';

  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);

    const digits = '123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      const randomDigit = digits[Math.floor(Math.random() * digits.length)];
      code += randomDigit;
    }
    setRoomCode(code);

    return () => clearTimeout(timer);
  }, []);

  const qrJoinUrl = `https://scorelens.vercel.app/user/screencontrol?table=${tableNumber}&room=${roomCode}`;

  const handleStart = () => {
    router.push(`/user/screencontrol?table=${tableNumber}&room=${roomCode}`);
  };

  if (loading) return <ScoreLensLoading text="Đang tạo mã phòng..." />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 relative">
      {/* Nút Back ở góc trên bên trái */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton onClick={() => router.back()} />
      </div>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-black">
            Bàn {tableNumber} - Pool 8 Ball
          </h2>
          <p className="text-sm sm:text-base text-black font-medium">
            Quét mã hoặc nhập mã bên dưới để tham gia
          </p>
        </div>

        {/* Mã tham gia */}
        <div className="space-y-1">
          <p className="text-base font-medium text-black">Mã Tham Gia</p>
          <div className="border border-black rounded-md px-4 py-2 text-lg font-bold text-black inline-block tracking-widest bg-white">
            {roomCode}
          </div>
        </div>

        {/* QR Code */}
        <div className="space-y-1">
          <p className="text-base font-medium text-black">Mã QR</p>
          <div className="p-2 bg-white border rounded-md inline-block">
            <QRCodeCanvas value={qrJoinUrl} size={180} />
          </div>
        </div>
      </div>

      {/* Nút bắt đầu ở dưới */}
      <div className="w-full p-4 bg-white shadow-inner">
        <button
          onClick={handleStart}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-base sm:text-lg transition"
        >
          Bắt đầu
        </button>
      </div>
    </div>
  );
}

export default function HomeRandomPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải..." />}>
      <HomeRandomContent />
    </Suspense>
  );
}
