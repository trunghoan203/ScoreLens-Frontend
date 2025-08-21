"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { managerMemberService } from '@/lib/managerMemberService';

export default function AddMemberPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Tên hội viên là bắt buộc';
    else if (name.length < 2) newErrors.name = 'Tên hội viên phải có ít nhất 2 ký tự';
    if (!phone) newErrors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await managerMemberService.createMember({ fullName: name, phoneNumber: phone });
      toast.success('Đã thêm hội viên thành công!');
      router.push('/manager/members');
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error && error.message === 'Số điện thoại đã được sử dụng bởi hội viên khác') {
        setErrors({ phone: 'Số điện thoại đã được sử dụng bởi hội viên khác' });
      } else {
        toast.error('Thêm hội viên thất bại.');
      }
    } finally {
      setIsSubmitting(false);
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
            title="THÊM HỘI VIÊN"
            onSubmit={handleSubmit}
            onBack={() => router.push('/manager/members')}
            submitButtonDisabled={isSubmitting}
          >
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">Tên Hội Viên<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Nhập tên hội viên" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="w-full mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">Số Điện Thoại<span className="text-red-500">*</span></label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} required placeholder="Nhập số điện thoại" />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 