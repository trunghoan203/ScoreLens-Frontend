"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import AddFormLayout from "@/components/shared/AddFormLayout";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { Select } from '@/components/ui/select';
import managerService from '@/lib/managerService';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import adminService from '@/lib/adminService';

export default function AddManagerPage() {
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    email: '',
    citizenCode: '',
    address: '',
    clubId: '',
  });
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const brandId = await adminService.getBrandId();
        if (brandId) {
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
        } else {
          toast.error('Không tìm thấy brandId của admin!');
        }
      } catch {
        toast.error('Không thể tải danh sách club');
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await managerService.createManager(form);
      toast.success('Đã thêm quản lý thành công!');
      router.push('/admin/managers');
    } catch (error: unknown) {
      const errMsg = (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : undefined;
      toast.error(errMsg || 'Thêm quản lý thất bại!');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
          <HeaderAdminPage />
        </div>
        <div className="px-10 pb-10">
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              QUẢN LÝ
            </span>
          </div>
          <AddFormLayout
            title="THÊM QUẢN LÝ"
            onSubmit={handleSubmit}
            onBack={() => router.push('/admin/managers')}
          >
            <div className="w-full space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn Club <span className="text-red-500">*</span></label>
                <Select name="clubId" value={form.clubId} onChange={handleChange} required disabled={loading}>
                  <option value="">-- Chọn club --</option>
                  {clubs.map(club => (
                    <option key={club.clubId} value={club.clubId}>{club.clubName}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Quản Lý <span className="text-red-500">*</span></label>
                <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nhập Tên..." required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số Điện Thoại <span className="text-red-500">*</span></label>
                <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Nhập Số Điện Thoại..." required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày Sinh <span className="text-red-500">*</span></label>
                <Input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} placeholder="Nhập Ngày-Tháng-Năm" type="date" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                <Input name="email" value={form.email} onChange={handleChange} placeholder="Nhập Email..." required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CCCD <span className="text-red-500">*</span></label>
                <Input name="citizenCode" value={form.citizenCode} onChange={handleChange} placeholder="Nhập Số CCCD..." required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa Chỉ <span className="text-red-500">*</span></label>
                <Input name="address" value={form.address} onChange={handleChange} placeholder="Nhập Địa Chỉ..." required />
              </div>
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 