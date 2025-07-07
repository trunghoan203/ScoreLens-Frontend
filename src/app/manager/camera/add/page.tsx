"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
];

export default function AddCameraPage() {
  const [table, setTable] = useState('');
  const [ip, setIp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(statusOptions[0].value);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý thêm camera ở đây
    toast.success('Đã thêm camera thành công!');
    router.push('/manager/camera');
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderManager />
        <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
            QUẢN LÝ CAMERA
          </span>
        </div>
        <AddFormLayout
          title="THÊM CAMERA"
          onSubmit={handleSubmit}
          onBack={() => router.push('/manager/camera')}
        >
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Bàn<span className="text-red-500">*</span></label>
            <Input value={table} onChange={e => setTable(e.target.value)} required placeholder="Nhập tên bàn" />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">IP<span className="text-red-500">*</span></label>
            <Input value={ip} onChange={e => setIp(e.target.value)} required placeholder="Nhập địa chỉ IP" />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Username<span className="text-red-500">*</span></label>
            <Input value={username} onChange={e => setUsername(e.target.value)} required placeholder="Nhập username" />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Mật khẩu<span className="text-red-500">*</span></label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" />
          </div>
          <div className="w-full mb-10">
            <label className="block text-sm font-semibold mb-2 text-black">Trạng thái<span className="text-red-500">*</span></label>
            <Select className="text-black" value={status} onChange={e => setStatus(e.target.value)} required>
              {statusOptions.map(s => (
                <option className="text-black" key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </div>
        </AddFormLayout>
      </main>
    </div>
  );
} 