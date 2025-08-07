"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import FeedbackTable from "@/components/admin/FeedbackTable";
import FeedbackSearchBar from "@/components/admin/FeedbackSearchBar";
import { TableSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { adminFeedbackService } from '@/lib/adminFeedbackService';
import toast from 'react-hot-toast';
import { useAdminAuthGuard } from '@/lib/hooks/useAdminAuthGuard';

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

export default function AdminFeedbacksPage() {
  const { isChecking } = useAdminAuthGuard();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    if (isChecking) return;
    setLoading(true);
    adminFeedbackService.getAllFeedbacks()
      .then((data: unknown) => {
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
  }, [isChecking]);

  const filteredFeedbacks = feedbacks.filter(f => 
    f.clubId.toLowerCase().includes(search.toLowerCase()) ||
    f.tableId.toLowerCase().includes(search.toLowerCase()) ||
    f.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 900);
  };

  if (isChecking) return null;

  return (
    <>
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderAdminPage />
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              PHẢN HỒI
            </span>
          </div>
          <FeedbackSearchBar
            search={search}
            setSearch={handleSearch}
          />
          {loading ? (
            <div className="mt-6"><TableSkeleton rows={5} /></div>
          ) : tableLoading ? (
            <div className="mt-6"><TableSkeleton rows={5} /></div>
          ) : error ? (
            <div className="mt-6 text-center text-red-500">{error}</div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="mt-6"><LoadingSkeleton type="card" lines={1} className="w-full max-w-md mx-auto" />
              <div className="text-center text-gray-500 mt-4">Không tìm thấy phản hồi nào</div>
            </div>
          ) : (
            <FeedbackTable feedbacks={filteredFeedbacks.map(f => ({
              id: f.feedbackId,
              branch: f.clubId,
              table: f.tableId,
              time: new Date(f.createdAt).toLocaleString('vi-VN'),
              status: f.status,
              cameraReliability: 85, // Mock data
              feedback: f.content,
              notes: f.note || '',
            }))} />
          )}
        </main>
      </div>
    </>
  );
} 