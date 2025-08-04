'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { Button } from '@/components/ui/button';
import PopupFeedback from '@/app/user/popup/popupFeedback';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { MessageCircleHeart } from 'lucide-react';
import { userFeedbackService } from '@/lib/userFeedbackService';
import toast from 'react-hot-toast';
import { BackButton } from '@/components/ui/BackButton';

export default function RatePage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Vui lòng nhập phản hồi!');
      return;
    }
    setSubmitting(true);
    try {
      // TODO: Lấy clubId, tableId động nếu cần
      await userFeedbackService.createFeedback({
        clubId: 'CLB-1751950292581-3267',
        tableId: 'TB-1752296882416',
        content: feedback,
        createdBy: { type: 'guest' },
      });
      setShowPopup(true);
      setFeedback('');
      toast.success('Gửi phản hồi thành công!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Gửi phản hồi thất bại!';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = () => {
    setShowPopup(false);
    router.push('/user/thanh-toan');
  };

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 relative">
      {/* Nút Back ở góc trên bên trái */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton onClick={() => router.back()} />
      </div>
      {/* Nội dung chính */}
      <div
        className={`flex-1 flex flex-col items-center text-center space-y-8 py-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto transition-all duration-300 ${
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
        <h1 className="text-2xl sm:text-3xl font-bold text-black">ĐÁNH GIÁ</h1>

        {/* Khung phản hồi */}
        <div className="bg-lime-400 rounded-xl px-4 py-3 text-left space-y-2 w-full">
          <p className="text-white font-semibold text-sm">PHẢN HỒI:</p>
          <div className="bg-white rounded-xl p-2">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="w-full rounded-lg p-2 outline-none text-black text-sm resize-none bg-transparent"
              placeholder="Nhập phản hồi của bạn..."
              disabled={submitting}
            />
          </div>
        </div>
      </div>

      {/* Nút dưới cùng */}
      <div className="w-full p-4 bg-white shadow-inner">
        <div className="flex flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <Button
            onClick={handleSubmit}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2"
            disabled={submitting}
          >
            <MessageCircleHeart size={18} />
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <PopupFeedback
          onClose={() => setShowPopup(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}
