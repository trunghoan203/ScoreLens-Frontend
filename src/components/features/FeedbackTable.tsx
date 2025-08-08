'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar } from 'lucide-react';
import { getAllFeedback } from '@/lib/saFeedbackService';
import toast from 'react-hot-toast';

interface ApiFeedback {
  _id: string;
  feedbackId: string;
  createdBy: {
    userId: string;
    type: 'guest' | 'membership';
  };
  content: string;
  status: 'resolved' | 'pending' | 'managerP' | 'adminP' | 'superadminP';
  needSupport: boolean;
  note?: string;
  history: Array<{
    byId: string;
    byName: string;
    byRole: string;
    action: string;
    note?: string;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
  clubInfo?: {
    clubName: string;
    address: string;
    phoneNumber: string;
  };
  tableInfo?: {
    name: string;
    category: string;
  };
}

export function FeedbackTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('superadminP');
  const [showAll, setShowAll] = useState(false);
  const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllFeedback()
      .then((res) => {
        const data = res.data as { feedbacks: ApiFeedback[] };
        setFeedbacks(data.feedbacks);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Không lấy được danh sách phản hồi');
        setFeedbacks([]);
        setLoading(false);
      });
  }, []);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch =
      (fb.clubInfo?.clubName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fb.tableInfo?.name?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || (fb.createdAt ? new Date(fb.createdAt).toISOString().slice(0, 10) : '') === selectedDate;
    const matchesStatus = !statusFilter || fb.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const sortedFeedbacks = filteredFeedbacks.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const displayedFeedbacks = showAll ? sortedFeedbacks : sortedFeedbacks.slice(0, 10);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Đã xử lý';
      case 'pending': return 'Chưa xử lý';
      case 'managerP': return 'Manager đang xử lý';
      case 'adminP': return 'Admin đang xử lý';
      case 'superadminP': return 'Super Admin đang xử lý';
      default: return 'Không xác định';
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="backdrop-blur-md border-lime-400 bg-white/60 border border-gray-200 rounded-2xl shadow-lg px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-300">
        {/* Search*/}
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm phản hồi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
          />
        </div>

        {/* Status and Date Filters Group */}
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Status Filter*/}
          <div className="relative w-full sm:w-60">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-base font-medium text-black shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none appearance-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="superadminP">Super Admin đang xử lý</option>
              <option value="adminP">Admin đang xử lý</option>
              <option value="managerP">Manager đang xử lý</option>
              <option value="pending">Chưa xử lý</option>
              <option value="resolved">Đã xử lý</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Date Picker*/}
          <div className="relative w-full sm:w-60">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 bg-black text-white text-center text-sm font-semibold rounded-lg">
          <div className="col-span-3 py-3">CHI NHÁNH</div>
          <div className="col-span-2 py-3">BÀN</div>
          <div className="col-span-3 py-3">NGÀY</div>
          <div className="col-span-4 py-3">TRẠNG THÁI</div>
        </div>

        {/* Feedback Cards */}
        {loading ? (
          <div className="py-8 text-center text-gray-500">Đang tải...</div>
        ) : displayedFeedbacks.length > 0 ? (
          <div className="space-y-2">
            {displayedFeedbacks.map((fb) => (
              <div
                key={fb.feedbackId}
                onClick={() => router.push(`/superadmin/feedback/${fb.feedbackId}`)}
                className="grid grid-cols-12 items-center text-center bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="col-span-3 p-4 font-semibold text-black text-base">{fb.clubInfo?.clubName || ''}</div>
                <div className="col-span-2 py-4 text-sm text-gray-800">{fb.tableInfo?.name || ''}</div>
                <div className="col-span-3 py-4 text-sm text-gray-800">{fb.createdAt ? new Date(fb.createdAt).toISOString().slice(0, 10) : ''}</div>
                <div className="col-span-4 flex justify-center items-center py-4 px-2">
                  <Badge
                    variant={getStatusColor(fb.status)}
                    className="text-sm font-semibold flex-shrink-0 whitespace-nowrap"
                  >
                    {getStatusText(fb.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">Không tìm thấy phản hồi nào.</div>
        )}
      </div>

      {/* Load More */}
      {filteredFeedbacks.length > 10 && !showAll && (
        <div className="text-center">
          <Button
            onClick={() => setShowAll(true)}
            className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-8 py-3 text-base rounded-xl shadow hover:shadow-md transition"
          >
            XEM THÊM
          </Button>
        </div>
      )}
    </div>
  );
}