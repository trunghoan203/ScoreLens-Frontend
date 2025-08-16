"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { managerTableService } from '@/lib/managerTableService';
import Image from 'next/image';

const tableTypes = [
  { value: 'pool-8', label: 'Bida Pool-8' },
  { value: 'carom', label: 'Bida Carom' },
];

export default function AddTablePage() {
  const [name, setName] = useState('');
  const [type, setType] = useState(tableTypes[0].value);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await managerTableService.createTable({ name: name, category: type });
      toast.success('Đã thêm bàn thành công!');
      router.push('/manager/tables');
    } catch (error) {
      console.error(error);
      toast.error('Thêm bàn thất bại.');
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
              QUẢN LÝ BÀN
            </span>
          </div>
          <AddFormLayout
            title="THÊM BÀN"
            onSubmit={handleSubmit}
            onBack={() => router.push('/manager/tables')}
          >
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Tên Bàn<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Nhập tên bàn" />
            </div>
            <div className="w-full mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">Loại Bàn<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 text-sm text-black outline-none appearance-none"
                  required
                >
                  {tableTypes.map(t => (
                    <option className="text-black" key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <Image
                  src="/icon/chevron-down_Black.svg"
                  alt="Dropdown"
                  width={20}
                  height={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 