"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ConfirmPopup } from "@/components/ui/ConfirmPopup";
import { ScoreLensLoading } from "@/components/ui/ScoreLensLoading";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import toast from "react-hot-toast";
import brandService, { Brand } from "@/lib/brandService";
import adminService from "@/lib/adminService";
import clubsService, { ClubResponse } from "@/lib/clubsService";
import { Image as LucideImage, X, Plus } from 'lucide-react';

interface BranchForm {
  name: string;
  address: string;
  tableCount: string;
  cameraCount: string;
}

export default function ClubInfoPage() {
  const [clubName, setClubName] = useState("");
  const [website, setWebsite] = useState("");
  const [cccd, setCccd] = useState("");
  const [phone, setPhone] = useState("");
  const [branches, setBranches] = useState<BranchForm[]>([
    { name: "", address: "", tableCount: "", cameraCount: "" },
  ]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  // Dữ liệu gốc từ API
  const [brandInfo, setBrandInfo] = useState<Brand | null>(null);
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [isEditing, setIsEditing] = useState(false); // <--- Thêm state này

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const brandId = await adminService.getBrandId();
        if (brandId) {
          const brand = await brandService.getBrandById(brandId);
          setBrandInfo(brand);
          setClubName(brand.brandName || "");
          setWebsite(brand.website || "");
          setCccd(brand.citizenCode || "");
          setPhone(brand.phoneNumber || "");
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
          // Map dữ liệu chi nhánh từ API vào form
          if (clubsData.length > 0) {
            setBranches(
              clubsData.map((club) => ({
                name: club.clubName || "",
                address: club.address || "",
                tableCount: club.tableNumber?.toString() || "",
                cameraCount: "", // Không có trường cameraCount trong API, để trống
              }))
            );
          }
        }
      } catch {
        toast.error("Không thể tải thông tin brand hoặc club");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBranchChange = (idx: number, field: keyof BranchForm, value: string) => {
    setBranches((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b))
    );
  };

  const handleAddBranch = () => {
    setBranches((prev) => [
      ...prev,
      { name: "", address: "", tableCount: "", cameraCount: "" },
    ]);
  };

  const handleRemoveBranch = (idx: number) => {
    setBranches((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setSubmitLoading(true);
    setTimeout(() => {
      setSubmitLoading(false);
      setShowConfirm(true);
    }, 1200);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    toast.success("Đã lưu thông tin câu lạc bộ!");
    setIsEditing(false); // <--- Sau khi lưu xong, quay lại chế độ chỉ xem
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
          <form
            className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-start px-0 pb-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col md:flex-row gap-8 items-start w-full">
              {/* Left: Image upload + requirements */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <label className="block text-lg font-semibold mb-2 w-full text-left">Hình ảnh</label>
                {brandInfo?.logo_url ? (
  <div className="w-64 h-64 mb-4 relative rounded-full overflow-hidden border border-gray-200 shadow">
    <Image
      src={brandInfo.logo_url}
      alt="Logo"
      fill
      className="object-cover rounded-full"
    />
  </div>
) : (
  <div className="w-32 h-32 mb-4 flex items-center justify-center bg-white border rounded-full shadow">
    <LucideImage className="w-10 h-10 text-gray-400" />
  </div>
)}
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
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Câu Lạc Bộ</label>
                  <Input value={clubName} onChange={e => setClubName(e.target.value)} placeholder="Nhập tên câu lạc bộ..." required disabled={!isEditing} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                  <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Nhập website..." disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span></label>
                  <Input value={cccd} onChange={e => setCccd(e.target.value)} placeholder="Nhập CCCD ..." required disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số Điện Thoại</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập SĐT ..." disabled={!isEditing} />
                </div>
                {/* Branches Section nằm trong col-span-2, rộng ngang input lớn */}
                <div className="col-span-2">
                  <div className="w-full mt-8 space-y-4">
                    {branches.map((branch, idx) => (
                      <div
                        key={idx}
                        className="relative p-6 border rounded-xl bg-white shadow-md mb-6 transition-shadow hover:shadow-lg"
                      >
                        {/* Nút thao tác */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          {branches.length > 1 && (
                            <button
                              type="button"
                              onClick={() => isEditing && handleRemoveBranch(idx)}
                              className={`p-1.5 rounded-full bg-red-50 hover:bg-red-200 text-red-500 border border-red-200 shadow-sm transition ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                              aria-label="Xóa chi nhánh"
                              disabled={!isEditing}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          {idx === branches.length - 1 && (
                            <button
                              type="button"
                              onClick={() => isEditing && handleAddBranch()}
                              className={`p-1.5 rounded-full bg-lime-50 hover:bg-lime-200 text-lime-600 border border-lime-200 shadow-sm transition ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                              aria-label="Thêm chi nhánh"
                              disabled={!isEditing}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="mb-4">
                          <span className="text-base font-semibold text-lime-600">Chi nhánh {idx + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Tên chi nhánh <span className="text-red-500">*</span></label>
                            <Input value={branch.name} onChange={e => handleBranchChange(idx, "name", e.target.value)} placeholder="Nhập tên chi nhánh..." required disabled={!isEditing} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                            <Input value={branch.address} onChange={e => handleBranchChange(idx, "address", e.target.value)} placeholder="Nhập địa chỉ..." required disabled={!isEditing} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Số bàn <span className="text-red-500">*</span></label>
                            <Input value={branch.tableCount} onChange={e => handleBranchChange(idx, "tableCount", e.target.value)} placeholder="Nhập số bàn..." required disabled={!isEditing} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Số lượng camera <span className="text-red-500">*</span></label>
                            <Input value={branch.cameraCount} onChange={e => handleBranchChange(idx, "cameraCount", e.target.value)} placeholder="Nhập số lượng camera..." required disabled={!isEditing} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 mt-4">
                  <Button type="submit" variant="lime" fullWidth disabled={submitLoading}>
                    {submitLoading ? <LoadingSpinner size="sm" color="white" text={isEditing ? "Đang lưu..." : ""} /> : (isEditing ? "Lưu thông tin" : "Sửa thông tin")}
                  </Button>
                </div>
              </div>
            </div>
          </form>
          {/* Empty state demo: nếu không có chi nhánh */}
          {branches.length === 0 && (
            <div className="w-full flex justify-center mt-8">
              <LoadingSkeleton type="card" lines={1} className="w-full max-w-md" />
            </div>
          )}
          <ConfirmPopup
            open={showConfirm}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            title="Xác nhận lưu thông tin"
            confirmText="Lưu"
            cancelText="Hủy"
          >
            <div className="text-center">Bạn có chắc chắn muốn lưu thông tin câu lạc bộ không?</div>
          </ConfirmPopup>
        </main>
      </div>
    </>
  );
} 