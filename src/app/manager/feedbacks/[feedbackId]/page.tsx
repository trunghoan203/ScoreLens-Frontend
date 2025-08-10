"use client";
import React, { useState, useEffect } from 'react';
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import { useRouter, useParams } from "next/navigation";
import toast from 'react-hot-toast';
import { managerFeedbackService } from '@/lib/managerFeedbackService';
import FeedbackDetailLayout from "@/components/shared/FeedbackDetailLayout";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";
import { Badge } from '@/components/ui/badge';

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
    category?: string;
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



export default function FeedbackDetailPage() {
  const router = useRouter();
  const params = useParams();
  const feedbackId = params?.feedbackId as string;

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState<Feedback['status']>('pending');
  const [notes, setNotes] = useState('');
  const [needSupport, setNeedSupport] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackDetailData = await managerFeedbackService.getFeedbackDetail(feedbackId);
        let feedbackObj: Record<string, unknown> | undefined;
        if (feedbackDetailData && typeof feedbackDetailData === 'object') {
          const data = feedbackDetailData as Record<string, unknown>;
          if (data.feedback) {
            feedbackObj = data.feedback as Record<string, unknown>;
          } else if (data.data && typeof data.data === 'object' && (data.data as Record<string, unknown>).feedback) {
            feedbackObj = (data.data as Record<string, unknown>).feedback as Record<string, unknown>;
          } else {
            feedbackObj = data;
          }
        }

        if (feedbackObj) {
          const tableInfo = feedbackObj.tableInfo as Record<string, unknown> | undefined;
          const clubInfo = feedbackObj.clubInfo as Record<string, unknown> | undefined;
          const createdBy = feedbackObj.createdBy as Record<string, unknown> | undefined;
          const history = feedbackObj.history as Array<Record<string, unknown>> | undefined;

          const mappedFeedback: Feedback = {
            feedbackId: String(feedbackObj.feedbackId || feedbackObj._id || ''),
            createdBy: {
              userId: String(createdBy?.userId || ''),
              type: (createdBy?.type as 'guest' | 'membership') || 'guest'
            },
            clubId: String(feedbackObj.clubId || ''),
            tableId: String(feedbackObj.tableId || ''),
            clubInfo: {
              clubId: String(clubInfo?.clubId || ''),
              clubName: String(clubInfo?.clubName || ''),
              address: String(clubInfo?.address || '')
            },
            tableInfo: {
              tableId: String(feedbackObj.tableId || ''),
              tableName: String(tableInfo?.name || 'Không xác định'),
              tableNumber: String(tableInfo?.tableNumber || ''),
              category: String(tableInfo?.category || 'Không xác định')
            },
            content: String(feedbackObj.content || ''),
            status: (feedbackObj.status as Feedback['status']) || 'pending',
            needSupport: Boolean(feedbackObj.needSupport),
            note: String(feedbackObj.note || ''),
            history: (history || []).map(h => ({
              byId: String(h.byId || ''),
              byName: String(h.byName || ''),
              byRole: String(h.byRole || ''),
              note: String(h.note || ''),
              date: h.date ? new Date(h.date as string) : new Date()
            })),
            createdAt: feedbackObj.createdAt ? new Date(feedbackObj.createdAt as string) : new Date(),
            updatedAt: feedbackObj.updatedAt ? new Date(feedbackObj.updatedAt as string) : new Date(),
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
        console.error('Error fetching feedback detail:', error);
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
    { value: 'pending', label: 'Chưa xử lý' },
    { value: 'managerP', label: 'Manager đang xử lý' },
    { value: 'adminP', label: 'Admin đang xử lý' },
    { value: 'superadminP', label: 'Super Admin đang xử lý' },
    { value: 'resolved', label: 'Đã xử lý' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'pending': return 'danger';
      case 'managerP': return 'danger';
      case 'adminP': return 'danger';
      case 'superadminP': return 'danger';
      default: return 'danger';
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
                  <label className="block text-sm font-semibold mb-2 text-black">Loại bàn</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.tableInfo?.category === 'pool-8' ? 'Pool 8' : feedback?.tableInfo?.category === 'carom' ? 'Carom' : feedback?.tableInfo?.category || 'Không xác định'} disabled />
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
                    <Badge
                      variant={getStatusColor(status)}
                      className="text-sm font-semibold flex-shrink-0 whitespace-nowrap"
                    >
                      {getStatusText(status)}
                    </Badge>
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
                    <Badge
                      variant={needSupport ? 'danger' : 'success'}
                      className="text-sm font-semibold flex-shrink-0 whitespace-nowrap"
                    >
                      {needSupport ? 'Cần hỗ trợ' : 'Không cần hỗ trợ'}
                    </Badge>
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
                  <label className="block text-sm font-semibold mb-2 text-black text-center">Lịch sử xử lý</label>
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