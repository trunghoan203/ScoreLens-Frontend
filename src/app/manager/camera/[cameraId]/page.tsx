"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';

const statusOptions = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
];

const mockCameras = [
  {
    id: '1',
    table: '01',
    ip: '192.168.1.100',
    username: 'admin',
    password: 'password123',
    status: 'active',
  },
  {
    id: '2',
    table: '02',
    ip: '192.168.1.101',
    username: 'admin',
    password: 'password123',
    status: 'inactive',
  },
  {
    id: '3',
    table: '03',
    ip: '192.168.1.102',
    username: 'admin',
    password: 'password123',
    status: 'active',
  },
  {
    id: '4',
    table: '04',
    ip: '192.168.1.103',
    username: 'admin',
    password: 'password123',
    status: 'active',
  },
];

export default function CameraDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cameraId = params.cameraId as string;
  const camera = mockCameras.find(c => c.id === cameraId) || mockCameras[0];

  const [table, setTable] = useState(camera.table);
  const [ip, setIp] = useState(camera.ip);
  const [username, setUsername] = useState(camera.username);
  const [password, setPassword] = useState(camera.password);
  const [status, setStatus] = useState(camera.status);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
          title={isEditMode ? "CHỈNH SỬA CAMERA" : "CHI TIẾT CAMERA"}
          onBack={() => router.push('/manager/camera')}
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
              console.log('Lưu camera:', { table, ip, username, password, status });
              setIsEditMode(false);
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <ConfirmPopup
            open={showConfirm}
            title="Bạn có chắc chắn muốn xóa camera này không?"
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => { 
              setShowConfirm(false); 
              console.log('Đã xóa camera:', cameraId);
              router.push('/manager/camera');
            }}
            confirmText="Xác nhận"
            cancelText="Hủy"
          >
            <></>
          </ConfirmPopup>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Bàn<span className="text-red-500">*</span></label>
            <Input value={table} onChange={e => setTable(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">IP<span className="text-red-500">*</span></label>
            <Input value={ip} onChange={e => setIp(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Username<span className="text-red-500">*</span></label>
            <Input value={username} onChange={e => setUsername(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Mật khẩu<span className="text-red-500">*</span></label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-10">
            <label className="block text-sm font-semibold mb-2 text-black">Trạng thái<span className="text-red-500">*</span></label>
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