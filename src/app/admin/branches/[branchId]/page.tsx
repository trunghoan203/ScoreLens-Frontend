"use client";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import Image from 'next/image';

export default function BranchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clubId = params?.branchId as string;

  const [club, setClub] = useState<ClubResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableNumber, setTableNumber] = useState(0);
  const [actualTableCount, setActualTableCount] = useState(0);
  const [status, setStatus] = useState<'open' | 'closed' | 'maintenance'>('open');

  useEffect(() => {
    const loadClub = async () => {
      if (!clubId) {
        toast.error('Club ID không hợp lệ');
        router.push('/admin/branches');
        return;
      }

      try {
        setIsLoading(true);
        const clubData = await clubsService.getClubDetails(clubId);
        setClub(clubData);
        setName(clubData.clubName);
        setAddress(clubData.address);
        setPhoneNumber(clubData.phoneNumber);
        setTableNumber(clubData.tableNumber);
        setActualTableCount(clubData.actualTableCount || 0);
        setStatus(clubData.status);
      } catch (error) {
        console.error('Error loading club:', error);
        toast.error('Không thể tải thông tin chi nhánh');
        router.push('/admin/branches');
      } finally {
        setIsLoading(false);
      }
    };

    loadClub();
  }, [clubId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      if (tableNumber === 0) {
        toast.error('Số bàn không thể là 0');
        return;
      }

      try {
        setIsSaving(true);
        await clubsService.updateClub(clubId, {
          clubName: name,
          address,
          phoneNumber,
          tableNumber,
          status
        });
        toast.success('Cập nhật chi nhánh thành công!');
        setIsEditMode(false);
      } catch (error) {
        console.error('Error updating club:', error);
        toast.error('Cập nhật chi nhánh thất bại');
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditMode(true);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await clubsService.deleteClub(clubId);
      toast.success('Xóa chi nhánh thành công!');
      router.push('/admin/branches');
    } catch (error) {
      console.error('Error deleting club:', error);
      toast.error('Xóa chi nhánh thất bại');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderAdminPage />
          </div>
          <div className="px-10 pb-10">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
              <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
                CHI NHÁNH
              </span>
            </div>
            <div className="py-8">
              <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderAdminPage />
          </div>
          <div className="px-10 pb-10">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
              <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
                CHI NHÁNH
              </span>
            </div>
            <div className="py-8 text-center">
              <div className="text-gray-500">Không tìm thấy thông tin chi nhánh</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white min-h-screen">
        <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
          <HeaderAdminPage />
        </div>
        <div className="px-10 pb-10">
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              CHI NHÁNH
            </span>
          </div>
          <AddFormLayout
            title={isEditMode ? "CHỈNH SỬA CHI NHÁNH" : "CHI TIẾT CHI NHÁNH"}
            onBack={() => router.push('/admin/branches')}
            backLabel="Quay lại"
            submitLabel={isEditMode ? (isSaving ? "Đang lưu..." : "Lưu") : "Chỉnh sửa"}
            extraActions={
              !isEditMode && (
                <button
                  type="button"
                  className="w-40 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition text-lg disabled:opacity-50"
                  onClick={() => setShowConfirm(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              )
            }
            onSubmit={handleSubmit}
          >
            <ConfirmPopup
              open={showConfirm}
              title="Bạn có chắc chắn muốn xóa không?"
              onCancel={() => setShowConfirm(false)}
              onConfirm={handleDelete}
              confirmText={isDeleting ? "Đang xóa..." : "Xác nhận"}
              cancelText="Hủy"
            >
              <div className="text-center text-black">
                Bạn có chắc chắn muốn xóa chi nhánh &quot;{club.clubName}&quot; không?
              </div>
            </ConfirmPopup>

            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Tên Chi Nhánh<span className="text-red-500">*</span></label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={!isEditMode}
              />
            </div>

            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Địa chỉ<span className="text-red-500">*</span></label>
              <Input
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                disabled={!isEditMode}
              />
            </div>

            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Số điện thoại<span className="text-red-500">*</span></label>
              <Input
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
                disabled={!isEditMode}
              />
            </div>

            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Số bàn đã đăng ký<span className="text-red-500">*</span></label>
              <Input
                type="number"
                value={tableNumber}
                onChange={e => setTableNumber(Number(e.target.value))}
                required
                disabled={!isEditMode}
              />
            </div>

            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Số bàn thực tế trên hệ thống<span className="text-red-500">*</span></label>
              <Input
                type="number"
                value={actualTableCount}
                disabled={true}
                className="bg-gray-100 cursor-not-allowed"
              />
              {actualTableCount !== tableNumber && (
                <p className="text-xs text-red-600 italic mt-1 font-medium">
                  ⚠️ Số bàn trên hệ thống không đúng với số bàn đã đăng ký
                </p>
              )}
            </div>

            <div className="w-full mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">Trạng thái</label>
              <div className="relative w-full">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'open' | 'closed' | 'maintenance')}
                  disabled={!isEditMode}
                  className="flex w-full border border-gray-300 rounded-md bg-white px-4 py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all appearance-none"
                >
                  <option value="open">Mở cửa</option>
                  <option value="closed">Đóng cửa</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
                {isEditMode && (
                  <Image
                    src="/icon/chevron-down_Black.svg"
                    alt="Dropdown"
                    width={20}
                    height={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                )}
              </div>
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 