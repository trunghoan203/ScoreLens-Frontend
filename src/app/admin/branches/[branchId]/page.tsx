"use client";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import adminDashboardService from '@/lib/adminDashboardService';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

export default function BranchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clubId = params?.branchId as string;
  const { t } = useI18n();

  const [club, setClub] = useState<ClubResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableNumber, setTableNumber] = useState(0);
  const [actualTableCount, setActualTableCount] = useState(0);
  const [status, setStatus] = useState<'open' | 'closed' | 'maintenance'>('open');
  const [existingClubs, setExistingClubs] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name || name.trim() === '') {
      newErrors.name = t('branches.detailPage.branchNameRequired') || 'Tên chi nhánh là bắt buộc';
    } else if (name.length < 2) {
      newErrors.name = t('branches.detailPage.nameMinLength');
    } else if (name.length > 255) {
      newErrors.name = t('branches.detailPage.nameMaxLength');
    }
    if (!address || address.trim() === '') {
      newErrors.address = t('branches.detailPage.addressRequired') || 'Địa chỉ là bắt buộc';
    } else if (address.length < 5) {
      newErrors.address = t('branches.detailPage.addressMinLength');
    } else if (address.length > 255) {
      newErrors.address = t('branches.detailPage.addressMaxLength');
    }
    if (!phoneNumber || phoneNumber.trim() === '') {
      newErrors.phoneNumber = t('branches.detailPage.phoneNumberRequired') || 'Số điện thoại là bắt buộc';
    } else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = t('branches.detailPage.phoneInvalid');
    }
    if (tableNumber <= 0) {
      newErrors.tableNumber = t('branches.detailPage.tableNumberMin');
    }
    setErrors(newErrors);
    return newErrors;
  };

  useEffect(() => {
    const loadClub = async () => {
      if (!clubId) {
        toast.error(t('branches.detailPage.invalidClubId'));
        router.push('/admin/branches');
        return;
      }

      try {
        setIsLoading(true);
        const clubData = await clubsService.getClubDetails(clubId);
        setClub(clubData);
        setName(clubData.clubName);
        setAddress(clubData.address);
        setPhoneNumber(clubData.phoneNumber);
        setTableNumber(clubData.tableNumber);
        if (typeof clubData.actualTableCount === 'number') {
          setActualTableCount(clubData.actualTableCount);
        } else {
          try {
            const clubDetail = await adminDashboardService.getClubDetail(clubId);
            setActualTableCount(clubDetail.tables?.length || 0);
          } catch {
            setActualTableCount(0);
          }
        }
        setStatus(clubData.status);
      } catch (error) {
        console.error('Error loading club:', error);
        toast.error(t('branches.detailPage.cannotLoadBranch'));
        router.push('/admin/branches');
      } finally {
        setIsLoading(false);
      }
    };

    loadClub();
  }, [clubId, router]);

  useEffect(() => {
    const fetchExistingClubs = async () => {
      try {
        const clubs = await clubsService.getAllClubs();
        setExistingClubs(clubs);
      } catch (error) {
        console.error('Error fetching existing clubs:', error);
      }
    };
    fetchExistingClubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        return;
      }

      try {
        setIsSaving(true);
        await clubsService.updateClub(clubId, {
          clubName: name,
          address,
          phoneNumber,
          tableNumber,
          status
        });
        toast.success(t('branches.detailPage.updateSuccess'));
        setIsEditMode(false);
        setErrors({});
      } catch (error: unknown) {
        const responseErrors = (error as { response?: { data?: { errors?: Record<string, string[]> } } })?.response?.data?.errors;
        if (responseErrors) {
          const beErrors = responseErrors;
          const newErrors: Record<string, string> = {};
          Object.keys(beErrors).forEach(key => {
            if (beErrors[key] && Array.isArray(beErrors[key])) {
              newErrors[key] = beErrors[key][0];
            }
          });
          setErrors(newErrors);
          toast.error(t('branches.detailPage.pleaseCheckInfo'));
        } else {
          toast.error(t('branches.detailPage.updateFailed'));
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditMode(true);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await clubsService.deleteClub(clubId);
      toast.success(t('branches.detailPage.deleteSuccess'));
      router.push('/admin/branches');
    } catch (error) {
      console.error('Error deleting club:', error);
      toast.error(t('branches.detailPage.deleteFailed'));
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (isLoading) {
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
                {t('branches.detailPage.title')}
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

  if (!club) {
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
                {t('branches.detailPage.title')}
              </span>
            </div>
            <div className="py-8 text-center">
              <div className="text-gray-500">{t('branches.detailPage.branchNotFound')}</div>
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
              {t('branches.detailPage.title')}
            </span>
          </div>
          <AddFormLayout
            title={isEditMode ? t('branches.detailPage.editBranch') : t('branches.detailPage.branchDetails')}
            onBack={() => router.push('/admin/branches')}
            backLabel={t('branches.detailPage.backToBranches')}
            submitLabel={isEditMode ? (isSaving ? t('branches.detailPage.saving') : t('branches.detailPage.save')) : t('branches.detailPage.edit')}
            extraActions={
              !isEditMode && (
                <button
                  type="button"
                  className="w-full sm:w-40 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 sm:py-2 rounded-lg transition text-sm sm:text-lg disabled:opacity-50 touch-manipulation"
                  onClick={() => setShowConfirm(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? t('branches.detailPage.deleting') : t('branches.detailPage.delete')}
                </button>
              )
            }
            onSubmit={handleSubmit}
          >
            <ConfirmPopup
              open={showConfirm}
              title={t('branches.detailPage.deleteConfirm')}
              onCancel={() => setShowConfirm(false)}
              onConfirm={handleDelete}
              confirmText={isDeleting ? t('branches.detailPage.deleting') : t('branches.detailPage.confirm')}
              cancelText={t('branches.detailPage.cancel')}
            >
              <div className="text-center text-black">
                {t('branches.detailPage.deleteConfirmMessage').replace('{name}', club.clubName)}
              </div>
            </ConfirmPopup>

            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('branches.detailPage.branchName')}<span className="text-red-500">*</span></label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={!isEditMode}
                className="py-2.5 sm:py-3"
              />
              {errors.name && <span className="text-red-500 text-xs sm:text-sm">{errors.name}</span>}
            </div>

            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('branches.detailPage.address')}<span className="text-red-500">*</span></label>
              <Input
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  if (errors.address && e.target.value) {
                    setErrors(prev => ({ ...prev, address: '' }));
                  }
                }}
                onBlur={() => {
                  if (isEditMode && address && address.length >= 5) {
                    const isDuplicateAddress = existingClubs.some(club =>
                      club.clubId !== clubId &&
                      club.address.toLowerCase().trim() === address.toLowerCase().trim()
                    );
                    if (isDuplicateAddress) {
                      setErrors(prev => ({ ...prev, address: t('branches.addressExists') }));
                    }
                  }
                }}
                required
                disabled={!isEditMode}
                className="py-2.5 sm:py-3"
              />
              {errors.address && <span className="text-red-500 text-xs sm:text-sm">{errors.address}</span>}
            </div>

            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('branches.detailPage.phoneNumber')}<span className="text-red-500">*</span></label>
              <Input
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
                disabled={!isEditMode}
                className="py-2.5 sm:py-3"
              />
              {errors.phoneNumber && <span className="text-red-500 text-xs sm:text-sm">{errors.phoneNumber}</span>}
            </div>

            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('branches.detailPage.registeredTables')}<span className="text-red-500">*</span></label>
              <Input
                type="number"
                value={tableNumber}
                onChange={e => setTableNumber(Number(e.target.value))}
                required
                disabled={!isEditMode}
                className="py-2.5 sm:py-3"
              />
              {errors.tableNumber && <span className="text-red-500 text-xs sm:text-sm">{errors.tableNumber}</span>}
            </div>

            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('branches.detailPage.actualTables')}<span className="text-red-500">*</span></label>
              <Input
                type="number"
                value={actualTableCount}
                disabled={true}
                className="bg-gray-100 cursor-not-allowed py-2.5 sm:py-3"
              />
              {actualTableCount !== tableNumber && (
                <p className="text-xs text-red-600 italic mt-1 font-medium">
                  {t('branches.detailPage.tableMismatchWarning')}
                </p>
              )}
            </div>

            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('branches.detailPage.status')}</label>
              <div className="relative w-full">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'open' | 'closed' | 'maintenance')}
                  disabled={!isEditMode}
                  className="flex w-full border border-gray-300 rounded-md bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all appearance-none"
                >
                  <option value="open">{t('branches.detailPage.statusOpen')}</option>
                  <option value="closed">{t('branches.detailPage.statusClosed')}</option>
                  <option value="maintenance">{t('branches.detailPage.statusMaintenance')}</option>
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
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 