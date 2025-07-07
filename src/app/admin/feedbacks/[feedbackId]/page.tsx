"use client";
import React from 'react';
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddFormLayout from "@/components/shared/AddFormLayout";
import toast from 'react-hot-toast';

// Dữ liệu mẫu cho phản hồi chi tiết
const feedbacksData = [
  { 
    id: '1', 
    branch: 'Chi nhánh 1', 
    table: 'Bàn 01', 
    time: '15:30 20/12/2024', 
    status: 'pending' as const, 
    cameraReliability: 85, 
    feedback: 'Camera không hoạt động tốt, cần kiểm tra lại. Hệ thống ghi điểm có vấn đề khi nhận diện bóng. Khách hàng phàn nàn về độ chính xác của hệ thống.',
    notes: 'Đã báo cáo cho kỹ thuật viên. Cần kiểm tra lại camera và cập nhật phần mềm nhận diện. Dự kiến hoàn thành trong 2-3 ngày.' 
  },
  { 
    id: '2', 
    branch: 'Chi nhánh 2', 
    table: 'Bàn 03', 
    time: '14:15 20/12/2024', 
    status: 'resolved' as const, 
    cameraReliability: 95, 
    feedback: 'Hệ thống hoạt động tốt, không có vấn đề gì. Khách hàng rất hài lòng với chất lượng dịch vụ.',
    notes: 'Khách hàng hài lòng. Hệ thống hoạt động ổn định.' 
  },
  { 
    id: '3', 
    branch: 'Chi nhánh 1', 
    table: 'Bàn 05', 
    time: '16:45 20/12/2024', 
    status: 'in_progress' as const, 
    cameraReliability: 70, 
    feedback: 'Có vấn đề với việc ghi điểm, cần khắc phục. Hệ thống thường xuyên ghi sai điểm hoặc không ghi điểm.',
    notes: 'Đang xử lý bởi đội kỹ thuật. Đã thay thế camera mới và đang test lại hệ thống.' 
  },
  { 
    id: '4', 
    branch: 'Chi nhánh 3', 
    table: 'Bàn 02', 
    time: '13:20 20/12/2024', 
    status: 'resolved' as const, 
    cameraReliability: 90, 
    feedback: 'Cải thiện tốt, hệ thống hoạt động ổn định. Khách hàng đánh giá cao chất lượng dịch vụ.',
    notes: 'Khách hàng phản hồi tích cực. Hệ thống đã được tối ưu hóa.' 
  },
];

export default function AdminFeedbackDetailPage() {
  const router = useRouter();
  const params = useParams();
  const feedbackId = params?.feedbackId as string;
  const feedback = feedbacksData.find(f => f.id === feedbackId);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [status, setStatus] = React.useState(feedback?.status || "pending");
  const [notes, setNotes] = React.useState(feedback?.notes || "");

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'resolved', label: 'Đã giải quyết' },
    { value: 'in_progress', label: 'Đang xử lý' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'in_progress': return 'Đang xử lý';
      default: return 'Không xác định';
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
              // Lưu trạng thái và ghi chú
              toast.success('Đã lưu phản hồi thành công!');
              setIsEditMode(false);
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Chi nhánh</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.branch} disabled />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Bàn</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.table} disabled />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Thời gian</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.time} disabled />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Độ tin cậy camera</label>
            <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback.cameraReliability + '%'} disabled />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Trạng thái</label>
            {isEditMode ? (
              <select
                className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                value={status}
                onChange={e => setStatus(e.target.value as 'pending' | 'resolved' | 'in_progress')}
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
            <label className="block text-sm font-semibold mb-2 text-black">Nội dung phản hồi</label>
            <textarea
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
              value={feedback.feedback}
              disabled
              rows={3}
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
        </AddFormLayout>
      </main>
    </div>
  );
} 