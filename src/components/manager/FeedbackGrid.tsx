import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { managerFeedbackService } from '@/lib/managerFeedbackService';
import toast from 'react-hot-toast';

interface Feedback {
  id: string;
  branch: string;
  table: string;
  time: string;
  status: 'pending' | 'managerP' | 'adminP' | 'superadminP' | 'resolved';
  feedback: string;
  notes: string;
  createdAt: Date;
}

interface FeedbackGridProps {
  search?: string;
  statusFilter?: string;
  dateFilter?: string;
  onFeedbackClick?: (id: string) => void;
}



export default function FeedbackGrid({
  search = "",
  statusFilter = "managerP",
  dateFilter = "",
  onFeedbackClick
}: FeedbackGridProps) {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const feedbacksData = await managerFeedbackService.getAllFeedbacks();
        let feedbacksArr: unknown[] = [];
        if (Array.isArray(feedbacksData)) feedbacksArr = feedbacksData;
        else if (feedbacksData && typeof feedbacksData === 'object' && Array.isArray((feedbacksData as { feedbacks?: unknown[] }).feedbacks)) feedbacksArr = (feedbacksData as { feedbacks: unknown[] }).feedbacks;
        else if (feedbacksData && typeof feedbacksData === 'object' && Array.isArray((feedbacksData as { data?: unknown[] }).data)) feedbacksArr = (feedbacksData as { data: unknown[] }).data;

        const mappedFeedbacks: Feedback[] = feedbacksArr.map(f => {
          const obj = f as any;

          // Đảm bảo tableName luôn là string
          let tableName = 'Không xác định';
          if (obj.tableInfo?.name) {
            tableName = String(obj.tableInfo.name);
          }

          return {
            id: String(obj.feedbackId || obj._id || ''),
            branch: String(obj.clubInfo?.clubName || 'Không xác định'),
            table: String(tableName),
            time: String(obj.createdAt ? new Date(obj.createdAt).toLocaleString('vi-VN') : 'Không xác định'),
            status: obj.status || 'pending',
            feedback: String(obj.content || ''),
            notes: String(obj.note || ''),
            createdAt: obj.createdAt ? new Date(obj.createdAt) : new Date(0),
          };
        });

        const sortedFeedbacks = mappedFeedbacks.sort((a, b) => {
          const dateA = a.createdAt.getTime();
          const dateB = b.createdAt.getTime();
          return dateB - dateA;
        });

        setFeedbacks(sortedFeedbacks);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải danh sách phản hồi');
        toast.error('Không thể tải danh sách phản hồi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFeedbacks = feedbacks.filter(f => {
    const branch = (f.branch || '').toString().toLowerCase();
    const table = (f.table || '').toString().toLowerCase();
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch = searchTerm === '' ||
      branch.includes(searchTerm) ||
      table.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;

    let matchesDate = true;
    if (dateFilter) {
      const feedbackDate = f.createdAt.toISOString().split('T')[0];
      matchesDate = feedbackDate === dateFilter;
    }

    if (searchTerm && (branch.includes(searchTerm) || table.includes(searchTerm))) {
      console.log(`🔍 Found match: "${searchTerm}" in branch: "${f.branch}" or table: "${f.table}"`);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'pending': return 'danger';
      case 'managerP': return 'danger';
      case 'adminP': return 'danger';
      case 'superadminP': return 'danger';
      default: return 'danger';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chưa xử lý';
      case 'resolved': return 'Đã xử lý';
      case 'managerP': return 'Manager đang xử lý';
      case 'adminP': return 'Admin đang xử lý';
      case 'superadminP': return 'Super Admin đang xử lý';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (filteredFeedbacks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        <LoadingSkeleton type="text" lines={2} />
        <div>Không có dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden space-y-2">
      <div className="grid grid-cols-4 bg-[#181818] text-[#FFFFFF] font-semibold text-center">
        <div className="py-3">CHI NHÁNH</div>
        <div className="py-3">BÀN</div>
        <div className="py-3">THỜI GIAN</div>
        <div className="py-3">TRẠNG THÁI</div>
      </div>

      <div className="space-y-2">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="grid grid-cols-4 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
            onClick={() => onFeedbackClick && onFeedbackClick(feedback.id)}
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
