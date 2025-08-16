"use client";
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
import brandService, { Brand, updateBrand } from "@/lib/brandService";
import adminService from "@/lib/adminService";
import clubsService, { ClubResponse } from "@/lib/clubsService";
import { Image as LucideImage } from 'lucide-react';

interface BranchForm {
  name: string;
  address: string;
  tableCount: string;
}

export default function ClubInfoPage() {
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [cccd, setCccd] = useState("");
  const [phone, setPhone] = useState("");
  const [branches, setBranches] = useState<BranchForm[]>([{ name: "", address: "", tableCount: "" },]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [brandInfo, setBrandInfo] = useState<Brand | null>(null);
  const [, setClubs] = useState<ClubResponse[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const brandId = await adminService.getBrandId();
        if (brandId) {
          const brand = await brandService.getBrandById(brandId);
          setBrandInfo(brand);
          setBrandName(brand.brandName || "");
          setWebsite(brand.website || "");
          setCccd(brand.citizenCode || "");
          setPhone(brand.phoneNumber || "");
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
          if (clubsData.length > 0) {
            setBranches(
              clubsData.map((club) => ({
                name: club.clubName || "",
                address: club.address || "",
                tableCount: club.tableNumber?.toString() || "",
              }))
            );
          }
        }
      } catch {
        toast.error("Không thể tải thông tin thương hiệu hoặc chi nhánh");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setSubmitLoading(true);

    try {
      if (brandInfo?.brandId) {
        await updateBrand(brandInfo.brandId, {
          brandName: brandName,
          numberPhone: phone,
          website: website,
          logo_url: brandInfo.logo_url || '',
          citizenCode: cccd,
        });
        toast.success('Cập nhật thông tin thương hiệu thành công!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('Cập nhật thông tin thương hiệu thất bại!');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleCancelEdit = () => {
    if (brandInfo) {
      setBrandName(brandInfo.brandName || "");
      setWebsite(brandInfo.website || "");
      setCccd(brandInfo.citizenCode || "");
      setPhone(brandInfo.phoneNumber || "");
    }
    setIsEditing(false);
    window.location.reload();
  };

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderAdminPage />
          </div>
          <div className="px-10 pb-10">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
              <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
                THÔNG TIN THƯƠNG HIỆU
              </span>
            </div>
            <form
              className="w-full flex flex-col gap-8 items-center px-0 pb-8"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start w-full max-w-6xl">
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <label className="block text-sm text-gray-700 font-semibold mb-2 w-full text-left ml-12">Hình ảnh</label>
                  {brandInfo?.logo_url ? (
                    <div className="w-60 h-60 relative rounded-full overflow-hidden border border-gray-200 shadow">
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
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Thương Hiệu</label>
                    <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Nhập tên thương hiệu..." required disabled={!isEditing} />
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
                </div>
              </div>

              <div className="w-full max-w-6xl mt-6 space-y-4">
                {branches.map((branch, idx) => (
                  <div
                    key={idx}
                    className="relative p-6 border rounded-xl bg-white shadow-md mb-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="mb-4">
                      <span className="text-base font-semibold text-lime-600">Chi nhánh {idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-5">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tên chi nhánh <span className="text-red-500">*</span></label>
                        <Input value={branch.name} disabled />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                        <Input value={branch.address} disabled />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Số bàn <span className="text-red-500">*</span></label>
                        <Input value={branch.tableCount} disabled />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full mt-4 flex justify-center gap-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleCancelEdit}
                      className="w-36"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="lime"
                      className="w-36"
                      disabled={submitLoading}
                    >
                      {submitLoading ? <LoadingSpinner size="sm" color="white" text="Đang lưu..." /> : "Lưu thông tin"}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="submit"
                    variant="lime"
                    className="w-48"
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </form>
            {branches.length === 0 && (
              <div className="w-full flex justify-center mt-8">
                <LoadingSkeleton type="card" lines={1} className="w-full max-w-md" />
              </div>
            )}
            <ConfirmPopup
              open={showConfirm}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              title="Xác nhận cập nhật"
              confirmText="Cập nhật"
              cancelText="Hủy"
            >
              <div className="text-center">Bạn có chắc chắn muốn cập nhật thông tin thương hiệu không?</div>
            </ConfirmPopup>
          </div>
        </main>
      </div>
    </>
  );
} 