"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import FeedbackTable from "@/components/admin/FeedbackTable";
import FeedbackSearchBar from "@/components/admin/FeedbackSearchBar";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useAdminAuthGuard } from '@/lib/hooks/useAdminAuthGuard';
import { adminFeedbackService } from '@/lib/adminFeedbackService';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

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

export default function AdminFeedbacksPage() {
  const { isChecking } = useAdminAuthGuard();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("adminP");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const feedbacksData = await adminFeedbackService.getAllFeedbacks();
        let feedbacksArr: unknown[] = [];
        if (Array.isArray(feedbacksData)) feedbacksArr = feedbacksData;
        else if (feedbacksData && typeof feedbacksData === 'object' && Array.isArray((feedbacksData as { feedbacks?: unknown[] }).feedbacks)) feedbacksArr = (feedbacksData as { feedbacks: unknown[] }).feedbacks;
        else if (feedbacksData && typeof feedbacksData === 'object' && Array.isArray((feedbacksData as { data?: unknown[] }).data)) feedbacksArr = (feedbacksData as { data: unknown[] }).data;

        const mappedFeedbacks: Feedback[] = feedbacksArr.map(f => {
          const obj = f as Record<string, unknown>;

          const tableInfo = obj.tableInfo as Record<string, unknown> | undefined;
          const clubInfo = obj.clubInfo as Record<string, unknown> | undefined;

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

    if (!isChecking) {
      fetchData();
    }
  }, [isChecking]);

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

  const totalPages = Math.ceil(filteredFeedbacks.length / itemPage);
  const startIndex = (currentPage - 1) * itemPage;
  const endIndex = startIndex + itemPage;
  const currentFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, dateFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isChecking) return null;

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen">
          <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
            }`}>
            <HeaderAdminPage />
          </div>
          <div className="px-10 pb-10">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
              <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
                PHẢN HỒI
              </span>
            </div>

            <FeedbackSearchBar
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
            {loading ? (
              <div className="py-8">
                <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : filteredFeedbacks.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                title={search || statusFilter !== 'adminP' || dateFilter ? 'Không tìm thấy phản hồi phù hợp' : 'Chưa có phản hồi nào'}
                description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy phản hồi phù hợp"
                secondaryAction={search || statusFilter !== 'adminP' || dateFilter ? {
                  label: 'Xem tất cả',
                  onClick: () => {
                    setSearch('');
                    setStatusFilter('adminP');
                    setDateFilter('');
                  },
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 12h16M4 20h16" />
                    </svg>
                  )
                } : undefined}
                showAdditionalInfo={!(search || statusFilter !== 'adminP' || dateFilter)}
              />
            ) : (
              <>
                <FeedbackTable
                  feedbacks={currentFeedbacks}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-3 w-16 rounded-lg font-medium transition flex items-center justify-center ${currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-lime-400 hover:bg-lime-500 text-white'
                        }`}
                    >
                      <Image
                        src="/icon/chevron-left.svg"
                        alt="Previous"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 w-10 rounded-lg font-medium transition flex items-center justify-center ${currentPage === page
                          ? 'bg-lime-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-3 w-16 rounded-lg font-medium transition flex items-center justify-center ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-lime-400 hover:bg-lime-500 text-white'
                        }`}
                    >
                      <Image
                        src="/icon/chevron-right.svg"
                        alt="Next"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center text-gray-400 italic text-xs">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredFeedbacks.length)} trong tổng số {filteredFeedbacks.length} phản hồi
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 