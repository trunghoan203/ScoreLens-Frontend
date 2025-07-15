'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getAdminDetail, approveAdmin, rejectAdmin } from '@/lib/superAdminService';

export default function AdminDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDetail(id as string)
      .then((res) => {
        const data = res.data as { admin: any };
        setAdmin(data.admin);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Không tìm thấy admin');
        setLoading(false);
      });
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveAdmin(id as string);
      toast.success('Admin đã được duyệt.');
      router.push('/superadmin/home?tab=approval');
    } catch {
      toast.error('Duyệt thất bại');
    }
  };

  const handleReject = async () => {
    try {
      await rejectAdmin(id as string);
      toast.success('Admin đã bị từ chối.');
      router.push('/superadmin/home?tab=approval');
    } catch {
      toast.error('Từ chối thất bại');
    }
  };

  if (loading) return <div className="p-4 text-center">Đang tải...</div>;
  if (!admin) return <div className="p-4 text-center text-red-500">Không tìm thấy admin với ID: {id}</div>;

  return (
    <>
      <HeaderAdmin />
      <PageBanner title="ADMIN" />
      <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-black">
            THÔNG TIN CHI TIẾT
          </h2>
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex justify-center">
              <div className="w-60 h-72 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                Hình ảnh giải đấu
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Tên Quán</label>
                <Input value={admin.clubName || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Họ và Tên</label>
                <Input value={admin.fullName || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">CCCD</label>
                <Input value={admin.citizenCode || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Số Điện Thoại</label>
                <Input value={admin.phoneNumber || ''} disabled />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Email</label>
                <Input value={admin.email || ''} disabled />
              </div>
            </div>
          </div>
          {/* Nút Hành Động */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div />
            <div className="md:col-span-2 flex justify-center gap-4">
              <Button
                variant="destructive"
                className="px-8 py-3 text-base font-semibold rounded-xl"
                onClick={handleReject}
              >
                TỪ CHỐI
              </Button>
              <Button
                variant="lime"
                className="px-8 py-3 text-base font-semibold rounded-xl"
                onClick={handleApprove}
              >
                DUYỆT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}