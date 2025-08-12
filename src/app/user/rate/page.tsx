'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PopupFeedback from '@/app/user/popup/popupFeedback';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import { MessageCircleHeart } from 'lucide-react';
import { userFeedbackService } from '@/lib/userFeedbackService';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser showBack={true} />
      
      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">ĐÁNH GIÁ</h1>
        </div>

        <div className="flex-1 flex justify-center mt-25">
          <div className="w-full max-w-md space-y-4">
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
        </div>
      </main>

      <FooterButton>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-base sm:text-lg transition"
        >
          {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
        </button>
      </FooterButton>

      {showPopup && (
        <PopupFeedback
          onClose={() => setShowPopup(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}
