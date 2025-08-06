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

interface Member {
  membershipId: string;
  fullName: string;
  phoneNumber: string;
  totalPlayTime?: number;
  _id?: string;
}

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.memberId as string;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [playTime, setPlayTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
          setPlayTime(memberObj.totalPlayTime !== undefined ? `${memberObj.totalPlayTime} phút` : '');
        } else {
          toast.error('Không tìm thấy hội viên');
        }
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu hội viên');
      });
  }, [memberId]);

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
      await managerMemberService.updateMember(memberId, { fullName: name, phoneNumber: phone });
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
        <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${
          isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
        }`}>
          <HeaderManager />
        </div>
        <div className="p-10">
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
            <label className="block text-sm font-semibold mb-2 text-black">Tên Hội Viên<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-6">
            <label className="block text-sm font-semibold mb-2 text-black">Số Điện Thoại<span className="text-red-500">*</span></label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} required disabled={!isEditMode} />
          </div>
          <div className="w-full mb-10">
            <label className="block text-sm font-semibold mb-2 text-black">Thời Gian Chơi</label>
            <Input value={playTime} onChange={e => setPlayTime(e.target.value)} disabled />
          </div>
        </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 