"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { managerMemberService } from '@/lib/managerMemberService';

export default function AddMemberPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      await managerMemberService.createMember({ fullName: name, phoneNumber: phone });
      toast.success('Đã thêm hội viên thành công!');
      router.push('/manager/members');
    } catch (error) {
      console.error(error);
      toast.error('Thêm hội viên thất bại.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white min-h-screen">
        <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
          <HeaderManager />
        </div>
        <div className="px-10 pb-10">
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
        </div>
      </main>
    </div>
  );
} 