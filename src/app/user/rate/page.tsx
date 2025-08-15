'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PopupFeedback from '@/app/user/popup/popupFeedback';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import { MessageCircleHeart } from 'lucide-react';
import { userFeedbackService } from '@/lib/userFeedbackService';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';

export default function RatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tableInfo, setTableInfo] = useState<any>(null);
  
  const matchId = searchParams?.get('matchId') || '';
  const tableId = searchParams?.get('tableId') || '';
  const clubId = searchParams?.get('clubId') || '';
  const membershipId = searchParams?.get('membershipId') || '';
  const guestToken = searchParams?.get('guestToken') || '';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tableId) {
      const loadTableInfo = async () => {
        try {
          const tableData = await userMatchService.verifyTable({ tableId });
          const responseData = (tableData as any)?.data || tableData;
          setTableInfo(responseData);
        } catch (error) {
        }
      };
      loadTableInfo();
    }
  }, [tableId]);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Vui lòng nhập phản hồi!');
      return;
    }
    
    if (!tableId) {
      toast.error('Thiếu thông tin bàn để gửi phản hồi!');
      return;
    }
    
    const finalClubId = clubId || tableInfo?.clubId;
    
    if (!finalClubId) {
      toast.error('Không thể xác định thông tin câu lạc bộ!');
      return;
    }
    
    if (!membershipId && !guestToken) {
      toast.error('Thiếu thông tin xác thực người dùng!');
      return;
    }
    
    setSubmitting(true);
    try {
      const createdBy = membershipId 
        ? { userId: membershipId, type: 'membership' as const }
        : { userId: guestToken, type: 'guest' as const };
      
      const feedbackData = {
        createdBy,
        clubInfo: { clubId: finalClubId },
        tableInfo: { tableId },
        content: feedback.trim()
      };
      
      await userFeedbackService.createFeedback(feedbackData);
      
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">ĐÁNH GIÁ</h1>
        </div>

        <div className="flex-1 flex justify-center mt-25">
          <div className="w-full max-w-md space-y-4">
            <div className="bg-[#8ADB10] rounded-xl px-4 py-3 text-left space-y-2 w-full">
              <p className="text-[#FFFFFF] font-semibold text-sm">PHẢN HỒI:</p>
              <div className="bg-white rounded-xl p-2">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg p-2 outline-none text-[#000000] text-sm resize-none bg-transparent"
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
          className="w-full bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-base sm:text-lg transition"
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
