"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from "next/navigation";
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { getFeedbackDetail, updateFeedback } from '@/lib/saFeedbackService';
import toast from 'react-hot-toast';
import FeedbackDetailLayout from "@/components/shared/FeedbackDetailLayout";

interface Feedback {
  _id: string;
  feedbackId: string;
  createdBy: {
    userId: string;
    type: 'guest' | 'membership';
  };
  clubId: string;
  tableId: string;
  content: string;
  status: 'pending' | 'managerP' | 'adminP' | 'superadminP' | 'resolved';
  needSupport: boolean;
  history: Array<{
    byId: string;
    byName: string;
    byRole: string;
    action: string;
    note?: string;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
  clubInfo?: {
    clubName: string;
    address: string;
    phoneNumber: string;
  };
  tableInfo?: {
    name: string;
    category: string;
  };
}

export default function FeedbackDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState<Feedback['status']>('pending');
  const [notes, setNotes] = useState('');
  const [needSupport, setNeedSupport] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getFeedbackDetail(id)
      .then((res) => {
        const data = res.data as { feedback: Feedback };
        setFeedback(data.feedback);
        setStatus(data.feedback.status);
        setNotes(getLatestNote(data.feedback.history) || '');
        setNeedSupport(data.feedback.needSupport || false);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Không tìm thấy feedback');
        setLoading(false);
      });
  }, [id]);

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
      if (!id) return;
      await updateFeedback(id, {
        note: notes,
        status,
        needSupport,
      });
      toast.success('Cập nhật thành công');
      setIsEditMode(false);
      // reload feedback
      getFeedbackDetail(id).then((res) => {
        const data = res.data as { feedback: Feedback };
        setFeedback(data.feedback);
        setStatus(data.feedback.status);
        setNotes(getLatestNote(data.feedback.history) || '');
        setNeedSupport(data.feedback.needSupport || false);
      });
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      setIsEditMode(false);
      if (feedback) {
        setStatus(feedback.status);
        setNotes(getLatestNote(feedback.history) || '');
        setNeedSupport(feedback.needSupport || false);
      }
    } else {
      router.push('/superadmin/home?tab=feedback');
    }
  };
  const getLatestNote = (history: Feedback['history']) => {
    if (!history || history.length === 0) return '';

    const sortedHistory = [...history].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latestItem = sortedHistory.find(item => item.note && item.note.trim() !== '');

    return latestItem?.note || '';
  };

  if (loading) return <div className="p-4 text-center">Đang tải...</div>;
  if (!feedback) return <div className="p-4 text-center text-red-500">Không tìm thấy feedback</div>;

  return (
    <>
      <HeaderAdmin />
      <PageBanner title="PHẢN HỒI" />
      <div className="flex flex-col items-center py-10 px-4 min-h-screen w-full">
        <div className="w-full max-w-none">
          <FeedbackDetailLayout title="QUẢN LÝ PHẢN HỒI">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-1 space-y-6 order-1 md:order-none">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Chi nhánh</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.clubInfo?.clubName || ''} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Bàn</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.tableInfo?.name || ''} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Loại người tạo</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.createdBy?.type === 'guest' ? 'Khách' : 'Hội viên'} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Thời gian tạo</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.createdAt ? new Date(feedback.createdAt).toLocaleString('vi-VN') : ''} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Thời gian cập nhật</label>
                  <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.updatedAt ? new Date(feedback.updatedAt).toLocaleString('vi-VN') : ''} disabled />
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
                    value={feedback.content}
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
                      value={getLatestNote(feedback.history) || ''}
                      disabled
                      rows={3}
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-6 order-2 md:order-none">
                {feedback.history && feedback.history.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-center text-black">Lịch sử xử lý</label>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-[925px] overflow-y-auto">
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
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
              <button
                type="button"
                className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg"
                onClick={handleCancel}
              >
                {isEditMode ? 'Hủy' : 'Quay lại'}
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
      </div>
    </>
  );
}
