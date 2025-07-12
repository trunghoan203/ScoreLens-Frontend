"use client";
import React, { useState } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import FeedbackSearchBar from "@/components/manager/FeedbackSearchBar";
import FeedbackGrid from "@/components/manager/FeedbackGrid";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";
import { useRouter } from "next/navigation";
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

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
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
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
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderManager />
          <FeedbackPageBanner />
          <FeedbackSearchBar
            search={search}
            setSearch={setSearch}
          />
          {loading ? (
            <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <LoadingSkeleton type="text" lines={2} />
              <div>Không có dữ liệu</div>
            </div>
          ) : (
            <FeedbackGrid
              feedbacks={filteredFeedbacks}
              onFeedbackClick={handleFeedbackClick}
            />
          )}
          <div className="flex justify-end mt-6">
            <button className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2" onClick={() => {}} disabled={false}>
              {'Thêm phản hồi'}
            </button>
          </div>
        </main>
      </div>
    </>
  );
} 