"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Select } from '@/components/ui/select';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';
import { managerCameraService } from '@/lib/managerCameraService';
import { managerTableService } from '@/lib/managerTableService';

interface Table {
  tableId: string;
  name: string;
  category: string;
  status: string;
}

interface Camera {
  cameraId?: string;
  _id?: string;
  tableId?: string;
  IPAddress?: string;
  username?: string;
  password?: string;
  isConnect?: boolean;
}

export default function CameraDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cameraId = params?.cameraId as string;

  const [tables, setTables] = useState<Table[]>([]);
  const [tableId, setTableId] = useState('');
  const [ip, setIp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnect, setIsConnect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const formatCategory = (category: string) => {
    switch (category) {
      case 'pool-8':
        return 'Pool-8';
      case 'carom':
        return 'Carom';
      default:
        return category;
    }
  };

  useEffect(() => {
    Promise.all([
      managerCameraService.getAllCameras(),
      managerTableService.getAllTables()
    ])
      .then(([cameraData, tableData]) => {
        let camerasArr: unknown[] = [];
        if (Array.isArray(cameraData)) camerasArr = cameraData;
        else if (cameraData && typeof cameraData === 'object' && Array.isArray((cameraData as { cameras?: unknown[] }).cameras)) camerasArr = (cameraData as { cameras: unknown[] }).cameras;
        else if (cameraData && typeof cameraData === 'object' && Array.isArray((cameraData as { data?: unknown[] }).data)) camerasArr = (cameraData as { data: unknown[] }).data;
        const found = camerasArr.find((c) => {
          const obj = c as Camera;
          return obj.cameraId === cameraId || obj._id === cameraId;
        });
        if (found) {
          const cameraObj = found as Camera;
          setTableId(cameraObj.tableId || '');
          setIp(cameraObj.IPAddress || '');
          setUsername(cameraObj.username || '');
          setPassword(cameraObj.password || '');
          setIsConnect(!!cameraObj.isConnect);
        } else {
          toast.error('Không tìm thấy camera');
        }
        let tablesArr: unknown[] = [];
        if (Array.isArray(tableData)) tablesArr = tableData;
        else if (tableData && typeof tableData === 'object' && Array.isArray((tableData as { tables?: unknown[] }).tables)) tablesArr = (tableData as { tables: unknown[] }).tables;
        else if (tableData && typeof tableData === 'object' && Array.isArray((tableData as { data?: unknown[] }).data)) tablesArr = (tableData as { data: unknown[] }).data;
        const mappedTables: Table[] = tablesArr.map(t => {
          const obj = t as Partial<Table>;
          return {
            tableId: obj.tableId || '',
            name: obj.name || '',
            category: obj.category ?? 'pool-8',
            status: obj.status ?? 'empty',
          };
        });
        setTables(mappedTables);
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu camera hoặc bàn');
      });
  }, [cameraId]);

  // Theo dõi scroll để thay đổi viền header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = async () => {
    try {
      await managerCameraService.updateCamera(cameraId, {
        tableId,
        IPAddress: ip,
        username,
        password,
        isConnect
      });
      toast.success('Đã lưu camera thành công!');
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error('Lưu camera thất bại.');
    }
  };

  const handleDelete = async () => {
    try {
      await managerCameraService.deleteCamera(cameraId);
      toast.success('Đã xóa camera thành công!');
      router.push('/manager/camera');
    } catch (error) {
      console.error(error);
      toast.error('Xóa camera thất bại.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white min-h-screen">
        <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
          }`}>
          <HeaderManager />
        </div>
        <div className="p-10">
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
                handleSave();
              } else {
                setIsEditMode(true);
              }
            }}
          >
            <ConfirmPopup
              open={showConfirm}
              title="Bạn có chắc chắn muốn xóa camera này không?"
              onCancel={() => setShowConfirm(false)}
              onConfirm={async () => {
                setShowConfirm(false);
                await handleDelete();
              }}
              confirmText="Xác nhận"
              cancelText="Hủy"
            >
              <></>
            </ConfirmPopup>
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Bàn<span className="text-red-500">*</span></label>
              <Select
                className="text-black"
                value={tableId}
                onChange={e => setTableId(e.target.value)}
                required
                disabled={!isEditMode}
              >
                {tables.map(table => (
                  <option className="text-black" key={table.tableId} value={table.tableId}>
                    {table.name} - {formatCategory(table.category)}
                  </option>
                ))}
              </Select>
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
              <PasswordInput value={password} onChange={e => setPassword(e.target.value)} required disabled={!isEditMode} />
            </div>
            <div className="w-full mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">Trạng thái kết nối<span className="text-red-500">*</span></label>
              <Select
                className="text-black"
                value={isConnect ? 'true' : 'false'}
                onChange={e => setIsConnect(e.target.value === 'true')}
                required
                disabled={!isEditMode}
              >
                <option className="text-black" value="true">Đã kết nối</option>
                <option className="text-black" value="false">Chưa kết nối</option>
              </Select>
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 