"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import FeedbackSearchBar from "@/components/manager/FeedbackSearchBar";
import FeedbackGrid from "@/components/manager/FeedbackGrid";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';
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

export default function FeedbacksPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("managerP");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

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
          const obj = f as Record<string, unknown>;

          const tableInfo = obj.tableInfo as Record<string, unknown> | undefined;
          const clubInfo = obj.clubInfo as Record<string, unknown> | undefined;

          // Đảm bảo tableName luôn là string
          let tableName = 'Không xác định';
          if (tableInfo?.name) {
            tableName = String(tableInfo.name);
          }

          return {
            id: String(obj.feedbackId || obj._id || ''),
            branch: String(clubInfo?.clubName || 'Không xác định'),
            table: String(tableName),
            time: String(obj.createdAt ? new Date(obj.createdAt as string).toLocaleString('vi-VN') : 'Không xác định'),
            status: (obj.status as Feedback['status']) || 'pending',
            feedback: String(obj.content || ''),
            notes: String(obj.note || ''),
            createdAt: obj.createdAt ? new Date(obj.createdAt as string) : new Date(0),
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleFeedbackClick = (feedbackId: string) => {
    router.push(`/manager/feedbacks/${feedbackId}`);
  };

  if (isChecking) return null;

  return (
    <>
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen">
          <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
            }`}>
            <HeaderManager />
          </div>
          <div className="p-10">
            <FeedbackPageBanner />
            <FeedbackSearchBar
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
            {loading ? (
              <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : filteredFeedbacks.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                title={search || statusFilter !== 'managerP' || dateFilter ? 'Không tìm thấy phản hồi phù hợp' : 'Chưa có phản hồi nào'}
                description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy phản hồi phù hợp"
                secondaryAction={search || statusFilter !== 'managerP' || dateFilter ? {
                  label: 'Xem tất cả',
                  onClick: () => {
                    setSearch('');
                    setStatusFilter('managerP');
                    setDateFilter('');
                  },
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 12h16M4 20h16" />
                    </svg>
                  )
                } : undefined}
                showAdditionalInfo={!(search || statusFilter !== 'managerP' || dateFilter)}
              />
            ) : (
              <FeedbackGrid
                feedbacks={filteredFeedbacks}
                onFeedbackClick={handleFeedbackClick}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
} 