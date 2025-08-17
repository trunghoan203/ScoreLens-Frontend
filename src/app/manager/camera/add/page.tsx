"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { managerCameraService } from '@/lib/managerCameraService';
import { managerTableService } from '@/lib/managerTableService';
import Image from 'next/image';

interface Table {
  tableId: string;
  name: string;
  category: string;
  status: string;
}

export default function AddCameraPage() {
  const [tableId, setTableId] = useState('');
  const [ip, setIp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tables, setTables] = useState<Table[]>([]);
  const router = useRouter();

  useEffect(() => {
    managerTableService.getAllTables()
      .then((data: unknown) => {
        let tablesArr: unknown[] = [];
        if (Array.isArray(data)) tablesArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { tables?: unknown[] }).tables)) tablesArr = (data as { tables: unknown[] }).tables;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) tablesArr = (data as { data: unknown[] }).data;
        const mappedTables: Table[] = tablesArr.map(t => {
          const obj = t as Partial<Table>;
          return {
            tableId: obj.tableId || '',
            name: obj.name ?? '',
            category: obj.category ?? 'pool-8',
            status: obj.status ?? 'empty',
          };
        });
        setTables(mappedTables);
      })
      .catch(() => {
        toast.error('Không thể tải danh sách bàn');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableId || !ip || !username || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await managerCameraService.createCamera({
        tableId,
        IPAddress: ip,
        username,
        password,
      });
      toast.success('Đã thêm camera thành công!');
      router.push('/manager/camera');
    } catch (error) {
      console.error(error);
      toast.error('Thêm camera thất bại.');
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
              <div className="relative w-full">
                <select
                  value={tableId}
                  onChange={e => setTableId(e.target.value)}
                  required
                  className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option className="text-black" value="">Chọn bàn</option>
                  {tables.map(table => (
                    <option className="text-black" key={table.tableId} value={table.tableId}>
                      {table.name} - {table.category === 'pool-8' ? 'Pool 8' : table.category === 'carom' ? 'Carom' : table.category}
                    </option>
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
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">IP<span className="text-red-500">*</span></label>
              <Input value={ip} onChange={e => setIp(e.target.value)} required placeholder="Nhập địa chỉ IP" />
            </div>
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Username<span className="text-red-500">*</span></label>
              <Input value={username} onChange={e => setUsername(e.target.value)} required placeholder="Nhập username" />
            </div>
            <div className="w-full mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">Mật khẩu<span className="text-red-500">*</span></label>
              <PasswordInput value={password} onChange={e => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" />
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 