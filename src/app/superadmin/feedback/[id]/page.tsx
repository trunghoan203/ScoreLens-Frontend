'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { Button } from '@/components/ui/button';
import { getFeedbackDetail, updateFeedback } from '@/lib/superAdminService';
import toast from 'react-hot-toast';

interface Feedback {
  id: string;
  content: string;
  note?: string;
  status: 'resolved' | 'pending';
  needSupport?: boolean;
  createdBy?: {
    clubId: string;
    tableId: string;
  };
  history?: {
    createdAt: string;
  }[];
}

export default function FeedbackDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('Chưa xử lý');
  const [needSupport, setNeedSupport] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getFeedbackDetail(id)
      .then((res) => {
        const data = res.data as { feedback: Feedback };
        setFeedback(data.feedback);
        setNote(data.feedback.note || '');
        setStatus(data.feedback.status === 'resolved' ? 'Đã xử lý' : 'Chưa xử lý');
        setNeedSupport(data.feedback.needSupport || false);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Không tìm thấy feedback');
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    try {
      if (!id) return;
      await updateFeedback(id, {
        note,
        status: status === 'Đã xử lý' ? 'resolved' : 'pending',
        needSupport,
      });
      toast.success('Cập nhật thành công');
      router.push('/superadmin/home?tab=feedback');
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const handleCancel = () => {
    router.push('/superadmin/home?tab=feedback');
  };

  if (loading) return <div className="p-4 text-center">Đang tải...</div>;
  if (!feedback) return <div className="p-4 text-center text-red-500">Không tìm thấy feedback</div>;

  return (
    <>
      <HeaderAdmin />
      <PageBanner title="ĐÁNH GIÁ" />
      <div className="flex justify-center py-10 px-4">
        <div className="bg-white border border-lime-300 rounded-2xl shadow w-full max-w-md p-6 space-y-6">
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800">
            CHI TIẾT PHẢN HỒI
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-900">
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Chi nhánh:</span> {feedback.createdBy?.clubId}
              </p>
              <p>
                <span className="font-semibold">Bàn:</span> {feedback.createdBy?.tableId}
              </p>
              <p>
                <span className="font-semibold">Ngày:</span> {feedback.history?.[0]?.createdAt?.slice(0, 10)}
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Trạng thái:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-lime-400 bg-white text-sm"
                >
                  <option value="Chưa xử lý">Chưa xử lý</option>
                  <option value="Đã xử lý">Đã xử lý</option>
                </select>
              </p>
              <p>
                <span className="font-semibold">Cần hỗ trợ:</span>
                <input
                  type="checkbox"
                  checked={needSupport}
                  onChange={(e) => setNeedSupport(e.target.checked)}
                  className="ml-2"
                />
              </p>
              <p>
                <span className="font-semibold">Vấn đề:</span> {feedback.content}
              </p>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Ghi chú:
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
            />
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={handleCancel}
              className="bg-lime-100 text-lime-700 hover:bg-lime-200 font-semibold px-6 py-2 rounded-full shadow transition"
            >
              Đóng
            </Button>
            <Button
              onClick={handleSave}
              className="bg-lime-500 text-white hover:bg-lime-600 font-semibold px-6 py-2 rounded-full shadow transition"
            >
              Lưu
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}