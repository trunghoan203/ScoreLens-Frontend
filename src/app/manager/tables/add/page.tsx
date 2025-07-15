"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { managerTableService } from '@/lib/managerTableService';

const tableTypes = [
  { value: 'pool', label: 'Bida Pool' },
  { value: 'carom', label: 'Bida Carom' },
];

export default function AddTablePage() {
  const [name, setName] = useState('');
  const [type, setType] = useState(tableTypes[0].value);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await managerTableService.createTable({ number: Number(name), category: type });
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
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderManager />
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
            <Select className="text-black" value={type} onChange={e => setType(e.target.value)} required>
              {tableTypes.map(t => (
                <option className="text-black" key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </div>
        </AddFormLayout>
      </main>
    </div>
  );
} 