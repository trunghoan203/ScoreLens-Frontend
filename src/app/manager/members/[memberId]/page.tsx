"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';

const mockMembers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    playTime: '2 giờ 30 phút',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    phone: '0987654321',
    playTime: '1 giờ 45 phút',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    phone: '0369852147',
    playTime: '3 giờ 15 phút',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    phone: '0521478963',
    playTime: '45 phút',
  },
];

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.memberId as string;
  const member = mockMembers.find(m => m.id === memberId) || mockMembers[0];

  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [playTime, setPlayTime] = useState(member.playTime);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
          title={isEditMode ? "CHỈNH SỬA HỘI VIÊN" : "CHI TIẾT HỘI VIÊN"}
          onBack={() => router.push('/manager/members')}
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
              toast.success('Đã lưu hội viên thành công!');
              setIsEditMode(false);
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <ConfirmPopup
            open={showConfirm}
            title="Bạn có chắc chắn muốn xóa hội viên này không?"
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => { 
              setShowConfirm(false); 
              toast.success('Đã xóa hội viên thành công!');
              router.push('/manager/members');
            }}
            confirmText="Xác nhận"
            cancelText="Hủy"
          >
            <></>
          </ConfirmPopup>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Tên Hội Viên<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Số Điện Thoại<span className="text-red-500">*</span></label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-10">
            <label className="block text-sm font-semibold mb-2 text-black">Thời Gian Chơi</label>
            <Input value={playTime} onChange={e => setPlayTime(e.target.value)} disabled={!isEditMode} />
          </div>
        </AddFormLayout>
      </main>
    </div>
  );
} 