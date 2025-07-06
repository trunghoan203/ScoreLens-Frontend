'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar } from 'lucide-react';

interface Feedback {
  id: string;
  branch: string;
  table: string;
  date: string;
  status: 'Chưa xử lý' | 'Đã xử lý';
}

const feedbacks: Feedback[] = [
  { id: '1', branch: 'Chi nhánh 1', table: 'Bàn 1', date: '2025-06-11', status: 'Chưa xử lý' },
  { id: '2', branch: 'Chi nhánh 1', table: 'Bàn 4', date: '2025-06-11', status: 'Đã xử lý' },
  { id: '3', branch: 'Chi nhánh 2', table: 'Bàn 2', date: '2025-06-10', status: 'Chưa xử lý' },
  { id: '4', branch: 'Chi nhánh 2', table: 'Bàn 3', date: '2025-06-09', status: 'Đã xử lý' },
  { id: '5', branch: 'Chi nhánh 3', table: 'Bàn 5', date: '2025-06-08', status: 'Chưa xử lý' },
  { id: '6', branch: 'Chi nhánh 3', table: 'Bàn 6', date: '2025-06-07', status: 'Đã xử lý' },
  { id: '7', branch: 'Chi nhánh 1', table: 'Bàn 7', date: '2025-06-06', status: 'Chưa xử lý' },
  { id: '8', branch: 'Chi nhánh 1', table: 'Bàn 8', date: '2025-06-05', status: 'Đã xử lý' },
  { id: '9', branch: 'Chi nhánh 2', table: 'Bàn 9', date: '2025-06-04', status: 'Chưa xử lý' },
  { id: '10', branch: 'Chi nhánh 2', table: 'Bàn 10', date: '2025-06-03', status: 'Đã xử lý' },
  { id: '11', branch: 'Chi nhánh 3', table: 'Bàn 11', date: '2025-06-02', status: 'Chưa xử lý' },
  { id: '12', branch: 'Chi nhánh 3', table: 'Bàn 12', date: '2025-06-01', status: 'Đã xử lý' },
];

export function FeedbackTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch =
      fb.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || fb.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const displayedFeedbacks = showAll ? filteredFeedbacks : filteredFeedbacks.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="backdrop-blur-md bg-white/60 border border-gray-200 rounded-2xl shadow-lg px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-extrabold text-black">Quản lí phản hồi</h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm phản hồi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
            />
          </div>

          {/* Date Picker */}
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
        <div className="grid grid-cols-4 bg-black text-white text-center text-sm font-semibold rounded-lg">
          <div className="py-3">CHI NHÁNH</div>
          <div className="py-3">BÀN</div>
          <div className="py-3">NGÀY</div>
          <div className="py-3">TRẠNG THÁI</div>
        </div>

        {/* Feedback Cards */}
        {displayedFeedbacks.length > 0 ? (
          <div className="space-y-2">
            {displayedFeedbacks.map((fb) => (
              <div
                key={fb.id}
                onClick={() => router.push(`/superadmin/feedback/${fb.id}`)}
                className="grid grid-cols-4 items-center text-center bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="py-4 font-medium text-sm text-gray-800">{fb.branch}</div>
                <div className="py-4 text-sm text-gray-800">{fb.table}</div>
                <div className="py-4 text-sm text-gray-800">{fb.date}</div>
                <div className="flex justify-center py-4">
                  <Badge
                    variant={fb.status === 'Đã xử lý' ? 'success' : 'danger'}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {fb.status}
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
