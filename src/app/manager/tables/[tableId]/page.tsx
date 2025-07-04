"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';

const tableTypes = [
  { value: 'pool', label: 'Bida Pool' },
  { value: 'carom', label: 'Bida Carom' },
];

const mockTables = [
  {
    id: '1',
    name: '01',
    type: 'pool',
    status: 'using',
    teamA: ['Nguyễn Văn A', 'Trần Thị B'],
    teamB: ['Lê Văn C', 'Phạm Thị D'],
    time: '01:23:45',
  },
  {
    id: '2',
    name: '02',
    type: 'carom',
    status: 'available',
    teamA: [],
    teamB: [],
    time: '00:00:00',
  },
];

export default function TableDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tableId = params?.tableId as string;
  const table = mockTables.find(t => t.id === tableId) || mockTables[0];

  const [name, setName] = useState(table.name);
  const [type, setType] = useState(table.type);
  const [status, setStatus] = useState(table.status);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const statusOptions = [
    { value: 'available', label: 'Bàn trống' },
    { value: 'using', label: 'Đang sử dụng' },
  ];

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
          title={isEditMode ? "CHỈNH SỬA BÀN" : "CHI TIẾT BÀN"}
          onBack={() => router.push('/manager/tables')}
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
              console.log('Lưu bàn:', { name, type, status });
              setIsEditMode(false);
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <ConfirmPopup
            open={showConfirm}
            title="Bạn có chắc chắn muốn xóa bàn này không?"
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => { 
              setShowConfirm(false); 
              console.log('Đã xóa bàn:', tableId);
              router.push('/manager/tables');
            }}
            confirmText="Xác nhận"
            cancelText="Hủy"
          >
            <></>
          </ConfirmPopup>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Tên Bàn<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Loại Bàn<span className="text-red-500">*</span></label>
            <Select className="text-black" value={type} onChange={e => setType(e.target.value)} required disabled={!isEditMode}>
              {tableTypes.map(t => (
                <option className="text-black" key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </div>
          <div className="w-full mb-10">
            <label className="block text-sm font-semibold mb-2 text-black">Trạng Thái<span className="text-red-500">*</span></label>
            <Select className="text-black" value={status} onChange={e => setStatus(e.target.value)} required disabled={!isEditMode}>
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