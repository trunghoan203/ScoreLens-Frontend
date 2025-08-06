"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';
import { managerTableService } from '@/lib/managerTableService';

const tableTypes = [
  { value: 'pool-8', label: 'Bida Pool' },
  { value: 'carom', label: 'Bida Carom' },
];

interface Table {
  _id: string;
  tableId: string;
  name: string;
  category: string;
  status: string;
  [key: string]: unknown;
}

export default function TableDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tableId = params?.tableId as string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [table, setTable] = useState<Table | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setLoading(true);
    managerTableService.getAllTables()
      .then((data: unknown) => {
        let tablesArr: unknown[] = [];
        if (Array.isArray(data)) tablesArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { tables?: unknown[] }).tables)) tablesArr = (data as { tables: unknown[] }).tables;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) tablesArr = (data as { data: unknown[] }).data;
        const found = tablesArr.find((t) => {
          const obj = t as Partial<Table>;
          return obj.tableId === tableId || obj._id === tableId;
        });
        if (found) {
          const tableObj = found as Table;
          setTable(tableObj);
          setName(String(tableObj.name));
          setType(tableObj.category);
          setStatus(tableObj.status);
        } else {
          // setError('Không tìm thấy bàn'); // Original line commented out
        }
      })
      .catch(() => {
        // setError('Không thể tải dữ liệu bàn'); // Original line commented out
      })
      .finally(() => setLoading(false));
  }, [tableId]);

  // Theo dõi scroll để thay đổi viền header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statusOptions = [
    { value: 'empty', label: 'Trống' },
    { value: 'inuse', label: 'Đang sử dụng' },
    { value: 'maintenance', label: 'Bảo trì' },
  ];

  const handleSave = async () => {
    try {
      await managerTableService.updateTable(tableId, { name: name, category: type, status });
      toast.success('Đã lưu bàn thành công!');
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error('Lưu bàn thất bại.');
    }
  };

  const handleDelete = async () => {
    try {
      await managerTableService.deleteTable(tableId);
      toast.success('Đã xóa bàn thành công!');
      router.push('/manager/tables');
    } catch (error) {
      console.error(error);
      toast.error('Xóa bàn thất bại.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white min-h-screen">
        <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${
          isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
        }`}>
          <HeaderManager />
        </div>
        <div className="p-10">
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
              handleSave();
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <ConfirmPopup
            open={showConfirm}
            title="Bạn có chắc chắn muốn xóa bàn này không?"
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
        </div>
      </main>
    </div>
  );
} 