/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { Button } from '@/components/ui/button';
import PopupEditScore from '@/app/user/popup/popupEditScore';
import PopupEndMatch from '@/app/user/popup/popupEndMatch';

export default function ScoreboardPage() {
  const router = useRouter();
  const [scoreA, setScoreA] = useState(5);
  const [scoreB, setScoreB] = useState(3);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);

  const handleEditScore = () => {
    setShowEditPopup(true);
  };

  const handleEndMatch = () => {
    setShowEndPopup(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl space-y-8 text-center py-10">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="sm:w-28 sm:h-28">
            <ScoreLensLogo />
          </div>
        </div>

        {/* Tiêu đề */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Bàn 06 - Pool 8 Ball</h1>
          <p className="text-sm sm:text-base text-black font-medium">BẢNG ĐIỂM</p>
        </div>

        {/* Khung điểm số */}
        <div className="bg-lime-400 text-white rounded-2xl px-6 py-6 space-y-2 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div className="text-center flex flex-col items-center w-20">
              <p className="text-sm font-semibold">Team A</p>
              <div className="w-10 h-10 bg-gray-200 rounded-full mt-1" />
            </div>

            <div className="text-4xl font-bold">{scoreA} : {scoreB}</div>

            <div className="text-center flex flex-col items-center w-20">
              <p className="text-sm font-semibold">Team B</p>
              <div className="w-10 h-10 bg-gray-200 rounded-full mt-1" />
            </div>
          </div>
          <p className="text-xs text-right italic">Đến lượt đánh</p>
        </div>

        {/* Kết quả AI */}
        <div className="text-left">
          <p className="text-sm font-semibold text-black mb-1">Kết Quả</p>
          <div className="border border-gray-400 rounded-md p-3 text-sm text-black bg-white shadow-sm">
            [AI]: The Sharks - Lỗi, Bi chủ rơi vào lỗ.
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleEditScore}
            className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Sửa điểm
          </Button>
          <Button
            onClick={handleEndMatch}
            className="w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Kết thúc
          </Button>
        </div>
      </div>

      {/* Popup edit score */}
      {showEditPopup && (
        <PopupEditScore
          onClose={() => setShowEditPopup(false)}
          onSave={(newScoreA, newScoreB, note) => {
            setScoreA(newScoreA);
            setScoreB(newScoreB);
            setShowEditPopup(false);
            // Có thể lưu ghi chú hoặc hiển thị dưới kết quả nếu cần
          }}
        />
      )}

      {/* Popup end match */}
      {showEndPopup && (
        <PopupEndMatch
          onClose={() => setShowEndPopup(false)}
          onConfirm={() => {
            console.log('Trận đã kết thúc');
            setShowEndPopup(false);
            router.push('/user/endmatch');
          }}
        />
      )}
    </div>
  );
}
