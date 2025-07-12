'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Branch {
  name: string;
  address: string;
  tableCount: string;
  cameraCount: string;
}

type AdminStatus = 'Đã duyệt' | 'Chưa duyệt' | 'Bị từ chối';

interface Admin {
  id: string;
  name: string;
  cccd: string;
  phone: string;
  email: string;
  status: AdminStatus;
  branches?: Branch[];
}

const allAdmins: Admin[] = [
  {
    id: '1',
    name: 'Võ Nguyễn Kim Ngân',
    cccd: '052320002659',
    phone: '0395109790',
    email: 'nv20181@gmail.com',
    status: 'Đã duyệt',
    branches: [
      { name: 'Chi nhánh 1', address: '100 Trần Hưng Đạo, Phú Nhuận, TP HCM', tableCount: '10', cameraCount: '10' },
      { name: 'Chi nhánh 2', address: '190 Nguyễn Huệ, TP Quy Nhơn', tableCount: '10', cameraCount: '8' },
    ],
  },
  {
    id: '2',
    name: 'Võ Nguyễn Kim Ngân',
    cccd: '052320002659',
    phone: '0395109790',
    email: 'nv20181@gmail.com',
    status: 'Đã duyệt',
    branches: [
      { name: 'Chi nhánh 1', address: '100 Trần Hưng Đạo, Phú Nhuận, TP HCM', tableCount: '10', cameraCount: '10' },
      { name: 'Chi nhánh 2', address: '190 Nguyễn Huệ, TP Quy Nhơn', tableCount: '10', cameraCount: '8' },
    ],
  },
  {
    id: '3',
    name: 'Võ Nguyễn Kim Ngân',
    cccd: '052320002659',
    phone: '0395109790',
    email: 'nv20181@gmail.com',
    status: 'Đã duyệt',
    branches: [
      { name: 'Chi nhánh 1', address: '100 Trần Hưng Đạo, Phú Nhuận, TP HCM', tableCount: '10', cameraCount: '10' },
      { name: 'Chi nhánh 2', address: '190 Nguyễn Huệ, TP Quy Nhơn', tableCount: '10', cameraCount: '8' },
    ],
  },
  {
    id: '4',
    name: 'Võ Nguyễn Kim Ngân',
    cccd: '052320002659',
    phone: '0395109790',
    email: 'nv20181@gmail.com',
    status: 'Đã duyệt',
    branches: [
      { name: 'Chi nhánh 1', address: '100 Trần Hưng Đạo, Phú Nhuận, TP HCM', tableCount: '10', cameraCount: '10' },
      { name: 'Chi nhánh 2', address: '190 Nguyễn Huệ, TP Quy Nhơn', tableCount: '10', cameraCount: '8' },
    ],
  },
  {
    id: '5',
    name: 'Võ Nguyễn Kim Ngân',
    cccd: '052320002659',
    phone: '0395109790',
    email: 'nv20181@gmail.com',
    status: 'Đã duyệt',
    branches: [
      { name: 'Chi nhánh 1', address: '100 Trần Hưng Đạo, Phú Nhuận, TP HCM', tableCount: '10', cameraCount: '10' },
      { name: 'Chi nhánh 2', address: '190 Nguyễn Huệ, TP Quy Nhơn', tableCount: '10', cameraCount: '8' },
    ],
  },
  {
    id: '6',
    name: 'Võ Nguyễn Kim Ngân',
    cccd: '052320002659',
    phone: '0395109790',
    email: 'nv20181@gmail.com',
    status: 'Đã duyệt',
    branches: [
      { name: 'Chi nhánh 1', address: '100 Trần Hưng Đạo, Phú Nhuận, TP HCM', tableCount: '10', cameraCount: '10' },
      { name: 'Chi nhánh 2', address: '190 Nguyễn Huệ, TP Quy Nhơn', tableCount: '10', cameraCount: '8' },
    ],
  },
];

export default function AdminDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const admin = allAdmins.find(a => a.id === id);

  if (!admin) {
    return (
      <>
        <HeaderAdmin />
        <div className="p-4 text-center text-red-500">
          Không tìm thấy admin với ID: {id}
        </div>
      </>
    );
  }

  const handleApprove = () => {
    toast.success('Admin đã được duyệt.');
    router.push('/superadmin/home?tab=duyet');
  };

  const handleReject = () => {
    toast.error('Admin đã bị từ chối.');
    router.push('/superadmin/home?tab=duyet');
  };

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
      <Input value="Quán Cỏ 4 Cây Me" disabled />
    </div>
    <div>
      <label className="block text-sm font-medium text-black mb-1">Họ và Tên</label>
      <Input value={admin.name} disabled />
    </div>
    <div>
      <label className="block text-sm font-medium text-black mb-1">CCCD</label>
      <Input value={admin.cccd} disabled />
    </div>
    <div>
      <label className="block text-sm font-medium text-black mb-1">Số Điện Thoại</label>
      <Input value={admin.phone} disabled />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-black mb-1">Email</label>
      <Input value={admin.email} disabled />
    </div>
  </div>
</div>

          {/* Chi nhánh — canh lề bên phải */}
{admin.branches && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
    <div />
    <div className="md:col-span-2 space-y-4">
      {admin.branches.map((b, idx) => (
        <div
          key={idx}
          className="relative p-6 border rounded-xl bg-white shadow-md mb-6 transition-shadow hover:shadow-lg"
        >
          <div className="mb-4">
            <span className="text-base font-semibold text-lime-600">Chi nhánh {idx + 1}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tên chi nhánh</label>
              <div className="font-medium text-gray-800">{b.name}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ</label>
              <div className="font-medium text-gray-800">{b.address}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Số bàn</label>
              <div className="font-medium text-gray-800">{b.tableCount}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Số lượng camera</label>
              <div className="font-medium text-gray-800">{b.cameraCount}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

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