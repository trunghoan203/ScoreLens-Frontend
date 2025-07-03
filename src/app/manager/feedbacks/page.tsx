"use client";
import React, { useState } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import FeedbackSearchBar from "@/components/manager/FeedbackSearchBar";
import FeedbackGrid from "@/components/manager/FeedbackGrid";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";
import { useRouter } from "next/navigation";

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
];

export default function FeedbacksPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const filteredFeedbacks = feedbacksData.filter(f => 
    f.branch.toLowerCase().includes(search.toLowerCase()) ||
    f.table.toLowerCase().includes(search.toLowerCase()) ||
    f.feedback.toLowerCase().includes(search.toLowerCase())
  );

  const handleFeedbackClick = (feedbackId: string) => {
    // Logic xử lý khi click vào phản hồi
    router.push(`/manager/feedbacks/${feedbackId}`);
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderManager />
        <FeedbackPageBanner />
        <FeedbackSearchBar
          search={search}
          setSearch={setSearch}
        />
        <FeedbackGrid
          feedbacks={filteredFeedbacks}
          onFeedbackClick={handleFeedbackClick}
        />
      </main>
    </div>
  );
} 