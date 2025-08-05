/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { Button } from '@/components/ui/button';
import PopupEditScore from '@/app/user/popup/popupEditScore';
import PopupEndMatch from '@/app/user/popup/popupEndMatch';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';


export default function ScoreboardPage() {
  const router = useRouter();
  const [scoreA, setScoreA] = useState(5);
  const [scoreB, setScoreB] = useState(3);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [aiResults, setAiResults] = useState<string[]>([]);

  // Ví dụ mẫu khi chưa có dữ liệu từ backend
  const exampleResults = [
    'Team A - Bi số 5 vào đúng lỗ giữa.',
    'Team B - Lỗi, đánh bi trắng vào lỗ.',
    'Không xác định được tình huống – vui lòng kiểm tra lại video.',
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);

    // Chặn thao tác back của trình duyệt
    if (typeof window !== 'undefined') {
      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      };
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }

    // TODO: Gọi API từ backend và gán kết quả thật vào setAiResults()
    // fetch('/api/ai-results')
    //   .then(res => res.json())
    //   .then(data => setAiResults(data));

    return () => clearTimeout(timer);
  }, []);

  const handleEditScore = () => setShowEditPopup(true);
  const handleEndMatch = () => setShowEndPopup(true);

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
        <div className="flex-1 flex flex-col items-center text-center space-y-8 py-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
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
          <div className="bg-lime-400 text-white rounded-2xl px-8 py-8 space-y-2 shadow-md w-full">
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
          <div className="text-left w-full space-y-2">
            <p className="text-sm font-semibold text-black mb-1">Kết Quả</p>
            <div className="border border-gray-300 rounded-md p-3 text-sm text-black bg-white shadow-sm space-y-1">
              {(aiResults.length > 0 ? aiResults : exampleResults).map((item, index) => (
                <p key={index}>[AI]: {item}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Nút hành động dưới cùng */}
        <div className="w-full p-4 bg-white shadow-inner">
          <div className="flex flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            <Button
              onClick={handleEditScore}
              className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
            >
              Sửa điểm
            </Button>
            <Button
              onClick={handleEndMatch}
              className="w-1/2 bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
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
    </>
  );
}
