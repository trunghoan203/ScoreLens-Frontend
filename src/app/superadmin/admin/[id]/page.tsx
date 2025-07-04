'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageBanner } from '@/components/shared/PageBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const allAdmins = [
  { id: '1', name: 'Nguyễn Văn A', email: 'a@gmail.com', location: 'Hà Nội', status: 'Đã duyệt' },
  { id: '2', name: 'Nguyễn Văn B', email: 'b@gmail.com', location: 'HCM', status: 'Chưa duyệt' },
  { id: '3', name: 'Nguyễn Văn C', email: 'c@gmail.com', location: 'Đà Nẵng', status: 'Bị từ chối' },
  { id: '4', name: 'Nguyễn Văn D', email: 'd@gmail.com', location: 'Quy Nhơn', status: 'Đã duyệt' },
];

export default function AdminDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const admin = allAdmins.find((a) => a.id === params.id);

  if (!admin) {
    return (
      <div className="p-4 text-center text-red-500">
        Không tìm thấy admin với ID: {params.id}
      </div>
    );
  }

  const handleApprove = () => {
    // Gửi API duyệt nếu cần
    toast.success('Admin đã được duyệt.');
    router.push('/superadmin/home');
  };

  const handleReject = () => {
    // Gửi API từ chối nếu cần
    toast.error('Admin đã bị từ chối.');
    router.push('/superadmin/home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner title="ADMIN" />
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-black">THÔNG TIN CHI TIẾT</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hình ảnh giải đấu */}
          <div className="flex justify-center">
            <div className="w-60 h-72 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
              Hình ảnh giải đấu
            </div>
          </div>

          {/* Form thông tin */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">Tên Quán</label>
              <Input value="Quán Cỏ 4 Cây Me" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Họ và Tên</label>
              <Input value={admin.name} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">CCCD</label>
              <Input value="052320002659" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Số Điện Thoại</label>
              <Input value="0395109790" disabled />
            </div>

            {/* Chi nhánh 1 */}
            <div>
              <label className="block text-sm font-medium text-black">Chi Nhánh</label>
              <Input value="Sài Gòn" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Địa Chỉ</label>
              <Input value="100 Trần Hưng Đạo, Phú Nhuận, TP HCM" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Số Bàn</label>
              <Input value="10" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Số Lượng Camera</label>
              <Input value="10" disabled />
            </div>

            {/* Chi nhánh 2 */}
            <div>
              <label className="block text-sm font-medium text-black">Chi Nhánh</label>
              <Input value="Quy Nhơn" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Địa Chỉ</label>
              <Input value="190 Nguyễn Huệ, TP Quy Nhơn" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Số Bàn</label>
              <Input value="10" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Số Lượng Camera</label>
              <Input value="8" disabled />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="destructive"
            className="px-8 py-3 text-base font-semibold"
            onClick={handleReject}
          >
            TỪ CHỐI
          </Button>
          <Button
            variant="lime"
            className="px-8 py-3 text-base font-semibold"
            onClick={handleApprove}
          >
            DUYỆT
          </Button>
        </div>
      </div>
    </div>
  );
}
