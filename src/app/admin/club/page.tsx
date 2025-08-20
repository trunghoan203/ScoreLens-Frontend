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
import { uploadAndGetUrl, type SignUrlResponse } from '@/lib/uploadFileService';
import axios from '@/lib/axios';

interface BranchForm {
  name: string;
  address: string;
  tableCount: string;
}

export default function ClubInfoPage() {
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [citizenCode, setCitizenCode] = useState("");
  const [phone, setPhone] = useState("");
  const [branches, setBranches] = useState<BranchForm[]>([{ name: "", address: "", tableCount: "" },]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [brandInfo, setBrandInfo] = useState<Brand | null>(null);
  const [, setClubs] = useState<ClubResponse[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

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
          setCitizenCode(brand.citizenCode || "");
          setPhone(brand.phoneNumber || "");
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
          if (clubsData.length > 0) {
            setBranches(
              clubsData.map((club) => ({
                name: club.clubName || "",
                address: club.address || "",
                tableCount: club.actualTableCount?.toString() || club.tableNumber?.toString() || "0",
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!brandName) newErrors.brandName = "Tên thương hiệu là bắt buộc";
    else if (brandName.length < 2) newErrors.brandName = "Tên thương hiệu phải có ít nhất 2 ký tự";
    if (website) {
      if (!/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(website)) {
        newErrors.website = 'URL không hợp lệ, phải bắt đầu bằng https://';
      }
    }
    if (!citizenCode) {
      newErrors.citizenCode = 'CCCD là bắt buộc';
    } else if (!/^\d{12}$/.test(citizenCode)) {
      newErrors.citizenCode = 'CCCD phải có đúng 12 chữ số';
    } else {
      const provinceCode = parseInt(citizenCode.slice(0, 3), 10);
      if (provinceCode < 1 || provinceCode > 96) {
      newErrors.citizenCode = 'Mã tỉnh/thành phố không hợp lệ';
      }
      const genderCentury = parseInt(citizenCode[3], 10);
      if (genderCentury < 0 || genderCentury > 9) {
      newErrors.citizenCode = 'Mã giới tính/thế kỷ không hợp lệ';
      }
      const yearTwoDigits = parseInt(citizenCode.slice(4, 6), 10);
      if (yearTwoDigits < 0 || yearTwoDigits > 99) {
      newErrors.citizenCode = 'Năm sinh không hợp lệ';
      }
    }
    if (!phone) newErrors.phone = "Số điện thoại là bắt buộc";
    else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowConfirm(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadLogo(file);
    }
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('adminAccessToken');
      const res = await axios.get('/admin/sign-url', {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      const signData: SignUrlResponse = res.data as SignUrlResponse;
      
      const uploadedUrl = await uploadAndGetUrl({
        file,
        sign: signData,
        resourceType: 'image'
      });
      
      if (brandInfo?.brandId) {
        setBrandInfo(prev => prev ? { ...prev, logo_url: uploadedUrl } : null);
      }
      
      toast.success('Upload logo thành công!');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error('Upload thất bại: ' + (error.response?.data?.message || (error as Error).message));
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setSubmitLoading(true);

    try {
      if (brandInfo?.brandId) {
        await updateBrand(brandInfo.brandId, {
          brandName: brandName,
          phoneNumber: phone,
          website: website,
          logo_url: brandInfo.logo_url || '',
          citizenCode: citizenCode,
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
      setCitizenCode(brandInfo.citizenCode || "");
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
                      {isEditing && (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                      )}
                      {isEditing && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200">
                          <LucideImage className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 mb-4 flex items-center justify-center bg-white border rounded-full shadow">
                      {isEditing ? (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                          <LucideImage className="w-10 h-10 text-gray-400" />
                        </>
                      ) : (
                        <LucideImage className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                  )}
                  {uploading && (
                    <div className="mt-2 text-sm text-gray-500">Đang upload...</div>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Thương Hiệu <span className="text-red-500">*</span></label>
                    <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Nhập tên thương hiệu..." required disabled={!isEditing} />
                    {errors.brandName && <span className="text-red-500">{errors.brandName}</span>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                    <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Nhập website..." disabled={!isEditing} />
                    {errors.website && <span className="text-red-500">{errors.website}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span></label>
                    <Input value={citizenCode} onChange={e => setCitizenCode(e.target.value)} placeholder="Nhập CCCD ..." required disabled={!isEditing} />
                    {errors.citizenCode && <span className="text-red-500">{errors.citizenCode}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số Điện Thoại <span className="text-red-500">*</span></label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập SĐT ..." disabled={!isEditing} />
                    {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className={`w-full max-w-6xl mt-6 space-y-4`}>
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
                        <Input value={branch.name} disabled className="disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-200" />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                        <Input value={branch.address} disabled className="disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-200" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Số bàn hiện có <span className="text-red-500">*</span></label>
                        <Input value={branch.tableCount} disabled className="disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-200" />
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