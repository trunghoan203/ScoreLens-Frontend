"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function AddMemberPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý thêm hội viên ở đây
    toast.success('Đã thêm hội viên thành công!');
    router.push('/manager/members');
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderManager />
        <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
            QUẢN LÝ HỘI VIÊN
          </span>
        </div>
        <AddFormLayout
          title="THÊM HỘI VIÊN"
          onSubmit={handleSubmit}
          onBack={() => router.push('/manager/members')}
        >
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Tên Hội Viên<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Nhập tên hội viên" />
          </div>
          <div className="w-full mb-10">
            <label className="block text-sm font-semibold mb-2 text-black">Số Điện Thoại<span className="text-red-500">*</span></label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} required placeholder="Nhập số điện thoại" />
          </div>
        </AddFormLayout>
      </main>
    </div>
  );
} 