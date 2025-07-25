"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import Image from 'next/image';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import toast from 'react-hot-toast';
import brandService, { Brand } from '@/lib/brandService';
import adminService from '@/lib/adminService';
import clubsService, { ClubResponse } from '@/lib/clubsService';


export default function ClubInfoPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brandInfo, setBrandInfo] = useState<Brand | null>(null);
  const [clubs, setClubs] = useState<ClubResponse[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const brandId = await adminService.getBrandId();
        if (brandId) {
          const brand = await brandService.getBrandById(brandId);
          setBrandInfo(brand);
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
        }
      } catch {
        toast.error('Không thể tải thông tin brand hoặc club');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleConfirm = () => {
    setShowConfirm(false);
    toast.success('Đã lưu thông tin câu lạc bộ!');
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderAdminPage />
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              THÔNG TIN CÂU LẠC BỘ
            </span>
          </div>
          <form className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-start px-0 pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start w-full">
          {/* Left: Image upload + requirements */}
          <div className="flex flex-col items-center w-full md:w-1/3">
                <label className="block text-lg font-semibold mb-2 w-full text-left">Hình ảnh</label>
                <div className="relative w-60 h-60 bg-gray-100 rounded-xl flex items-center justify-center mb-2 border border-gray-200 overflow-hidden">
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-red-600 mt-2 w-full">
                  <b>*YÊU CẦU:</b>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Camera độ phân giải full HD.</li>
                    <li>Tốc độ khung hình tối thiểu 60 fps.</li>
                    <li>Camera được đặt tại trung tâm mặt bàn hướng từ trên xuống.</li>
                  </ul>
                </div>
              </div>
              {/* Right: Form fields + Branches Section */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thông tin thương hiệu */}
                {brandInfo && (
                  <div className="col-span-2 mb-4 p-4 rounded-xl bg-gray-100 shadow">
                    <div className="flex items-center gap-6">
                    {brandInfo.logo_url ? (
                    <Image
                      src={brandInfo.logo_url}
                      alt="Logo"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                      <div>
                        <div className="text-xl font-bold text-lime-700">{brandInfo.brandName}</div>
                        <div className="text-gray-700">SĐT: {brandInfo.phoneNumber}</div>
                        <div className="text-gray-700">Website: {brandInfo.website || 'Chưa có'}</div>
                        <div className="text-gray-700">CCCD: {brandInfo.citizenCode}</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Thông tin các club/chi nhánh */}
                {clubs.length > 0 && (
                  <div className="col-span-2 mb-4">
                    <div className="text-lg font-bold mb-2 text-lime-700">Danh sách chi nhánh</div>
                    <ul className="space-y-2">
                      {clubs.map(club => (
                        <li key={club.clubId} className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row md:items-center md:gap-8">
                          <div className="font-semibold text-black">{club.clubName}</div>
                          <div className="text-gray-600">Địa chỉ: {club.address}</div>
                          <div className="text-gray-600">SĐT: {club.phoneNumber}</div>
                          <div className="text-gray-600">Số bàn: {club.tableNumber}</div>
                          <div className="text-gray-600">Trạng thái: {club.status}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="col-span-2 mt-4">
                </div>
              </div>
            </div>
          </form>
          <ConfirmPopup
            open={showConfirm}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            title="Xác nhận lưu thông tin"
            confirmText="Lưu"
            cancelText="Hủy"
          >
            <div className="text-center text-black">Bạn có chắc chắn muốn lưu thông tin câu lạc bộ không?</div>
          </ConfirmPopup>
        </main>
      </div>
    </>
  );
} 