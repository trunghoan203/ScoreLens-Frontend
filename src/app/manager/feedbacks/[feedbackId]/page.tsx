"use client";
import React, { useState, useEffect } from 'react';
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import { useRouter, useParams } from "next/navigation";
import toast from 'react-hot-toast';
import { managerFeedbackService } from '@/lib/managerFeedbackService';
import { managerTableService } from '@/lib/managerTableService';
import FeedbackDetailLayout from "@/components/shared/FeedbackDetailLayout";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";

interface Feedback {
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

export default function FeedbackDetailPage() {
  const router = useRouter();
  const params = useParams();
  const feedbackId = params?.feedbackId as string;

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [, setTables] = useState<unknown[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState<Feedback['status']>('pending');
  const [notes, setNotes] = useState('');
  const [needSupport, setNeedSupport] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tablesData = await managerTableService.getAllTables();
        const tablesArray = Array.isArray(tablesData) ? tablesData : (tablesData as TablesResponse)?.tables || [];
        setTables(tablesArray);

        const feedbacksData = await managerFeedbackService.getAllFeedbacks();
        let feedbacksArr: unknown[] = [];
        if (Array.isArray(feedbacksData)) feedbacksArr = feedbacksData;
        else if (feedbacksData && typeof feedbacksData === 'object' && Array.isArray((feedbacksData as { feedbacks?: unknown[] }).feedbacks)) feedbacksArr = (feedbacksData as { feedbacks: unknown[] }).feedbacks;
        else if (feedbacksData && typeof feedbacksData === 'object' && Array.isArray((feedbacksData as { data?: unknown[] }).data)) feedbacksArr = (feedbacksData as { data: unknown[] }).data;

        const found = feedbacksArr.find((f) => {
          const obj = f as Partial<Feedback>;
          return obj.feedbackId === feedbackId || obj._id === feedbackId;
        });

        if (found) {
          const feedbackData = found as Partial<Feedback>;
          const tableId = feedbackData.tableId || '';

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

          const mappedFeedback: Feedback = {
            feedbackId: feedbackData.feedbackId || feedbackData._id || '',
            createdBy: feedbackData.createdBy || { userId: '', type: 'guest' },
            clubId: feedbackData.clubId || '',
            tableId: tableId,
            clubInfo: feedbackData.clubInfo || { clubId: '', clubName: '' },
            tableInfo: {
              tableId: tableId,
              tableName: table?.name || `Bàn ${tableId}`,
              tableNumber: table?.tableNumber
            },
            content: feedbackData.content || '',
            status: feedbackData.status || 'pending',
            needSupport: feedbackData.needSupport || false,
            note: feedbackData.note || '',
            history: feedbackData.history || [],
            createdAt: feedbackData.createdAt || new Date(),
            updatedAt: feedbackData.updatedAt || new Date(),
          };
          setFeedback(mappedFeedback);
          setStatus(mappedFeedback.status);
          let latestNote = '';
          if (mappedFeedback.history && mappedFeedback.history.length > 0) {
            const sortedHistory = [...mappedFeedback.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            latestNote = sortedHistory.find(h => h.note && h.note.trim() !== '')?.note || '';
          }
          setNotes(latestNote || mappedFeedback.note || '');
          setNeedSupport(mappedFeedback.needSupport);
        } else {
          toast.error('Không tìm thấy phản hồi');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu phản hồi');
      }
    };

    fetchData();
  }, [feedbackId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'managerP', label: 'Manager đang xử lý' },
    { value: 'adminP', label: 'Admin đang xử lý' },
    { value: 'superadminP', label: 'Super Admin đang xử lý' },
    { value: 'resolved', label: 'Đã giải quyết' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'managerP': return 'bg-blue-500';
      case 'adminP': return 'bg-purple-500';
      case 'superadminP': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'managerP': return 'Manager đang xử lý';
      case 'adminP': return 'Admin đang xử lý';
      case 'superadminP': return 'Super Admin đang xử lý';
      default: return 'Không xác định';
    }
  };

