"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import FeedbackSearchBar from "@/components/manager/FeedbackSearchBar";
import FeedbackGrid from "@/components/manager/FeedbackGrid";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import EmptyState from '@/components/ui/EmptyState';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';
import { managerFeedbackService } from '@/lib/managerFeedbackService';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface Feedback {
  id: string;
  branch: string;
  table: string;
  time: string;
  status: 'managerP' | 'adminP' | 'resolved';
  feedback: string;
  notes: string;
  createdAt: Date;
}

export default function FeedbacksPage() {
  const { t } = useI18n();
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPage = 10;
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

          let tableName = t('common.unknown');
          if (tableInfo?.name) {
            tableName = String(tableInfo.name);
          }

          return {
            id: String(obj.feedbackId || obj._id || ''),
            branch: String(clubInfo?.clubName || t('common.unknown')),
            table: String(tableName),
            time: String(obj.createdAt ? new Date(obj.createdAt as string).toLocaleString('vi-VN') : t('common.unknown')),
            status: (obj.status as Feedback['status']) || 'managerP',
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
        setError(t('feedbacks.cannotLoadFeedbacks'));
        toast.error(t('feedbacks.cannotLoadFeedbacks'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFeedbacks = feedbacks.filter(f => {
    const branch = (f.branch || '').toString().toLowerCase();
    const table = (f.table || '').toString().toLowerCase();
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch = searchTerm === '' ||
      branch.includes(searchTerm) ||
      table.includes(searchTerm);

    let matchesStatus = false;
    if (statusFilter === 'all') {
      matchesStatus = f.status === 'adminP' || f.status === 'managerP' || f.status === 'resolved';
    } else if (statusFilter === 'pending') {
      matchesStatus = f.status === 'managerP';
    } else if (statusFilter === 'resolved') {
      matchesStatus = f.status === 'resolved';
    } else {
      matchesStatus = f.status === statusFilter;
    }

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

  const handleFeedbackClick = (feedbackId: string) => {
    router.push(`/manager/feedbacks/${feedbackId}`);
  };

  if (isChecking) return null;

  return (
    <>
      {loading && <ScoreLensLoading text={t('feedbacks.loading')} />}
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen lg:ml-0">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
            <HeaderManager />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
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
              <div className="py-8">
                <LoadingSkeleton type="card" lines={3} className="w-full max-w-2xl mx-auto" />
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
                title={search || statusFilter !== 'pending' || dateFilter ? t('feedbacks.noSearchResults') : t('feedbacks.noFeedbacks')}
                description={t('feedbacks.tryDifferentFilters')}
                secondaryAction={search || statusFilter !== 'pending' || dateFilter ? {
                  label: t('feedbacks.viewAll'),
                  onClick: () => {
                    setSearch('');
                    setStatusFilter('all');
                    setDateFilter('');
                  },
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 12h16M4 20h16" />
                    </svg>
                  )
                } : undefined}
                showAdditionalInfo={!(search || statusFilter !== 'pending' || dateFilter)}
              />
            ) : (
              <>
                <FeedbackGrid
                  feedbacks={currentFeedbacks}
                  onFeedbackClick={handleFeedbackClick}
                />

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-10 flex items-center justify-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-2 sm:px-3 py-2 sm:py-3 w-12 sm:w-16 rounded-lg font-medium transition flex items-center justify-center text-xs sm:text-sm ${currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-lime-400 hover:bg-lime-500 text-white'
                        }`}
                    >
                      <Image
                        src="/icon/chevron-left.svg"
                        alt="Previous"
                        width={20}
                        height={20}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 sm:px-3 py-2 w-8 sm:w-10 rounded-lg font-medium transition flex items-center justify-center text-xs sm:text-sm ${currentPage === page
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
                      className={`px-2 sm:px-3 py-2 sm:py-3 w-12 sm:w-16 rounded-lg font-medium transition flex items-center justify-center text-xs sm:text-sm ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-lime-400 hover:bg-lime-500 text-white'
                        }`}
                    >
                      <Image
                        src="/icon/chevron-right.svg"
                        alt="Next"
                        width={20}
                        height={20}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center text-gray-400 italic text-xs">
                  {t('feedbacks.showingResults')
                    .replace('{start}', String(startIndex + 1))
                    .replace('{end}', String(Math.min(endIndex, filteredFeedbacks.length)))
                    .replace('{total}', String(filteredFeedbacks.length))
                  }
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 