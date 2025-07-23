"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddFormLayout from "@/components/shared/AddFormLayout";
import toast from 'react-hot-toast';
import { adminFeedbackService } from '@/lib/adminFeedbackService';

interface Feedback {
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

export default function AdminFeedbackDetailPage() {
  const router = useRouter();
  const params = useParams();
  const feedbackId = params?.feedbackId as string;
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState<Feedback['status']>('pending');
  const [notes, setNotes] = useState('');
  const [needSupport, setNeedSupport] = useState(false);

  useEffect(() => {
    adminFeedbackService.getAllFeedbacks()
      .then((data: unknown) => {
        let feedbacksArr: unknown[] = [];
        if (Array.isArray(data)) feedbacksArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { feedbacks?: unknown[] }).feedbacks)) feedbacksArr = (data as { feedbacks: unknown[] }).feedbacks;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) feedbacksArr = (data as { data: unknown[] }).data;
        const found = feedbacksArr.find((f) => {
          const obj = f as Partial<Feedback>;
          return obj.feedbackId === feedbackId || obj._id === feedbackId;
        });
        if (found) {
          const feedbackData = found as Partial<Feedback>;
          const mappedFeedback: Feedback = {
            feedbackId: feedbackData.feedbackId || feedbackData._id || '',
            createdBy: feedbackData.createdBy || { userId: '', type: 'guest' },
            clubId: feedbackData.clubId || '',
            tableId: feedbackData.tableId || '',
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
          setNotes(mappedFeedback.note || '');
          setNeedSupport(mappedFeedback.needSupport);
        } else {
          toast.error('Không tìm thấy phản hồi');
        }
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu phản hồi');
      });
  }, [feedbackId]);

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'manager_processing', label: 'Manager đang xử lý' },
    { value: 'admin_processing', label: 'Admin đang xử lý' },
    { value: 'superadmin_processing', label: 'Super Admin đang xử lý' },
    { value: 'resolved', label: 'Đã giải quyết' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'manager_processing': return 'bg-blue-500';
      case 'admin_processing': return 'bg-purple-500';
      case 'superadmin_processing': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'manager_processing': return 'Manager đang xử lý';
      case 'admin_processing': return 'Admin đang xử lý';
      case 'superadmin_processing': return 'Super Admin đang xử lý';
      default: return 'Không xác định';
    }
  };

  const handleSave = async () => {
    try {
      await adminFeedbackService.updateFeedback(feedbackId, {
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

  if (!feedback) {
    return (
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderAdminPage />
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              PHẢN HỒI
            </span>
          </div>
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy phản hồi</h1>
            <Button onClick={() => router.push('/admin/feedbacks')} className="bg-lime-400 hover:bg-lime-500">
              Quay lại danh sách
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderAdminPage />
        <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
            PHẢN HỒI
          </span>
        </div>
        <AddFormLayout
          title={isEditMode ? "CHỈNH SỬA PHẢN HỒI" : "CHI TIẾT PHẢN HỒI"}
          onBack={() => router.push('/admin/feedbacks')}
          backLabel="Quay lại"
          submitLabel={isEditMode ? "Lưu" : "Chỉnh sửa"}
          onSubmit={e => {
            e.preventDefault();
            if (isEditMode) {
              handleSave();
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Chi nhánh</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.clubId} disabled />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Bàn</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.tableId} disabled />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Loại người tạo</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.createdBy.type === 'guest' ? 'Khách' : 'Hội viên'} disabled />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Thời gian tạo</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={new Date(feedback.createdAt).toLocaleString('vi-VN')} disabled />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Thời gian cập nhật</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={new Date(feedback.updatedAt).toLocaleString('vi-VN')} disabled />
          </div>
          <div className="w-full mb-6">
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
              <span className={`inline-block px-3 py-1 rounded-full text-base font-semibold text-white ${getStatusColor(status)}`}>
                {getStatusText(status)}
              </span>
            )}
          </div>
          <div className="w-full mb-6">
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
              <span className={`inline-block px-3 py-1 rounded-full text-base font-semibold text-white ${needSupport ? 'bg-red-500' : 'bg-green-500'}`}>
                {needSupport ? 'Cần hỗ trợ' : 'Không cần hỗ trợ'}
              </span>
            )}
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Nội dung phản hồi</label>
            <textarea
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
              value={feedback.content}
              disabled
              rows={4}
            />
          </div>
          <div className="w-full mb-6">
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

          {/* Lịch sử xử lý */}
          {feedback.history && feedback.history.length > 0 && (
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Lịch sử xử lý</label>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {feedback.history.map((item, index) => (
                    <div key={index} className="border-l-4 border-lime-400 pl-4 py-2 bg-white rounded-r-lg">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-800">{item.by}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">{item.role}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Hành động:</span> {item.action}
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
        </AddFormLayout>
      </main>
    </div>
  );
} 