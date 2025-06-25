"use client";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const managers = [
  { value: 'tran-minh-tuan', label: 'Trần Minh Tuấn' },
  { value: 'nguyen-van-a', label: 'Nguyễn Văn A' },
  { value: 'le-thi-b', label: 'Lê Thị B' },
];

export default function AddBranchPage() {
  const [name, setName] = useState('');
  const [manager, setManager] = useState(managers[0].value);
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý thêm chi nhánh ở đây
    router.push('/admin/branches');
  };

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
          title="THÊM CHI NHÁNH"
          onSubmit={handleSubmit}
          onBack={() => router.push('/admin/branches')}
        >
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Tên Chi Nhánh<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Nhập tên chi nhánh" />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Tên Quản Lý<span className="text-red-500">*</span></label>
            <Select className="text-black" value={manager} onChange={e => setManager(e.target.value)} required>
              {managers.map(m => (
                <option className="text-black" key={m.value} value={m.value}>{m.label}</option>
              ))}
            </Select>
          </div>
          <div className="w-full mb-10">
            <label className="block text-sm font-semibold mb-2 text-black">Địa chỉ<span className="text-red-500">*</span></label>
            <Input value={address} onChange={e => setAddress(e.target.value)} required placeholder="Nhập địa chỉ" />
          </div>
        </AddFormLayout>
      </main>
    </div>
  );
} 