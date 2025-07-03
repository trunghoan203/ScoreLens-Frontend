'use client';

import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

export default function EndMatchPage() {
  const router = useRouter();

  const scoreA = 11;
  const scoreB = 3;

  const winner = scoreA > scoreB ? 'Team A' : scoreB > scoreA ? 'Team B' : 'Hoà';

  const handleRate = () => {
    router.push('/user/rate');
  };

  const handlePayment = () => {
    router.push('/user/thanh-toan');
  };

  return (
    <div className="flex flex-col justify-start min-h-screen pt-8 bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl text-center space-y-8 py-10">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="sm:w-28 sm:h-28">
            <ScoreLensLogo />
          </div>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Bàn 06 - Pool 8 Ball</h1>

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

        {/* Khung điểm */}
        <div className="bg-lime-400 text-white rounded-2xl px-6 py-5 w-full max-w-xs mx-auto shadow-md">
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

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs mx-auto">
          <Button
            onClick={handleRate}
            className="w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Đánh giá
          </Button>
          <Button
            onClick={handlePayment}
            className="w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