  const handleSave = async () => {
    try {
      await managerFeedbackService.updateFeedback(feedbackId, {
        note: notes,
        status,
        needSupport,
      });
      toast.success('Đã lưu phản hồi thành công!');
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error('Lưu phản hồi thất bại.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white min-h-screen">
        <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
          }`}>
          <HeaderManager />
        </div>
        <div className="p-10">
          <FeedbackPageBanner />
          <FeedbackDetailLayout title="QUẢN LÝ PHẢN HỒI">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6 order-1 md:order-none">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Chi nhánh</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.clubInfo?.clubName || feedback?.clubId || ''} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Bàn</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.tableInfo?.tableName || feedback?.tableId || ''} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Loại người tạo</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.createdBy?.type === 'guest' ? 'Khách' : (feedback?.createdBy?.type === 'membership' ? 'Hội viên' : '')} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Thời gian tạo</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.createdAt ? new Date(feedback.createdAt).toLocaleString('vi-VN') : ''} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Thời gian cập nhật</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.updatedAt ? new Date(feedback.updatedAt).toLocaleString('vi-VN') : ''} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Trạng thái</label>
                  {isEditMode ? (
                    <select
                      className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                      value={status}
                      onChange={e => setStatus(e.target.value as Feedback['status'])}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-block px-4 py-2 rounded-full text-base font-semibold text-white ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Cần hỗ trợ</label>
                  {isEditMode ? (
                    <select
                      className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                      value={needSupport ? 'true' : 'false'}
                      onChange={e => setNeedSupport(e.target.value === 'true')}
                    >
                      <option value="false">Không</option>
                      <option value="true">Có</option>
                    </select>
                  ) : (
                    <span className={`inline-block px-4 py-2 rounded-full text-base font-semibold text-white ${needSupport ? 'bg-red-500' : 'bg-green-500'}`}>
                      {needSupport ? 'Cần hỗ trợ' : 'Không cần hỗ trợ'}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Nội dung phản hồi</label>
                  <textarea
                    className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                    value={feedback?.content || ''}
                    disabled
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Ghi chú xử lý</label>
                  {isEditMode ? (
                    <textarea
                      className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Nhập ghi chú xử lý..."
                    />
                  ) : (
                    <textarea
                      className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                      value={notes}
                      disabled
                      rows={3}
                    />
                  )}
                </div>
              </div>
                             <div className="flex-1 space-y-6 order-2 md:order-none">
                 <div>
                   <label className="block text-sm font-semibold mb-2 text-black">Lịch sử xử lý</label>
                   <div className="bg-gray-50 rounded-lg p-4 max-h-[925px] overflow-y-auto">
                     {feedback?.history && feedback.history.length > 0 ? (
                       <div className="space-y-3">
                         {feedback.history
                           .slice()
                           .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                           .slice(0, 15)
                           .map((item, index) => (
                             <div key={index} className="border-l-4 border-lime-400 pl-4 py-2 bg-white rounded-r-lg">
                               <div className="flex justify-between items-start mb-1">
                                 <div className="flex items-center gap-2">
                                   <span className="font-semibold text-sm text-gray-800">{item.byName}</span>
                                   <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">{item.byRole}</span>
                                 </div>
                                 <span className="text-xs text-gray-500">
                                   {item.date ? new Date(item.date).toLocaleString('vi-VN') : ''}
                                 </span>
                               </div>
                               {item.note && (
                                 <div className="text-sm text-gray-600">
                                   <span className="font-medium">Ghi chú:</span> {item.note}
                                 </div>
                               )}
                             </div>
                           ))}
                       </div>
                     ) : (
                       <div className="text-center py-8">
                         <div className="text-gray-400 mb-2">
                           <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                         </div>
                         <p className="text-gray-500 text-sm font-medium">Chưa có lịch sử xử lý</p>
                         <p className="text-gray-400 text-xs mt-1">Lịch sử xử lý sẽ hiển thị khi có người cập nhật phản hồi</p>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
              <button
                type="button"
                className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg"
                onClick={() => router.push('/manager/feedbacks')}
              >
                Quay lại
              </button>
              {isEditMode ? (
                <button
                  type="button"
                  className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              ) : (
                <button
                  type="button"
                  className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg"
                  onClick={() => setIsEditMode(true)}
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </FeedbackDetailLayout>
        </div>
      </main>
    </div>
  );
} 