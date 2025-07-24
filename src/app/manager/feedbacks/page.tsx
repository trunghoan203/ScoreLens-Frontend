"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import FeedbackSearchBar from "@/components/manager/FeedbackSearchBar";
import FeedbackGrid from "@/components/manager/FeedbackGrid";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { managerFeedbackService } from '@/lib/managerFeedbackService';
import toast from 'react-hot-toast';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';

export interface Feedback {
  feedbackId: string;
  _id?: string;
  createdBy: {
    userId: string;
    type: 'guest' | 'membership';
  };
  clubId: string;
  tableId: string;
  content: string;
  status: 'pending' | 'manager_processing' | 'admin_processing' | 'superadmin_processing' | 'resolved';
  needSupport: boolean;
  note?: string;
  history: Array<{
    by: string;
    role: string;
    action: string;
    note?: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export default function FeedbacksPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    managerFeedbackService.getAllFeedbacks()
      .then((data: unknown) => {
        console.log('DATA FROM API:', data); // DEBUG LOG
        let feedbacksArr: unknown[] = [];
        if (Array.isArray(data)) feedbacksArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { feedbacks?: unknown[] }).feedbacks)) feedbacksArr = (data as { feedbacks: unknown[] }).feedbacks;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) feedbacksArr = (data as { data: unknown[] }).data;
        const mappedFeedbacks: Feedback[] = feedbacksArr.map(f => {
          const obj = f as Partial<Feedback>;
          return {
            feedbackId: obj.feedbackId || obj._id || '',
            createdBy: obj.createdBy || { userId: '', type: 'guest' },
            clubId: obj.clubId || '',
            tableId: obj.tableId || '',
            content: obj.content || '',
            status: obj.status || 'pending',
            needSupport: obj.needSupport || false,
            note: obj.note || '',
            history: obj.history || [],
            createdAt: obj.createdAt || new Date(),
            updatedAt: obj.updatedAt || new Date(),
          };
        });
        setFeedbacks(mappedFeedbacks);
      })
      .catch(() => {
        setError('Không thể tải danh sách phản hồi');
        toast.error('Không thể tải danh sách phản hồi');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredFeedbacks = feedbacks.filter(f => 
    f.content.toLowerCase().includes(search.toLowerCase()) ||
    f.tableId.toLowerCase().includes(search.toLowerCase()) ||
    f.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleFeedbackClick = (feedbackId: string) => {
    router.push(`/manager/feedbacks/${feedbackId}`);
  };

  if (isChecking) return null;

  return (
    <>
      {/* Đã loại bỏ ScoreLensLoading toàn trang để tránh loading dư thừa */}
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
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <LoadingSkeleton type="text" lines={2} />
              <div>Không có dữ liệu</div>
            </div>
          ) : (
            <FeedbackGrid
              feedbacks={filteredFeedbacks.map(f => ({
                id: f.feedbackId,
                branch: f.clubId,
                table: f.tableId,
                time: new Date(f.createdAt).toLocaleString('vi-VN'),
                status: f.status,
                cameraReliability: 85, // Mock data
                feedback: f.content,
                notes: f.note || '',
              }))}
              onFeedbackClick={handleFeedbackClick}
            />
          )}
        </main>
      </div>
    </>
  );
} 