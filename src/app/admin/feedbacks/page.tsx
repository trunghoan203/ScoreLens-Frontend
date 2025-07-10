"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import FeedbackTable from "@/components/admin/FeedbackTable";
import FeedbackSearchBar from "@/components/admin/FeedbackSearchBar";
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { TableSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Dữ liệu mẫu cho phản hồi
const feedbacksData = [
  { 
    id: '1', 
    branch: 'Chi nhánh 1', 
    table: 'Bàn 01', 
    time: '15:30 20/12/2024', 
    status: 'pending' as const, 
    cameraReliability: 85, 
    feedback: 'Camera không hoạt động tốt, cần kiểm tra lại', 
    notes: 'Đã báo cáo cho kỹ thuật viên' 
  },
  { 
    id: '2', 
    branch: 'Chi nhánh 2', 
    table: 'Bàn 03', 
    time: '14:15 20/12/2024', 
    status: 'resolved' as const, 
    cameraReliability: 95, 
    feedback: 'Hệ thống hoạt động tốt, không có vấn đề gì', 
    notes: 'Khách hàng hài lòng' 
  },
  { 
    id: '3', 
    branch: 'Chi nhánh 1', 
    table: 'Bàn 05', 
    time: '16:45 20/12/2024', 
    status: 'in_progress' as const, 
    cameraReliability: 70, 
    feedback: 'Có vấn đề với việc ghi điểm, cần khắc phục', 
    notes: 'Đang xử lý bởi đội kỹ thuật' 
  },
  { 
    id: '4', 
    branch: 'Chi nhánh 3', 
    table: 'Bàn 02', 
    time: '13:20 20/12/2024', 
    status: 'resolved' as const, 
    cameraReliability: 90, 
    feedback: 'Cải thiện tốt, hệ thống hoạt động ổn định', 
    notes: 'Khách hàng phản hồi tích cực' 
  },
];

export default function AdminFeedbacksPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const filteredFeedbacks = feedbacksData.filter(f => 
    f.branch.toLowerCase().includes(search.toLowerCase()) ||
    f.table.toLowerCase().includes(search.toLowerCase()) ||
    f.feedback.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 900);
  };

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderAdminPage />
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              PHẢN HỒI
            </span>
          </div>
          {/* Thanh tìm kiếm */}
          <FeedbackSearchBar
            search={search}
            setSearch={handleSearch}
          />
          {tableLoading ? (
            <div className="mt-6"><TableSkeleton rows={5} /></div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="mt-6"><LoadingSkeleton type="card" lines={1} className="w-full max-w-md mx-auto" /></div>
          ) : (
            <FeedbackTable feedbacks={filteredFeedbacks} />
          )}
        </main>
      </div>
    </>
  );
} 