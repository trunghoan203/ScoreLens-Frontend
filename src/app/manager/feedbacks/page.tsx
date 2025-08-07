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
import { managerTableService } from '@/lib/managerTableService';
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
  clubInfo?: {
    clubId: string;
    clubName: string;
    address?: string;
  };
  tableInfo?: {
    tableId: string;
    tableName: string;
    tableNumber?: string;
  };
  content: string;
  status: 'pending' | 'managerP' | 'adminP' | 'superadminP' | 'resolved';
  needSupport: boolean;
  note?: string;
  history: Array<{
    byId: string;
    byName: string;
    byRole: string;
    note?: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface TableData {
  tableId?: string;
  id?: string;
  _id?: string;
  name?: string;
  tableNumber?: string;
}

interface TablesResponse {
  tables?: TableData[];
}

export default function FeedbacksPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
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
        
        const tablesData = await managerTableService.getAllTables();
        const tablesArray = Array.isArray(tablesData) ? tablesData : (tablesData as TablesResponse)?.tables || [];

        const mappedFeedbacks: Feedback[] = feedbacksArr.map(f => {
          const obj = f as Partial<Feedback>;
          const tableId = obj.tableId || '';
          
          let table = tablesArray.find((t: TableData) => {
            const tId = t.tableId || t.id || t._id;
            return tId === tableId;
          });
          
          if (!table && tableId) {
            table = tablesArray.find((t: TableData) => {
              const tId = t.tableId || t.id || t._id;
              return tId && (tId.includes(tableId) || tableId.includes(tId));
            });
          }
          
          return {
            feedbackId: obj.feedbackId || obj._id || '',
            createdBy: obj.createdBy || { userId: '', type: 'guest' },
            clubId: obj.clubId || '',
            tableId: tableId,
            clubInfo: obj.clubInfo || { clubId: '', clubName: '' },
            tableInfo: {
              tableId: tableId,
              tableName: table?.name || `${tableId}`, 
              tableNumber: table?.tableNumber
            },
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

  const filteredFeedbacks = feedbacks.filter(f => 
    f.content.toLowerCase().includes(search.toLowerCase()) ||
    (f.tableInfo?.tableName || f.tableId).toLowerCase().includes(search.toLowerCase()) ||
    (f.clubInfo?.clubName || f.clubId).toLowerCase().includes(search.toLowerCase()) ||
    f.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleFeedbackClick = (feedbackId: string) => {
    router.push(`/manager/feedbacks/${feedbackId}`);
  };

  if (isChecking) return null;

  return (
    <>
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen">
          <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${
            isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
          }`}>
            <HeaderManager />
          </div>
          <div className="p-10">
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
                branch: f.clubInfo?.clubName || f.clubId,
                table: f.tableInfo?.tableName || f.tableId,
                time: new Date(f.createdAt).toLocaleString('vi-VN'),
                status: f.status,
                cameraReliability: 85,
                feedback: f.content,
                notes: f.note || '',
              }))}
              onFeedbackClick={handleFeedbackClick}
            />
          )}
          </div>
        </main>
      </div>
    </>
  );
} 