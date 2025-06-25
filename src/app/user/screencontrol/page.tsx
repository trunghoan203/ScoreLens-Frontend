/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { Button } from '@/components/ui/button';

export default function ScoreboardPage() {
  const router = useRouter();

  const handleEditScore = () => {
    // Xử lý chỉnh sửa điểm
    console.log('Sửa điểm');
  };

  const handleEndMatch = () => {
    // Xử lý kết thúc trận
    console.log('Kết thúc trận');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <ScoreLensLogo />
        </div>

        {/* Bàn số + tiêu đề */}
        <div>
          <h1 className="text-xl font-bold text-black">Bàn 06 - Pool 8 Ball</h1>
          <p className="text-sm text-black font-medium mt-1">BẢNG ĐIỂM</p>
        </div>

        {/* Khung điểm số */}
        <div className="bg-lime-400 text-white rounded-2xl px-4 py-6 space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-center w-12">
              <p className="text-sm font-semibold">Team A</p>
              <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mt-1" />
            </div>

            <p className="text-4xl font-bold">5 : 3</p>

            <div className="text-center w-12">
              <p className="text-sm font-semibold">Team B</p>
              <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mt-1" />
            </div>
          </div>
          <p className="text-xs text-right pr-1">Đến Lượt Đánh</p>
        </div>

        {/* Kết quả trận */}
        <div className="text-left">
          <p className="text-sm font-semibold text-black mb-1">Kết Quả</p>
          <div className="border border-gray-400 rounded p-2 text-sm text-black text-left">
            [AI]: The Sharks - Lỗi, Bi Chủ Rơi Vào Lỗ.
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-4">
          <Button
            onClick={handleEditScore}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md py-3 text-lg"
          >
            Sửa điểm
          </Button>
          <Button
            onClick={handleEndMatch}
            className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-md py-3 text-lg"
          >
            Kết thúc
          </Button>
        </div>
      </div>
    </div>
  );
}
