'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { Button } from '@/components/ui/button';

export default function FeedbackDetailPage() {
  const router = useRouter();

  const feedback = {
    id: '1',
    branch: 'Chi nhánh 1',
    table: 'Bàn 1',
    date: '2025-06-10',
    status: 'Chưa xử lý',
    issue: 'Điểm số bị sai trong Pool 8-ball',
    note: 'Chưa Có Ghi Chú',
  };

  const [note, setNote] = useState('');
  const [status, setStatus] = useState(feedback.status);
  const [cameraConfidence, setCameraConfidence] = useState<number | null>(null);
  const [loadingCamera, setLoadingCamera] = useState(true);
  const [errorCamera, setErrorCamera] = useState<string | null>(null);

  useEffect(() => {
    const fetchCameraConfidence = async () => {
      try {
        setLoadingCamera(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const confidence = 92;
        setCameraConfidence(confidence);
      } catch (error) {
        console.error(error);
        setErrorCamera('Không lấy được dữ liệu');
      } finally {
        setLoadingCamera(false);
      }
    };
    fetchCameraConfidence();
  }, []);

  const handleSave = () => {
    console.log('Lưu:', { note, status });
    router.push('/superadmin/home?tab=phanhoi');
  };

  const handleCancel = () => {
    router.push('/superadmin/home?tab=phanhoi');
  };

  return (
    <>
      {/* 1. HeaderAdmin full-width trên cùng */}
      <HeaderAdmin />

      <div className="min-h-screen bg-gray-50">
        {/* 2. Banner */}
        <PageBanner title="ĐÁNH GIÁ" />

        <div className="flex justify-center py-10 px-4">
          <div className="bg-white border border-lime-300 rounded-2xl shadow w-full max-w-md p-6 space-y-6">
            <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800">
              CHI TIẾT PHẢN HỒI
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-900">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Chi nhánh:</span> {feedback.branch}
                </p>
                <p>
                  <span className="font-semibold">Bàn:</span> {feedback.table}
                </p>
                <p>
                  <span className="font-semibold">Ngày:</span> {feedback.date}
                </p>
              </div>
              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Độ tin cậy camera:</span>{' '}
                  {loadingCamera ? (
                    <span className="text-gray-500">Đang tải...</span>
                  ) : errorCamera ? (
                    <span className="text-red-500">{errorCamera}</span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      {cameraConfidence}%
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">Trạng thái:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-lime-400 bg-white text-sm"
                  >
                    <option value="Chưa xử lý">Chưa xử lý</option>
                    <option value="Đã xử lý">Đã xử lý</option>
                  </select>
                </div>

                <p>
                  <span className="font-semibold">Vấn đề:</span> {feedback.issue}
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
      </div>
    </>
  );
}
