"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchParamsWrapper } from "@/components/shared/SearchParamsWrapper";
import { RegisterSteps } from "@/components/auth/RegisterSteps";
import { ScoreLensLoading } from "@/components/ui/ScoreLensLoading";
import { adminService, AdminProfile } from "@/lib/adminService";
import brandService, { Brand } from "@/lib/brandService";
import clubsService, { ClubResponse } from "@/lib/clubsService";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { BrandInfoForm } from "../register/BrandInfoForm";
import { BranchInfoForm } from "../register/BranchInfoForm";
import { ConfirmPopup } from "@/components/ui/ConfirmPopup";
import Image from "next/image";
import { Image as LucideImage } from "lucide-react";
import axios from "@/lib/axios";
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import toast from "react-hot-toast";

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold text-right">{value}</span>
  </div>
);

export default function ReformPage() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => <ReformPageInner searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
}

function ReformPageInner({ searchParams }: { searchParams: URLSearchParams | null }) {
  const router = useRouter();

  const adminIdFromQuery = searchParams?.get("adminId") || "";

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const [adminProfileState, setAdminProfileState] = useState<AdminProfile | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [clubs, setClubs] = useState<ClubResponse[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  type EditableBrand = {
    brandName: string;
    phoneNumber: string;
    website?: string;
    citizenCode: string;
    logo_url?: string;
  };
  const [editableBrand, setEditableBrand] = useState<EditableBrand | null>(null);
  type EditableClub = {
    clubId?: string;
    clubName: string;
    address: string;
    phoneNumber: string;
    tableNumber: number;
    status: 'open' | 'closed' | 'maintenance';
  };
  const [editableClubs, setEditableClubs] = useState<EditableClub[]>([]);

  const brandInitialMemo = useMemo(() => {
    if (!brand) return null;
    return {
      brandId: brand.brandId || brand._id,
      brandName: brand.brandName,
      phoneNumber: brand.phoneNumber,
      website: brand.website,
      logo_url: brand.logo_url,
      citizenCode: brand.citizenCode,
    };
  }, [brand]);
  
  const branchesInitialMemo = useMemo(() => {
    return clubs.map(c => ({ id: c.clubId, name: c.clubName, address: c.address, deviceCount: String(c.tableNumber), phone: c.phoneNumber }));
  }, [clubs]);

  const redirectUrl = useMemo(() => {
    return `/admin/reform?adminId=${encodeURIComponent(adminIdFromQuery)}`;
  }, [adminIdFromQuery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('adminAccessToken');
    if (!token) {
      const loginUrl = `/admin/login?redirect=${encodeURIComponent(redirectUrl)}`;
      router.replace(loginUrl);
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, redirectUrl]);

  useEffect(() => {
    if (isCheckingAuth) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setWarning(null);
      try {
        const currentProfile = await adminService.getProfile();
        setAdminProfileState(currentProfile);

        if (currentProfile.status == 'approved'){
          router.push('/admin/branches')
        }

        if (currentProfile.status == 'pending'){
          router.push('/admin/pending')
        }

        if (adminIdFromQuery && currentProfile.adminId && adminIdFromQuery !== currentProfile.adminId) {
          setWarning('Tài khoản đăng nhập không khớp với liên kết. Hiển thị dữ liệu của tài khoản hiện tại.');
        }

        const brandId: string | undefined = currentProfile.brandId || undefined;

        if (brandId) {
          const brandData = await brandService.getBrandById(brandId);
          setBrand(brandData);
        
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
        } else {
          setBrand(null);
          setClubs([]);
        }
      } catch (e) {
        const err = e as { response?: { data?: { message?: string } }, message?: string };
        const msg = err?.response?.data?.message || err?.message || 'Không thể tải dữ liệu';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isCheckingAuth, adminIdFromQuery]);

  const handleFinishClick = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmFinish = () => {
    setShowConfirmPopup(false);
    setStep(4);
  };

  const handleCancelFinish = () => {
    setShowConfirmPopup(false);
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteAccountPopup(true);
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const token = localStorage.getItem('adminAccessToken');
      if (!token) {
        toast.error('Không tìm thấy token xác thực');
        return;
      }

      await axios.delete('/admin/delete-account', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Xóa tài khoản thành công');
      localStorage.removeItem('adminAccessToken');
      router.push('/admin/login');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Xóa tài khoản thất bại';
      toast.error(message);
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteAccountPopup(false);
    }
  };

  const handleCancelDeleteAccount = () => {
    setShowDeleteAccountPopup(false);
  };

  return (
    <>
      {(isLoading || isCheckingAuth) && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen bg-white">
      <HeaderAdmin />
        <h1 className="text-3xl md:text-4xl font-bold text-center pt-12 pb-8 text-black">THÔNG TIN BỊ TỪ CHỐI</h1>
        <RegisterSteps currentStep={step} steps={["Thông tin chi tiết", "Thông tin thương hiệu", "Thông tin chi nhánh", "Xác nhận"]} />
        
        <div className="w-full max-w-5xl mx-auto px-4 pb-12">
          {error && (
            <div className="p-4 mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          )}
          {warning && (
            <div className="p-4 mb-6 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800">
              {warning}
            </div>
          )}

          {step === 4 && (
            <div className="w-full max-w-lg mx-auto flex flex-col gap-6 items-center px-0 pb-8 animate-success-fade-in mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-black mt-8 mb-2">BẠN ĐÃ ĐĂNG KÝ THÀNH CÔNG</h2>
              <p className="text-lg text-center text-gray-700 mb-2">Vui lòng chờ chúng tôi chấp nhận yêu cầu đăng ký của bạn!</p>
              <div className="flex justify-center my-6">
              <div className="animate-success-bounce">
                <CheckCircle size={110} strokeWidth={2} className="text-lime-400" fill="none"/>
              </div>
              </div>
              <div className="text-2xl font-bold text-black text-center mb-2 animate-success-pop">Cảm ơn bạn đã đăng ký!</div>
            </div>
          )}

          {step === 1 && adminProfileState && (
            <>
            <div className="space-y-8">

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Thông tin Admin
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <span className="block text-gray-500 mb-1">Họ tên</span>
                    <span className="font-medium text-gray-900">
                      {adminProfileState.fullName || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Email</span>
                    <span className="font-medium text-gray-900">
                      {adminProfileState.email || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Trạng thái</span>
                    <span
                      className={`font-bold ${
                        adminProfileState.status === 'rejected'
                          ? 'text-red-500'
                          : 'text-yellow-600'
                      }`}
                    >
                      {adminProfileState.status === 'rejected'
                        ? 'Đã bị từ chối'
                        : 'Đang chờ duyệt'}
                    </span>
                  </div>
                  {adminProfileState.rejectedReason && (
                    <div className="sm:col-span-2">
                      <span className="block text-gray-500 mb-1">Lý do bị từ chối</span>
                      <span className="font-bold text-red-500">
                        {adminProfileState.rejectedReason}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Thông tin Thương hiệu
                </h2>
                {brand ? (
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-28 h-28 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                      {brand.logo_url ? (
                        <Image
                          src={brand.logo_url}
                          alt="Logo"
                          width={112}
                          height={112}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <LucideImage className="w-10 h-10 text-gray-400" />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1 text-sm">
                      <div>
                        <span className="block text-gray-500 mb-1">Tên thương hiệu</span>
                        <span className="font-medium text-gray-900">{brand.brandName}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">Số điện thoại</span>
                        <span className="font-medium text-gray-900">{brand.phoneNumber}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">Website</span>
                        <span className="font-medium text-gray-900">{brand.website || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">CCCD</span>
                        <span className="font-medium text-gray-900">{brand.citizenCode}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">Chưa có thông tin thương hiệu.</div>
                )}
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Danh sách Chi nhánh
                </h2>

                {clubs && clubs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {clubs.map((club) => (
                      <div
                        key={club._id}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-sm transition-shadow"
                      >
                        <p className="font-medium text-gray-900 mb-3">
                          {club.clubName}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="block text-gray-500 mb-0.5">Địa chỉ</span>
                            <span className="font-medium text-gray-900">{club.address}</span>
                          </div>
                          <div>
                            <span className="block text-gray-500 mb-0.5">Số điện thoại</span>
                            <span className="font-medium text-gray-900">{club.phoneNumber}</span>
                          </div>
                          <div>
                            <span className="block text-gray-500 mb-0.5">Số bàn</span>
                            <span className="font-medium text-gray-900">{club.tableNumber}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">Chưa có chi nhánh nào.</div>
                )}
              </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                  <Button 
                    onClick={handleDeleteAccountClick}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium transition"
                  >
                    Xóa tài khoản
                  </Button>
                  <Button className="bg-lime-500 hover:bg-lime-600 text-white font-medium transition"
                  onClick={() => { setEditMode(true); setStep(2); }}>Chỉnh sửa thông tin đăng ký
                  </Button>
                </div>
            </>
          )}

          {editMode && step === 2 && (
            <BrandInfoForm
              onSuccess={(data) => {
                setEditableBrand({
                  brandName: data.brandName,
                  phoneNumber: data.phoneNumber,
                  website: data.website,
                  citizenCode: data.citizenCode,
                  logo_url: data.logo_url,
                });
                setStep(3);
              }}
              initialData={brandInitialMemo}
            />
          )}

          {editMode && step === 3 && (
            <>
              <BranchInfoForm
                brandInfo={editableBrand ? {
                  brandId: brand?.brandId || brand?._id || '',
                  brandName: editableBrand.brandName,
                  phoneNumber: editableBrand.phoneNumber,
                  website: editableBrand.website,
                  logo_url: editableBrand.logo_url,
                  citizenCode: editableBrand.citizenCode,
                } : brandInitialMemo}
                onBack={() => setStep(2)}
                initialBranches={branchesInitialMemo}
                onChange={(data) => {
                  setEditableClubs(data.map(d => ({ clubId: d.id, clubName: d.name, address: d.address, phoneNumber: d.phone, tableNumber: parseInt(d.deviceCount) || 0, status: 'open' })));
                }}
                onSuccess={(data) => {
                  setEditableClubs(data.map(d => ({ clubId: d.id, clubName: d.name, address: d.address, phoneNumber: d.phone, tableNumber: parseInt(d.deviceCount) || 0, status: 'open' })));
                  setStep(4);
                }}
                onSaveClub={async (clubId, clubData) => {
                  await clubsService.updateClub(clubId, clubData);
                  if (brand?.brandId || brand?._id) {
                    const updatedClubs = await clubsService.getClubsByBrandId(brand.brandId || brand._id);
                    setClubs(updatedClubs);
                  }
                }}
                onCreateClub={async (clubData) => {
                  const newClub = await clubsService.createClub({
                    ...clubData,
                    status: 'open',
                  });
                  if (brand?.brandId || brand?._id) {
                    const updatedClubs = await clubsService.getClubsByBrandId(brand.brandId || brand._id);
                    setClubs(updatedClubs);
                  }
                  return newClub.clubId;
                }}
                onDeleteClub={async (clubId) => {
                  await clubsService.deleteClub(clubId);
                  if (brand?.brandId || brand?._id) {
                    const updatedClubs = await clubsService.getClubsByBrandId(brand.brandId || brand._id);
                    setClubs(updatedClubs);
                  }
                }}
                mode="edit"
              />
              <div className="w-full max-w-4xl mx-auto flex justify-center mt-8">
                <Button 
                  variant="lime" 
                  onClick={handleFinishClick}
                  className="px-8 py-3 text-lg"
                >
                  Hoàn tất
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <ConfirmPopup
        open={showConfirmPopup}
        onConfirm={handleConfirmFinish}
        onCancel={handleCancelFinish}
        title="Xác nhận thông tin đăng ký"
        confirmText="Hoàn tất"
        cancelText="Hủy"
      >
        <div className="space-y-6 w-full">
          {editableBrand && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Thông tin thương hiệu</h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border">
                  {editableBrand.logo_url ? (
                    <Image
                      src={editableBrand.logo_url}
                      alt="Logo"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <LucideImage className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="w-full space-y-2 text-sm">
                  <InfoRow label="Tên thương hiệu" value={editableBrand.brandName} />
                  <InfoRow label="Số điện thoại" value={editableBrand.phoneNumber} />
                  <InfoRow label="Website" value={editableBrand.website || 'N/A'} />
                  <InfoRow label="CCCD" value={editableBrand.citizenCode} />
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Thông tin chi nhánh</h3>
            {editableClubs.map((club, idx) => (
              <div key={idx} className="relative p-4 border rounded-lg bg-gray-50 text-sm mt-4">
                <p className="font-bold text-base text-gray-900 mb-3">
                  <span className="text-lime-600">●</span> Chi Nhánh {idx + 1}: {club.clubName}
                </p>
                <div className="space-y-2">
                  <InfoRow label="Địa chỉ" value={club.address} />
                  <InfoRow label="Số bàn" value={club.tableNumber} />
                  <InfoRow label="Số điện thoại" value={club.phoneNumber} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ConfirmPopup>
      
      <ConfirmPopup
        open={showDeleteAccountPopup}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={handleCancelDeleteAccount}
        title="Xác nhận xóa tài khoản"
        confirmText={isDeletingAccount ? "Đang xóa..." : "Xóa tài khoản"}
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium text-center">
              Xóa tài khoản sẽ xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan bao gồm thông tin thương hiệu và chi nhánh.
              <br />
              Bạn có chắc chắn muốn xóa tài khoản này không?
              <br />
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>
      </ConfirmPopup>
    </>
  );
}