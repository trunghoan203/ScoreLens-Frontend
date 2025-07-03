"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import FeedbackTable from "@/components/admin/FeedbackTable";
import FeedbackSearchBar from "@/components/admin/FeedbackSearchBar";

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
  const filteredFeedbacks = feedbacksData.filter(f => 
    f.branch.toLowerCase().includes(search.toLowerCase()) ||
    f.table.toLowerCase().includes(search.toLowerCase()) ||
    f.feedback.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
          setSearch={setSearch}
        />
        <FeedbackTable feedbacks={filteredFeedbacks} />
      </main>
    </div>
  );
} 