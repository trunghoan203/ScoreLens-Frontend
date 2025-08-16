'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { userFeedbackService } from '@/lib/userFeedbackService';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';

interface FeedbackProps {
  onClose: () => void;
  onSuccess: () => void;
  matchId: string;
  tableId?: string;
  clubId?: string;
  membershipId?: string;
  guestToken?: string;
}

export default function Feedback({
  onClose,
  onSuccess,
  matchId,
  tableId,
  clubId,
  membershipId,
  guestToken
}: FeedbackProps) {
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tableInfo, setTableInfo] = useState<{
    tableId?: string;
    clubId?: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    const loadTableInfo = async () => {
      try {
        let finalTableId = tableId;

        if (!finalTableId && matchId) {
          try {
            const matchData = await userMatchService.getMatchById(matchId);
            const responseData = (matchData as { data?: { tableId?: string } })?.data || matchData;
            finalTableId = (responseData as { tableId?: string })?.tableId;
          } catch (error) {
            console.error('Error loading match data:', error);
          }
        }

        if (finalTableId) {
          const tableData = await userMatchService.verifyTable({ tableId: finalTableId });
          const responseData = (tableData as { data?: { tableId?: string; clubId?: string; name?: string } })?.data || tableData;
          setTableInfo(responseData as { tableId?: string; clubId?: string; name?: string });
        }
      } catch (error) {
        console.error('Error loading table info:', error);
      }
    };

    loadTableInfo();
  }, [tableId, matchId]);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Vui lòng nhập phản hồi!');
      return;
    }

    const finalTableId = tableId || tableInfo?.tableId;

    if (!finalTableId) {
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
        : { userId: guestToken || '', type: 'guest' as const };

      const feedbackData = {
        createdBy,
        clubInfo: { clubId: finalClubId },
        tableInfo: { tableId: finalTableId },
        content: feedback.trim()
      };

      await userFeedbackService.createFeedback(feedbackData);

      setFeedback('');
      onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Gửi phản hồi thất bại!';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className="relative bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#000000]">ĐÁNH GIÁ</h2>
          <p className="text-sm text-gray-600 mt-2">Chia sẻ trải nghiệm của bạn</p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#8ADB10] rounded-xl px-4 py-3 text-left space-y-2 w-full">
            <p className="text-[#FFFFFF] font-semibold text-sm">ĐÁNH GIÁ:</p>
            <div className="bg-white rounded-xl p-2">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="w-full rounded-lg p-2 outline-none text-[#000000] text-sm resize-none bg-transparent"
                placeholder="Nhập đánh giá của bạn..."
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            style={{ backgroundColor: '#FF0000' }}
            className="flex-1 hover:bg-red-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-base transition"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ backgroundColor: '#8ADB10' }}
            className="flex-1 hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-base transition"
          >
            {submitting ? 'Đang gửi...' : 'Đánh giá'}
          </Button>
        </div>
      </div>
    </div>
  );
}
