"use client";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';
import managerService from '@/lib/managerService';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import adminService from '@/lib/adminService';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Image from 'next/image';


function convertDateFormat(dateString: string, fromFormat: 'iso' | 'ddmmyyyy', toFormat: 'iso' | 'ddmmyyyy'): string {
  if (fromFormat === toFormat) return dateString;
  
  if (fromFormat === 'iso' && toFormat === 'ddmmyyyy') {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  } else if (fromFormat === 'ddmmyyyy' && toFormat === 'iso') {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateString;
}

export default function ManagerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const managerId = params?.managerId as string;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [citizenCode, setCitizenCode] = useState('');
  const [address, setAddress] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [isActive, setIsActive] = useState(false);

  React.useEffect(() => {
    const fetchManager = async () => {
      setLoading(true);
      try {
        const res = await managerService.getManagerDetail(managerId) as Record<string, unknown>;
        const data = (res && typeof res === 'object' && 'data' in res) ? (res.data as Record<string, unknown>) : res;
        const dataObj = data as Record<string, unknown>;
        setName(typeof dataObj.fullName === 'string' ? dataObj.fullName : '');
        setPhone(typeof dataObj.phoneNumber === 'string' ? dataObj.phoneNumber : '');
        const backendDate = typeof dataObj.dateOfBirth === 'string' ? dataObj.dateOfBirth : '';
        setDob(backendDate ? convertDateFormat(backendDate, 'iso', 'ddmmyyyy') : '');
        setEmail(typeof dataObj.email === 'string' ? dataObj.email : '');
        setCitizenCode(typeof dataObj.citizenCode === 'string' ? dataObj.citizenCode : '');
        setAddress(typeof dataObj.address === 'string' ? dataObj.address : '');
        setClubId(typeof dataObj.clubId === 'string' ? dataObj.clubId : '');
        setIsActive(typeof dataObj.isActive === 'boolean' ? dataObj.isActive : false);
      } catch {
        toast.error('Không thể tải chi tiết quản lý');
      } finally {
        setLoading(false);
      }
    };
    if (managerId) fetchManager();
  }, [managerId]);

  React.useEffect(() => {
    const fetchClubs = async () => {
      try {
        const brandId = await adminService.getBrandId();
        if (brandId) {
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
        }
      } catch { }
    };
    fetchClubs();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await managerService.updateManager(managerId, {
        fullName: name,
        email,
        phoneNumber: phone,
        dateOfBirth: dob,
        citizenCode: citizenCode,
        address,
        clubId,
        isActive,
      });
      toast.success('Lưu quản lý thành công!');
      setIsEditMode(false);
    } catch (error: unknown) {
      const errMsg = (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : undefined;
      toast.error(errMsg || 'Cập nhật quản lý thất bại!');
    }
  };

  const handleDelete = async () => {
    try {
      await managerService.deleteManager(managerId);
      toast.success('Đã xóa quản lý thành công!');
      router.push('/admin/managers');
    } catch (error: unknown) {
      const errMsg = (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : undefined;
      toast.error(errMsg || 'Xóa quản lý thất bại!');
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

  if (loading) {
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
            <div className="py-8">
              <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            title={isEditMode ? "CHỈNH SỬA QUẢN LÝ" : "CHI TIẾT QUẢN LÝ"}
            onBack={() => router.push('/admin/managers')}
            backLabel="Quay lại"
            submitLabel={isEditMode ? "Lưu" : "Chỉnh sửa"}
            extraActions={
              !isEditMode && (
                <button
                  type="button"
                  className="w-full sm:w-40 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 sm:py-2 rounded-lg transition text-sm sm:text-lg touch-manipulation order-2 sm:order-3"
                  onClick={() => setShowConfirm(true)}
                >
                  Xóa
                </button>
              )
            }
            onSubmit={isEditMode ? handleUpdate : (e) => { e.preventDefault(); setIsEditMode(true); }}
          >
            <ConfirmPopup
              open={showConfirm}
              title="Bạn có chắc chắn muốn xóa không?"
              onCancel={() => setShowConfirm(false)}
              onConfirm={async () => { setShowConfirm(false); await handleDelete(); }}
              confirmText="Xác nhận"
              cancelText="Hủy"
            >
              <></>
            </ConfirmPopup>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Chọn Chi Nhánh<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={clubId}
                  onChange={e => setClubId(e.target.value)}
                  required
                  disabled={!isEditMode}
                  name="clubId"
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option value="">-- Chọn chi nhánh --</option>
                  {clubs.map(club => (
                    <option key={club.clubId} value={club.clubId}>{club.clubName}</option>
                  ))}
                </select>
                {isEditMode && (
                  <Image
                    src="/icon/chevron-down_Black.svg"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="sm:w-5 sm:h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                )}
              </div>
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Tên Quản Lý<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required disabled={!isEditMode} className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Số Điện Thoại<span className="text-red-500">*</span></label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} required disabled={!isEditMode} className="py-2.5 sm:py-3" />
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
                disabled={!isEditMode}
                className={`w-full bg-white border rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-base text-black placeholder-gray-500 hover:border-lime-400 outline-none transition-all ${isEditMode
                  ? 'border-gray-300 focus:border-lime-500 hover:border-lime-400'
                  : 'border-gray-200 bg-gray-100'
                  }`}
              />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Email<span className="text-red-500">*</span></label>
              <Input value={email} onChange={e => setEmail(e.target.value)} required disabled={!isEditMode} className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">CCCD<span className="text-red-500">*</span></label>
              <Input value={citizenCode} onChange={e => setCitizenCode(e.target.value)} required disabled={!isEditMode} className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Địa Chỉ<span className="text-red-500">*</span></label>
              <Input value={address} onChange={e => setAddress(e.target.value)} required disabled={!isEditMode} className="py-2.5 sm:py-3" />
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">Trạng Thái<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={isActive ? 'active' : 'inactive'}
                  onChange={e => setIsActive(e.target.value === 'active')}
                  required
                  disabled={!isEditMode}
                  name="isActive"
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none" >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
                {isEditMode && (
                  <Image
                    src="/icon/chevron-down_Black.svg"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="sm:w-5 sm:h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 