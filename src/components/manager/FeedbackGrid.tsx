import React from 'react';

interface Feedback {
  id: string;
  branch: string;
  table: string;
  time: string;
  status: 'pending' | 'resolved' | 'in_progress';
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
      case 'in_progress': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'in_progress': return 'Đang xử lý';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="rounded-lg overflow-hidden space-y-2"> {/* Cách đều header và body */}
      {/* Header */}
      <div className="grid grid-cols-4 bg-black text-white font-semibold text-center">
        <div className="py-3">CHI NHÁNH</div>
        <div className="py-3">BÀN</div>
        <div className="py-3">THỜI GIAN</div>
        <div className="py-3">TRẠNG THÁI</div>
      </div>

      {/* Body */}
      <div className="space-y-2"> {/* Cách đều từng hàng */}
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="grid grid-cols-4 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
            onClick={() => onFeedbackClick && onFeedbackClick(feedback.id)}
          >
            <div className="py-4 font-semibold text-black">{feedback.branch}</div>
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
