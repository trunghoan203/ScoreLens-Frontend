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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!clubName) {
      newErrors.clubName = 'Tên chi nhánh là bắt buộc';
    } else if (clubName.length < 2) {
      newErrors.clubName = 'Tên chi nhánh phải có ít nhất 2 ký tự';
    } else if (clubName.length > 255) {
      newErrors.clubName = 'Tên chi nhánh không được vượt quá 255 ký tự';
    }
    if (!address) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    } else if (address.length < 5) {
      newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
    } else if (address.length > 255) {
      newErrors.address = 'Địa chỉ không được vượt quá 255 ký tự';
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    if (tableNumber <= 0) {
      newErrors.tableNumber = 'Số bàn ít nhất là 1';
    }
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
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
      <main className="flex-1 bg-white min-h-screen lg:ml-0">
        <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
          <HeaderAdminPage />
        </div>
        <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6 sm:mb-8">
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-widest flex items-center gap-2 sm:gap-3">
              CHI NHÁNH
            </span>
          </div>
          <AddFormLayout
            title="THÊM CHI NHÁNH"
            onSubmit={handleSubmit}
            onBack={() => router.push('/admin/branches')}
            submitLabel={isSubmitting ? "Đang thêm..." : "Thêm chi nhánh"}
          >
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Tên Chi Nhánh<span className="text-red-500">*</span></label>
              <Input
                value={clubName}
                onChange={e => setClubName(e.target.value)}
                required
                placeholder="Nhập tên chi nhánh"
                className="py-2.5 sm:py-3"
              />
              {errors.clubName && <span className="text-red-500 text-xs sm:text-sm">{errors.clubName}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Địa chỉ<span className="text-red-500">*</span></label>
              <Input
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                placeholder="Nhập địa chỉ"
                className="py-2.5 sm:py-3"
              />
              {errors.address && <span className="text-red-500 text-xs sm:text-sm">{errors.address}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Số điện thoại<span className="text-red-500">*</span></label>
              <Input
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
                placeholder="Nhập số điện thoại"
                className="py-2.5 sm:py-3"
              />
              {errors.phoneNumber && <span className="text-red-500 text-xs sm:text-sm">{errors.phoneNumber}</span>}
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Số bàn<span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={tableNumber}
              onChange={e => setTableNumber(Number(e.target.value))}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
                  e.preventDefault();
                }
              }}
              required
              placeholder="Nhập số bàn"
              min="1"
              className="py-2.5 sm:py-3"
            />
            {errors.tableNumber && <span className="text-red-500 text-xs sm:text-sm">{errors.tableNumber}</span>}
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 