import React from 'react';

interface Feedback {
  id: string;
  branch: string;
  table: string;
  time: string;
  status: 'pending' | 'managerP' | 'adminP' | 'superadminP' | 'resolved';
  cameraReliability: number;
  feedback: string;
  notes: string;
}

interface FeedbackGridProps {
  feedbacks: Feedback[];
  onFeedbackClick?: (id: string) => void;
}

export default function FeedbackGrid({ feedbacks, onFeedbackClick }: FeedbackGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'managerP': return 'bg-blue-500';
      case 'adminP': return 'bg-purple-500';
      case 'superadminP': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'managerP': return 'Manager đang xử lý';
      case 'adminP': return 'Admin đang xử lý';
      case 'superadminP': return 'Super Admin đang xử lý';
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
            onClick={() => onFeedbackClick && onFeedbackClick(feedback.id)}
          >
            <div className="py-4 font-semibold text-[#000000]">{feedback.branch}</div>
            <div className="py-4 text-gray-700">{feedback.table}</div>
            <div className="py-4 text-gray-700">{feedback.time}</div>
            <div className="py-4 flex justify-center">
              <span className={
                `inline-flex items-center justify-center rounded-full text-sm font-bold text-white px-4 py-2 ` +
                `w-50 ${getStatusColor(feedback.status)}`
              }>
                {getStatusText(feedback.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
