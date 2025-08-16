"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';
import { managerMemberService } from '@/lib/managerMemberService';
import Image from 'next/image';

interface Member {
  membershipId: string;
  fullName: string;
  phoneNumber: string;
  status: 'active' | 'inactive';
  _id?: string;
}

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.memberId as string;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    managerMemberService.getAllMembers()
      .then((data: unknown) => {
        let membersArr: unknown[] = [];
        if (Array.isArray(data)) membersArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { memberships?: unknown[] }).memberships)) membersArr = (data as { memberships: unknown[] }).memberships;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) membersArr = (data as { data: unknown[] }).data;
        const found = membersArr.find((m) => {
          const obj = m as Partial<Member>;
          return obj.membershipId === memberId || obj._id === memberId;
        });
        if (found) {
          const memberObj = found as Partial<Member>;
          setName(memberObj.fullName || '');
          setPhone(memberObj.phoneNumber || '');
          setStatus(memberObj.status || 'active');
        } else {
          toast.error('Không tìm thấy hội viên');
        }
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu hội viên');
      });
  }, [memberId]);

  const handleSave = async () => {
    try {
      await managerMemberService.updateMember(memberId, { fullName: name, phoneNumber: phone, status });
      toast.success('Đã lưu hội viên thành công!');
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error('Lưu hội viên thất bại.');
    }
  };

  const handleDelete = async () => {
    try {
      await managerMemberService.deleteMember(memberId);
      toast.success('Đã xóa hội viên thành công!');
      router.push('/manager/members');
    } catch (error) {
      console.error(error);
      toast.error('Xóa hội viên thất bại.');
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
                handleSave();
              } else {
                setIsEditMode(true);
              }
            }}
          >
            <ConfirmPopup
              open={showConfirm}
              title="Bạn có chắc chắn muốn xóa hội viên này không?"
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
              <label className="block text-sm font-semibold mb-2 text-gray-500">Mã Hội Viên<span className="text-red-500">*</span></label>
              <Input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                disabled={true}
                className="bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Tên Hội Viên<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required disabled={!isEditMode} />
            </div>
            <div className="w-full mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">Trạng thái<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
                  disabled={!isEditMode}
                  className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
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