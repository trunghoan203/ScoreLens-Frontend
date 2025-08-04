"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clubsService, { ClubResponse } from '@/lib/clubsService';
import brandService from '@/lib/brandService';

interface AdminInfo {
  fullName: string;
  email: string;
  brandId?: string;
  status?: string;
  rejectedReason?: string;
}

interface BrandInfo {
  name: string;
  phoneNumber?: string;
  website?: string;
  logoUrl?: string;
}

export default function AdminRejectedPage() {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("rejectedAdminInfo");
    if (data) {
      const adminInfo = JSON.parse(data) as AdminInfo;
      setAdmin(adminInfo);
      if (adminInfo.brandId) {
        // Gọi API lấy brand và clubs
        brandService.getBrandById(adminInfo.brandId).then((brandData: any) => {
          setBrand({
            name: brandData?.name || '',
            phoneNumber: brandData?.phoneNumber,
            website: brandData?.website,
            logoUrl: brandData?.logoUrl,
          });
        });
        clubsService.getClubsByBrandId(adminInfo.brandId).then((clubsData: any) => {
          setClubs(clubsData || []);
        });
      }
    }
  }, []);

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Không tìm thấy thông tin admin bị từ chối.</div>
        <button className="mt-4 px-4 py-2 bg-lime-500 text-white rounded" onClick={() => router.push("/admin/login")}>Quay lại đăng nhập</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">Tài khoản của bạn đã bị từ chối</h1>
        <div className="mb-4 text-center text-gray-700">
          <div><b>Họ tên:</b> {admin.fullName}</div>
          <div><b>Email:</b> {admin.email}</div>
          {brand && <div><b>Thương hiệu:</b> {brand.name}</div>}
          {brand?.phoneNumber && <div><b>Số điện thoại:</b> {brand.phoneNumber}</div>}
          {brand?.website && <div><b>Website:</b> {brand.website}</div>}
        </div>
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">Lý do bị từ chối:</div>
          <div className="text-red-500 text-base">{admin.rejectedReason || "Không có lý do cụ thể."}</div>
        </div>
        {clubs.length > 0 && (
          <div className="mb-6">
            <div className="text-lg font-semibold text-gray-800 mb-2 text-center">Danh sách chi nhánh đã đăng ký:</div>
            <ul className="text-gray-700 text-sm list-disc pl-6">
              {clubs.map(club => (
                <li key={club._id || club.clubId}>
                  <b>{club.clubName}</b> - {club.address}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className="w-full py-3 bg-lime-500 text-white rounded-lg font-semibold hover:bg-lime-600 transition" onClick={() => router.push("/admin/login")}>Quay lại đăng nhập</button>
      </div>
    </div>
  );
}