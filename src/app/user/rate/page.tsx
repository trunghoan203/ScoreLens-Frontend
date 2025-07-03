'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { Button } from '@/components/ui/button';
import PopupFeedback from '@/app/user/popup/popupFeedback';

export default function RatePage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    console.log('Feedback:', feedback);
    setShowPopup(true);
  };

  const handleConfirmPayment = () => {
    setShowPopup(false);
    router.push('/user/thanh-toan');
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen pt-10 bg-gradient-to-b from-white to-gray-100 px-4">
      {/* Nội dung bị mờ khi hiện popup */}
      <div
        className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center space-y-8 py-10 transition-all duration-300 ${
          showPopup ? 'blur-sm backdrop-brightness-95' : ''
        }`}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <div className="sm:w-28 sm:h-28">
            <ScoreLensLogo />
          </div>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">ĐÁNH GIÁ</h1>

        {/* Khung phản hồi */}
        <div className="bg-lime-400 rounded-xl px-4 py-3 text-left space-y-2">
          <p className="text-white font-semibold text-sm">PHẢN HỒI:</p>
          <div className="bg-white rounded-xl p-2">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="w-full rounded-lg p-2 outline-none text-black text-sm resize-none bg-transparent"
              placeholder="Nhập phản hồi của bạn..."
            />
          </div>
        </div>

        {/* Nút đánh giá */}
        <div className="w-full">
          <Button
            onClick={handleSubmit}
            className="w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Đánh giá
          </Button>
        </div>
      </div>

      {/* Popup Feedback */}
      {showPopup && (
        <PopupFeedback
          onClose={() => setShowPopup(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}
