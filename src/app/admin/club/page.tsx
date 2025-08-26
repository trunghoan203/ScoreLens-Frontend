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
import { useI18n } from "@/lib/i18n/provider";

interface BranchForm {
  name: string;
  address: string;
  tableCount: string;
}

export default function ClubInfoPage() {
  const { t } = useI18n();
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
  const [logoChanged, setLogoChanged] = useState(false);

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
          setLogoChanged(false);
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
        toast.error(t('club.cannotLoadInfo'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!brandName) newErrors.brandName = t('club.validation.brandNameRequired');
    else if (brandName.length < 2) newErrors.brandName = t('club.validation.brandNameMinLength');
    if (website) {
      if (!/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(website)) {
        newErrors.website = t('club.validation.invalidUrl');
      }
    }
    if (!citizenCode) {
      newErrors.citizenCode = t('club.validation.citizenCodeRequired');
    } else if (!/^\d{12}$/.test(citizenCode)) {
      newErrors.citizenCode = t('club.validation.citizenCodeLength');
    } else {
      const provinceCode = parseInt(citizenCode.slice(0, 3), 10);
      if (provinceCode < 1 || provinceCode > 96) {
        newErrors.citizenCode = t('club.validation.invalidProvinceCode');
      }
      const genderCentury = parseInt(citizenCode[3], 10);
      if (genderCentury < 0 || genderCentury > 9) {
        newErrors.citizenCode = t('club.validation.invalidGenderCode');
      }
      const yearTwoDigits = parseInt(citizenCode.slice(4, 6), 10);
      if (yearTwoDigits < 0 || yearTwoDigits > 99) {
        newErrors.citizenCode = t('club.validation.invalidYear');
      }
    }
    if (!phone) newErrors.phone = t('club.validation.phoneRequired');
    else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phone)) newErrors.phone = t('club.validation.invalidPhone');
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing) {
      if (brandInfo) {
        setBrandName(brandInfo.brandName || "");
        setWebsite(brandInfo.website || "");
        setCitizenCode(brandInfo.citizenCode || "");
        setPhone(brandInfo.phoneNumber || "");
        setLogoChanged(false);
      }
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
        setLogoChanged(true);
      }

      toast.success(t('club.uploadSuccess'));
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(t('club.uploadFailed') + ': ' + (error.response?.data?.message || (error as Error).message));
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    if (brandInfo?.brandId) {
      const changedFields: Partial<{
        brandName: string;
        phoneNumber: string;
        website: string;
        logo_url: string;
        citizenCode: string;
      }> = {};

      const normalizeValue = (value: string | undefined) => value || '';
      if (normalizeValue(brandName) !== normalizeValue(brandInfo.brandName)) { changedFields.brandName = brandName; }
      if (normalizeValue(phone) !== normalizeValue(brandInfo.phoneNumber)) { changedFields.phoneNumber = phone; }
      if (normalizeValue(website) !== normalizeValue(brandInfo.website)) { changedFields.website = website; }
      if (normalizeValue(citizenCode) !== normalizeValue(brandInfo.citizenCode)) { changedFields.citizenCode = citizenCode; }
      if (logoChanged && brandInfo.logo_url) { changedFields.logo_url = brandInfo.logo_url; }

      if (Object.keys(changedFields).length > 0) {
        setSubmitLoading(true);
        try {
          await updateBrand(brandInfo.brandId, changedFields);
          toast.success(t('club.updateSuccess'));
          setIsEditing(false);
        } catch (error) {
          console.error('Error updating brand:', error);
          toast.error(t('club.updateFailed'));
        } finally {
          setSubmitLoading(false);
        }
      } else {
        toast.success(t('club.noChanges'));
        setIsEditing(false);
      }
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
    setLogoChanged(false);
    setErrors({});
  };

  return (
    <>
      {loading && <ScoreLensLoading text={t('common.loading')} />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen lg:ml-0 overflow-x-hidden">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
            <HeaderAdminPage />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0 w-full">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6 sm:mb-8">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-widest flex items-center gap-2 sm:gap-3">
                {t('club.title')}
              </span>
            </div>
            <form
              className="w-full flex flex-col gap-6 sm:gap-8 items-center px-0 pb-8"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start w-full max-w-6xl mx-auto">
                <div className="flex flex-col items-center w-full lg:w-1/3">
                  <label className="block text-sm text-gray-700 font-semibold mb-2 w-full text-left ml-0 sm:ml-12">{t('club.image')}</label>
                  {brandInfo?.logo_url ? (
                    <div className="w-48 h-48 sm:w-60 sm:h-60 relative rounded-xl overflow-hidden border border-gray-200 shadow">
                      <Image
                        src={brandInfo.logo_url}
                        alt="Logo"
                        fill
                        className="object-cover"
                      />
                      {isEditing && (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200">
                            <LucideImage className="w-5 h-5 text-gray-500" />
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4 flex items-center justify-center bg-white border rounded-xl shadow">
                      {isEditing ? (
                        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={uploading}
                          />
                          <LucideImage className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                          <span className="text-xs text-gray-400 mt-1">{t('club.uploadImage')}</span>
                        </label>
                      ) : (
                        <LucideImage className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      )}
                    </div>
                  )}
                  {uploading && (
                    <div className="mt-2 text-sm text-gray-500">{t('club.uploading')}</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-1">{t('club.brandName')} <span className="text-red-500">*</span></label>
                    <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder={t('club.brandNamePlaceholder')} required disabled={!isEditing} className="py-2.5 sm:py-3 w-full" />
                    {errors.brandName && <span className="text-red-500 text-xs sm:text-sm">{errors.brandName}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-1">{t('club.website')}</label>
                    <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder={t('club.websitePlaceholder')} disabled={!isEditing} className="py-2.5 sm:py-3 w-full" />
                    {errors.website && <span className="text-red-500 text-xs sm:text-sm">{errors.website}</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-1">{t('club.citizenCode')} <span className="text-red-500">*</span></label>
                      <Input value={citizenCode} onChange={e => setCitizenCode(e.target.value)} placeholder={t('club.citizenCodePlaceholder')} required disabled={!isEditing} className="py-2.5 sm:py-3 w-full" />
                      {errors.citizenCode && <span className="text-red-500 text-xs sm:text-sm">{errors.citizenCode}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-1">{t('club.phone')} <span className="text-red-500">*</span></label>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('club.phonePlaceholder')} disabled={!isEditing} className="py-2.5 sm:py-3 w-full" />
                      {errors.phone && <span className="text-red-500 text-xs sm:text-sm">{errors.phone}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`w-full max-w-6xl mt-4 sm:mt-6 space-y-3 sm:space-y-4 mx-auto`}>
                {branches.map((branch, idx) => (
                  <div
                    key={idx}
                    className="relative p-4 sm:p-6 border rounded-xl bg-white shadow-md mb-4 sm:mb-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="mb-3 sm:mb-4">
                      <span className="text-sm sm:text-base font-semibold text-lime-600">{t('club.branch')} {idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                      <div className="col-span-1 lg:col-span-5">
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('club.branchName')} <span className="text-red-500">*</span></label>
                        <Input value={branch.name} disabled className="disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-200 py-2.5 sm:py-3" />
                      </div>
                      <div className="col-span-1 lg:col-span-5">
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('club.address')} <span className="text-red-500">*</span></label>
                        <Input value={branch.address} disabled className="disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-200 py-2.5 sm:py-3" />
                      </div>
                      <div className="col-span-1 lg:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('club.currentTables')} <span className="text-red-500">*</span></label>
                        <Input value={branch.tableCount} disabled className="disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-200 py-2.5 sm:py-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full mt-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-6xl mx-auto">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      variant="lime"
                      className="w-full sm:w-36 touch-manipulation order-1 sm:order-2"
                      disabled={submitLoading}
                    >
                      {submitLoading ? <LoadingSpinner size="sm" color="white" text={t('club.saving')} /> : t('club.saveInfo')}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleCancelEdit}
                      className="w-full sm:w-36 touch-manipulation order-2 sm:order-1"
                    >
                      {t('common.cancel')}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="submit"
                    variant="lime"
                    className="w-full sm:w-48 touch-manipulation"
                  >
                    {t('club.edit')}
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
              title={t('club.confirmUpdate')}
              confirmText={t('club.update')}
              cancelText={t('common.cancel')}
            >
              <div className="text-center text-[#000000]">{t('club.confirmUpdateMessage')}</div>
            </ConfirmPopup>
          </div>
        </main>
      </div>
    </>
  );
}