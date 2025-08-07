'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';


export default function EndMatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Giả lập điểm số – thay bằng dữ liệu thật nếu có
  const scoreA = 11;
  const scoreB = 3;
  const winner = scoreA > scoreB ? 'Team A' : scoreB > scoreA ? 'Team B' : 'Hoà';

  const handleRate = () => router.push('/user/rate');
  const handlePayment = () => router.push('/user/thanh-toan');

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
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          Bàn 06 - Pool 8 Ball
        </h1>

        {/* Đội chiến thắng */}
        <div>
          <p className="text-sm font-medium text-black">Đội chiến thắng</p>
          {winner !== 'Hoà' ? (
            <div className="flex items-center justify-center gap-2 text-lime-600 font-bold text-xl mt-1">
              <Trophy size={22} className="text-yellow-500" />
              <span>{winner}</span>
              <Trophy size={22} className="text-yellow-500" />
            </div>
          ) : (
            <p className="text-black font-bold mt-1 text-lg">Hoà</p>
          )}
        </div>

        {/* Khung điểm số */}
        <div className="bg-lime-400 text-white rounded-2xl px-8 py-8 space-y-2 shadow-md w-full">
          <div className="flex justify-between text-sm font-semibold mb-1">
            <p>Team A</p>
            <p>Team B</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2 text-4xl font-bold">
              <span className={scoreA > scoreB ? 'text-yellow-300' : 'text-white'}>
                {scoreA}
              </span>
              <span className="text-white text-3xl">:</span>
              <span className={scoreB > scoreA ? 'text-yellow-300' : 'text-white'}>
                {scoreB}
              </span>
            </div>
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Lời cảm ơn */}
        <p className="text-black text-base sm:text-lg font-medium leading-relaxed">
          Cảm ơn bạn đã sử dụng <br />
          <span className="font-bold text-xl">ScoreLens!</span>
        </p>
      </div>

      {/* Nút hành động dưới cùng */}
      <div className="w-full p-4 bg-white shadow-inner">
        <div className="flex flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <Button
            onClick={handleRate}
            className="w-full flex items-center justify-center bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            Đánh giá
          </Button>
          <Button
            onClick={handlePayment}
            className="w-full flex items-center justify-center bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
