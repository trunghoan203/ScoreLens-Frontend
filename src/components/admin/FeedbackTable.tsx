import React from 'react';
import { useRouter } from 'next/navigation';

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

export default function FeedbackTable({ feedbacks }: { feedbacks: Feedback[] }) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'resolved':
        return 'Đã giải quyết';
      case 'in_progress':
        return 'Đang xử lý';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="space-y-2 rounded-lg overflow-hidden">
      <div className="grid grid-cols-4 bg-black text-white font-semibold text-center">
        <div className="py-3">CHI NHÁNH</div>
        <div className="py-3">BÀN</div>
        <div className="py-3">THỜI GIAN</div>
        <div className="py-3">TRẠNG THÁI</div>
      </div>
      {feedbacks.map((feedback) => (
        <div
          key={feedback.id}
          className="grid grid-cols-4 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
          onClick={() => router.push(`/admin/feedbacks/${feedback.id}`)}
        >
          <div className="py-4 font-semibold text-black">{feedback.branch}</div>
          <div className="py-4 text-gray-700">{feedback.table}</div>
          <div className="py-4 text-gray-700">{feedback.time}</div>
          <div className="py-4 flex justify-center">
            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(feedback.status)}`}>
              {getStatusText(feedback.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
