import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface Feedback {
  id: string;
  branch: string;
  table: string;
  time: string;
  status: 'managerP' | 'adminP' | 'superadminP' | 'resolved';
  feedback: string;
  notes: string;
}

export default function FeedbackTable({ feedbacks }: { feedbacks: Feedback[] }) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'managerP': return 'danger';
      case 'adminP': return 'danger';
      case 'superadminP': return 'danger';
      default: return 'danger';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Đã xử lý';
      case 'managerP': return 'Quản lý xử lý';
      case 'adminP': return 'Chủ doanh nghiệp xử lý';
      case 'superadminP': return 'Quản trị viên xử lý';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="rounded-lg overflow-hidden space-y-2">
      <div className="grid grid-cols-4 bg-[#181818] text-[#FFFFFF] font-semibold text-center">
        <div className="py-3">CHI NHÁNH</div>
        <div className="py-3">BÀN</div>
        <div className="py-3">THỜI GIAN</div>
        <div className="py-3">TRẠNG THÁI</div>
      </div>

      <div className="space-y-2">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="grid grid-cols-4 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
            onClick={() => router.push(`/admin/feedbacks/${feedback.id}`)}
          >
            <div className="py-4 font-semibold text-[#000000]">{feedback.branch}</div>
            <div className="py-4 text-gray-700">{feedback.table}</div>
            <div className="py-4 text-gray-700">{feedback.time}</div>
            <div className="py-4 flex justify-center">
              <Badge
                variant={getStatusColor(feedback.status)}
                className="text-sm font-semibold flex-shrink-0 whitespace-nowrap"
              >
                {getStatusText(feedback.status)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
