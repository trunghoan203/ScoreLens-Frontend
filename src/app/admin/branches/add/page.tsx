"use client";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import clubsService, { Club } from '@/lib/clubsService';
import { useI18n } from '@/lib/i18n/provider';

export default function AddBranchPage() {
  const [clubName, setClubName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableNumber, setTableNumber] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingClubs, setExistingClubs] = useState<any[]>([]);
  const router = useRouter();
  const { t } = useI18n();

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!clubName) {
      newErrors.clubName = t('adminAddBranch.branchNameRequired');
    } else if (clubName.length < 2) {
      newErrors.clubName = t('adminAddBranch.branchNameMinLength');
    } else if (clubName.length > 255) {
      newErrors.clubName = t('adminAddBranch.branchNameMaxLength');
    }
    if (!address) {
      newErrors.address = t('adminAddBranch.addressRequired');
    } else if (address.length < 5) {
      newErrors.address = t('adminAddBranch.addressMinLength');
    } else if (address.length > 255) {
      newErrors.address = t('adminAddBranch.addressMaxLength');
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = t('adminAddBranch.phoneRequired');
    } else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = t('adminAddBranch.phoneInvalid');
    }
    if (tableNumber <= 0) {
      newErrors.tableNumber = t('adminAddBranch.tableNumberMin');
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const clubData: Club = {
        clubName,
        address,
        phoneNumber,
        tableNumber,
        status: 'open'
      };

      await clubsService.createClub(clubData);
      toast.success(t('branches.addSuccess'));
      router.push('/admin/branches');
    } catch (error: any) {
      console.error('Error creating club:', error);
      const errorMessage = error.response?.data?.message || t('errors.general');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
              {t('branches.title')}
            </span>
          </div>
          <AddFormLayout
            title={t('branches.addBranch').toUpperCase()}
            onSubmit={handleSubmit}
            onBack={() => router.push('/admin/branches')}
            submitLabel={isSubmitting ? t('common.loading') : t('branches.addBranch')}
          >
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('branches.branchName')}<span className="text-red-500">*</span></label>
              <Input
                value={clubName}
                onChange={e => setClubName(e.target.value)}
                required
                placeholder={t('branches.branchNamePlaceholder')}
                className="py-2.5 sm:py-3"
              />
              {errors.clubName && <span className="text-red-500 text-xs sm:text-sm">{errors.clubName}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('common.address')}<span className="text-red-500">*</span></label>
              <Input
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  if (errors.address && e.target.value) {
                    setErrors(prev => ({ ...prev, address: '' }));
                  }
                }}
                onBlur={() => {
                  if (address && address.length >= 5) {
                    const isDuplicateAddress = existingClubs.some(club =>
                      club.address.toLowerCase().trim() === address.toLowerCase().trim()
                    );
                    if (isDuplicateAddress) {
                      setErrors(prev => ({ ...prev, address: t('branches.addressExists') }));
                    }
                  }
                }}
                required
                placeholder={t('branches.addressPlaceholder')}
                className="py-2.5 sm:py-3"
              />
              {errors.address && <span className="text-red-500 text-xs sm:text-sm">{errors.address}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('common.phone')}<span className="text-red-500">*</span></label>
              <Input
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
                placeholder={t('branches.phonePlaceholder')}
                className="py-2.5 sm:py-3"
              />
              {errors.phoneNumber && <span className="text-red-500 text-xs sm:text-sm">{errors.phoneNumber}</span>}
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('branches.tableNumber')}<span className="text-red-500">*</span></label>
              <Input
                type="text"
                value={tableNumber}
                onChange={e => setTableNumber(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
                    e.preventDefault();
                  }
                }}
                required
                placeholder={t('branches.tableNumberPlaceholder')}
                min="1"
                className="py-2.5 sm:py-3"
              />
              {errors.tableNumber && <span className="text-red-500 text-xs sm:text-sm">{errors.tableNumber}</span>}
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 