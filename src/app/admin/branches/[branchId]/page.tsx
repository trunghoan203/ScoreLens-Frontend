"use client";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';

const mockBranches = [
  {
    name: 'WOW Billiard 1',
    manager: 'Trần Minh Tuấn',
    email: 'Tuannt@gmail.com',
    address: '225 Ngô Mây, Phường Quang Trung, Thành Phố Quy Nhơn, Bình Định',
    tables: 1,
    cameras: 1,
  },
  // ... thêm các chi nhánh khác nếu cần
];

export default function BranchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = Number(params?.branchId) || 0;
  const branch = mockBranches[branchId] || mockBranches[0];

  const [name, setName] = useState(branch.name);
  const [manager, setManager] = useState(branch.manager);
  const [email, setEmail] = useState(branch.email);
  const [address, setAddress] = useState(branch.address);
  const [tables, setTables] = useState(branch.tables);
  const [cameras, setCameras] = useState(branch.cameras);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderAdminPage />
        <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
            CHI NHÁNH
          </span>
        </div>
        <AddFormLayout
          title={isEditMode ? "CHỈNH SỬA CHI NHÁNH" : "CHI TIẾT CHI NHÁNH"}
          onBack={() => router.push('/admin/branches')}
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
            onConfirm={() => { setShowConfirm(false); alert('Đã xóa!'); }}
            confirmText="Xác nhận"
            cancelText="Hủy"
          >
            <></>
          </ConfirmPopup>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Tên Chi Nhánh<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Tên Quản Lý<span className="text-red-500">*</span></label>
            <Input value={manager} onChange={e => setManager(e.target.value)} required />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Email</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Địa chỉ</label>
            <Input value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          <div className="w-full mb-10 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-black">Số Bàn <span className="text-red-500">*</span></label>
              <Input type="number" value={tables} onChange={e => setTables(Number(e.target.value))} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-black">Số Lượng Camera <span className="text-red-500">*</span></label>
              <Input type="number" value={cameras} onChange={e => setCameras(Number(e.target.value))} required />
            </div>
          </div>
        </AddFormLayout>
      </main>
    </div>
  );
} 