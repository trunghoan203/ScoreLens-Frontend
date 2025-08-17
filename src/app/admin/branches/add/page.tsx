"use client";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import clubsService, { Club } from '@/lib/clubsService';

export default function AddBranchPage() {
  const [clubName, setClubName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableNumber, setTableNumber] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clubName || !address || !phoneNumber || tableNumber <= 0) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsSubmitting(true);

      const clubData: Club = {
        clubName,
        address,
        phoneNumber,
        tableNumber,
        status: 'open'
      };

      await clubsService.createClub(clubData);
      toast.success('Đã thêm chi nhánh thành công!');
      router.push('/admin/branches');
    } catch (error) {
      console.error('Error creating club:', error);
      toast.error('Thêm chi nhánh thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            title="THÊM CHI NHÁNH"
            onSubmit={handleSubmit}
            onBack={() => router.push('/admin/branches')}
            submitLabel={isSubmitting ? "Đang thêm..." : "Thêm chi nhánh"}
          >
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Tên Chi Nhánh<span className="text-red-500">*</span></label>
              <Input
                value={clubName}
                onChange={e => setClubName(e.target.value)}
                required
                placeholder="Nhập tên chi nhánh"
              />
            </div>
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Địa chỉ<span className="text-red-500">*</span></label>
              <Input
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Số điện thoại<span className="text-red-500">*</span></label>
              <Input
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="w-full mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">Số bàn<span className="text-red-500">*</span></label>
              <Input
                type="number"
                value={tableNumber}
                onChange={e => setTableNumber(Number(e.target.value))}
                required
                placeholder="Nhập số bàn"
                min="1"
              />
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 