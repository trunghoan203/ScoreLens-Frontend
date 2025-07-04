'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

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
];

export function FeedbackTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch =
      fb.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || fb.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-4">
      {/* Search + Date Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm phản hồi"
          className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs focus:outline-none focus:border-lime-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto focus:outline-none focus:border-lime-500"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden border border-gray-300">
        <div className="grid grid-cols-4 bg-black text-white text-center font-semibold text-sm">
          <div className="py-2">CHI NHÁNH</div>
          <div className="py-2">BÀN</div>
          <div className="py-2">NGÀY</div>
          <div className="py-2">TRẠNG THÁI</div>
        </div>

        {filteredFeedbacks.map((fb) => (
          <div
            key={fb.id}
            className="grid grid-cols-4 items-center text-center border-t bg-white hover:bg-gray-50 transition text-sm text-gray-800"
          >
            <div className="py-2 font-medium">{fb.branch}</div>
            <div className="py-2">{fb.table}</div>
            <div className="py-2">{fb.date}</div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 py-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  fb.status === 'Đã xử lý' ? 'bg-lime-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {fb.status}
              </span>
              <Button
                size="sm"
                className="bg-lime-500 text-white hover:bg-lime-600 text-xs px-3 py-1 rounded"
                onClick={() => alert(`Xem chi tiết phản hồi ${fb.id}`)}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button className="bg-lime-500 px-8 py-2 text-white font-semibold hover:bg-lime-600">
          XEM THÊM
        </Button>
      </div>
    </div>
  );
}
