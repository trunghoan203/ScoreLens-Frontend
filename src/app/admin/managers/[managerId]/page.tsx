"use client";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';

const mockManagers = [
  {
    name: 'Trần Minh Tuấn',
    phone: '0927323726',
    dob: '1990-01-01',
    email: 'hagaoan@gmail.com',
    cccd: '123456789',
    address: '225 Ngô Mây, Quy Nhơn',
  },
  // ... thêm các manager khác nếu cần
];

export default function ManagerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const managerId = Number(params?.managerId) || 0;
  const manager = mockManagers[managerId] || mockManagers[0];

  const [name, setName] = useState(manager.name);
  const [phone, setPhone] = useState(manager.phone);
  const [dob, setDob] = useState(manager.dob);
  const [email, setEmail] = useState(manager.email);
  const [cccd, setCccd] = useState(manager.cccd);
  const [address, setAddress] = useState(manager.address);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderAdminPage />
        <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
            QUẢN LÝ
          </span>
        </div>
        <AddFormLayout
          title={isEditMode ? "CHỈNH SỬA QUẢN LÝ" : "CHI TIẾT QUẢN LÝ"}
          onBack={() => router.push('/admin/managers')}
          backLabel="Quay lại"
          submitLabel={isEditMode ? "Lưu" : "Chỉnh sửa"}
          extraActions={
            !isEditMode && (
              <button
                type="button"
                className="w-40 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition text-lg"
                onClick={() => setShowConfirm(true)}
              >
                Xóa
              </button>
            )
          }
          onSubmit={e => {
            e.preventDefault();
            if (isEditMode) {
              // Lưu dữ liệu
              setIsEditMode(false);
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <ConfirmPopup
            open={showConfirm}
            title="Bạn có chắc chắn muốn xóa không?"
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => { setShowConfirm(false); toast.success('Đã xóa quản lý thành công!'); }}
            confirmText="Xác nhận"
            cancelText="Hủy"
          >
            <></>
          </ConfirmPopup>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Tên Quản Lý<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Số Điện Thoại<span className="text-red-500">*</span></label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Ngày Sinh<span className="text-red-500">*</span></label>
            <Input type="date" value={dob} onChange={e => setDob(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Email<span className="text-red-500">*</span></label>
            <Input value={email} onChange={e => setEmail(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">CCCD<span className="text-red-500">*</span></label>
            <Input value={cccd} onChange={e => setCccd(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-10">
            <label className="block text-sm font-semibold mb-2 text-black">Địa Chỉ<span className="text-red-500">*</span></label>
            <Input value={address} onChange={e => setAddress(e.target.value)} required disabled={!isEditMode} />
          </div>
        </AddFormLayout>
      </main>
    </div>
  );
} 