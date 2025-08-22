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
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="rounded-lg overflow-hidden space-y-2 min-w-[800px]">
          <div className="grid grid-cols-4 bg-[#181818] text-[#FFFFFF] font-semibold text-center">
            <div className="py-3 text-sm xl:text-base">CHI NHÁNH</div>
            <div className="py-3 text-sm xl:text-base">BÀN</div>
            <div className="py-3 text-sm xl:text-base">THỜI GIAN</div>
            <div className="py-3 text-sm xl:text-base">TRẠNG THÁI</div>
          </div>

          <div className="space-y-2">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="grid grid-cols-4 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
                onClick={() => router.push(`/admin/feedbacks/${feedback.id}`)}
              >
                <div className="py-4 font-semibold text-[#000000] text-sm xl:text-base px-2 truncate">{feedback.branch}</div>
                <div className="py-4 text-gray-700 text-sm xl:text-base px-2">{feedback.table}</div>
                <div className="py-4 text-gray-700 text-sm xl:text-base px-2">{feedback.time}</div>
                <div className="py-4 flex justify-center px-2">
                  <Badge
                    variant={getStatusColor(feedback.status)}
                    className="text-xs xl:text-sm font-semibold flex-shrink-0 whitespace-nowrap min-w-[200px]"
                  >
                    {getStatusText(feedback.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="block lg:hidden space-y-3 sm:space-y-4">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
            onClick={() => router.push(`/admin/feedbacks/${feedback.id}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{feedback.branch}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Bàn: {feedback.table}</p>
              </div>
              <div className="ml-2 sm:ml-3 flex-shrink-0">
                <Badge
                  variant={getStatusColor(feedback.status)}
                  className="text-xs font-medium whitespace-nowrap"
                >
                  {getStatusText(feedback.status)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">Thời gian:</span>
                <span className="text-gray-800 text-xs sm:text-sm font-medium">{feedback.time}</span>
              </div>
              {feedback.feedback && (
                <div className="mt-2">
                  <span className="text-gray-500 text-xs font-medium block mb-1">Nội dung:</span>
                  <p className="text-gray-800 text-xs sm:text-sm line-clamp-2">{feedback.feedback}</p>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-end">
                <span className="text-lime-600 text-xs font-medium">Nhấn để xem chi tiết →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
