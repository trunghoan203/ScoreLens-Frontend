"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import managerService from '@/lib/managerService';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import adminService from '@/lib/adminService';
import Image from 'next/image';

export default function AddManagerPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [citizenCode, setCitizenCode] = useState('');
  const [address, setAddress] = useState('');
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const brandId = await adminService.getBrandId();
        if (brandId) {
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
        }
      } catch (error) {
        toast.error('Không thể tải danh sách chi nhánh');
      }
    };
    fetchClubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await managerService.createManager({
        fullName: name,
        email,
        phoneNumber: phone,
        dateOfBirth: dob,
        citizenCode: citizenCode,
        address,
        clubId,
      });
      
      toast.success('Thêm quản lý thành công!');
      router.push('/admin/managers');
    } catch (error: unknown) {
      const errMsg = (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : undefined;
      toast.error(errMsg || 'Thêm quản lý thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    if (value) {
      const [year, month, day] = value.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      setDob(formattedDate);
    } else {
      setDob(value);
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
              QUẢN LÝ
            </span>
          </div>
          <AddFormLayout
            title="THÊM QUẢN LÝ"
            onBack={() => router.push('/admin/managers')}
            backLabel="Quay lại"
            submitLabel="Thêm quản lý"
            onSubmit={handleSubmit}
          >
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Chọn Chi Nhánh<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={clubId}
                  onChange={e => setClubId(e.target.value)}
                  required
                  name="clubId"
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option value="">-- Chọn chi nhánh --</option>
                  {clubs.map(club => (
                    <option key={club.clubId} value={club.clubId}>{club.clubName}</option>
                  ))}
                </select>
                <Image
                  src="/icon/chevron-down_Black.svg"
                  alt="Dropdown"
                  width={16}
                  height={16}
                  className="sm:w-5 sm:h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Tên Quản Lý<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Số Điện Thoại<span className="text-red-500">*</span></label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} required className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Ngày Sinh<span className="text-red-500">*</span></label>
              <input
                type="date"
                value={dob ? (() => {
                  try {
                    const [day, month, year] = dob.split('/');
                    if (day && month && year) {
                      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    }
                  } catch {
                  }
                  return '';
                })() : ''}
                onChange={handleDateChange}
                placeholder="dd/mm/yyyy"
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-base text-black placeholder-gray-500 hover:border-lime-400 outline-none transition-all focus:border-lime-500"
              />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Email<span className="text-red-500">*</span></label>
              <Input value={email} onChange={e => setEmail(e.target.value)} required className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">CCCD<span className="text-red-500">*</span></label>
              <Input value={citizenCode} onChange={e => setCitizenCode(e.target.value)} required className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Địa Chỉ<span className="text-red-500">*</span></label>
              <Input value={address} onChange={e => setAddress(e.target.value)} required className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Trạng Thái<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={isActive ? 'active' : 'inactive'}
                  onChange={e => setIsActive(e.target.value === 'active')}
                  required
                  name="isActive"
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
                <Image
                  src="/icon/chevron-down_Black.svg"
                  alt="Dropdown"
                  width={16}
                  height={16}
                  className="sm:w-5 sm:h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
}
