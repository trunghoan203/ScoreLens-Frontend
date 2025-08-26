"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import managerService from '@/lib/managerService';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import adminService from '@/lib/adminService';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

export default function AddManagerPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [citizenCode, setCitizenCode] = useState('');
  const [address, setAddress] = useState('');
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!clubId) {
      newErrors.clubId = t('managers.clubIdRequired');
    }
    if (!name) {
      newErrors.name = t('managers.managerNameRequired');
    } else if (name.length < 2) {
      newErrors.name = t('managers.managerNameMinLength');
    } else if (name.length > 255) {
      newErrors.name = t('managers.managerNameMaxLength');
    }
    if (!phone) {
      newErrors.phone = t('managers.phoneRequired');
    } else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phone)) {
      newErrors.phone = t('managers.phoneInvalid');
    }
    if (!dob) {
      newErrors.dob = t('managers.dateOfBirthRequired');
    } else if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dob)) {
      newErrors.dob = t('managers.dateOfBirthInvalid');
    } else {
      const [day, month, year] = dob.split("/").map(Number);
      const dobDate = new Date(year, month - 1, day);
      const today = new Date();

      const isValidDate = dobDate.getFullYear() === year &&
        dobDate.getMonth() === month - 1 &&
        dobDate.getDate() === day;

      if (!isValidDate || dobDate > today) {
        newErrors.dob = t('managers.dateOfBirthInvalidOrFuture');
      }
    }
    if (!email) {
      newErrors.email = t('managers.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('managers.emailInvalid');
    }
    if (!citizenCode) {
      newErrors.citizenCode = t('managers.citizenCodeRequired');
    } else if (!/^\d{12}$/.test(citizenCode)) {
      newErrors.citizenCode = t('managers.citizenCodeLength');
    } else {
      const provinceCode = parseInt(citizenCode.slice(0, 3), 10);
      if (provinceCode < 1 || provinceCode > 96) {
        newErrors.citizenCode = t('managers.citizenCodeProvinceInvalid');
      }
      const genderCentury = parseInt(citizenCode[3], 10);
      if (genderCentury < 0 || genderCentury > 9) {
        newErrors.citizenCode = t('managers.citizenCodeGenderInvalid');
      }
      const yearTwoDigits = parseInt(citizenCode.slice(4, 6), 10);
      if (yearTwoDigits < 0 || yearTwoDigits > 99) {
        newErrors.citizenCode = t('managers.citizenCodeYearInvalid');
      }
    }
    if (!address) {
      newErrors.address = t('managers.addressRequired');
    } else if (address.length < 5) {
      newErrors.address = t('managers.addressMinLength');
    } else if (address.length > 255) {
      newErrors.address = t('managers.addressMaxLength');
    }
    setErrors(newErrors);
    return newErrors;
  };

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const brandId = await adminService.getBrandId();
        if (brandId) {
          const clubsData = await clubsService.getClubsByBrandId(brandId);
          setClubs(clubsData);
        }
      } catch (error) {
        toast.error(t('managers.cannotLoadBranches'));
      }
    };
    fetchClubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await managerService.createManager({
        fullName: name,
        email,
        phoneNumber: phone,
        dateOfBirth: dob,
        citizenCode: citizenCode,
        address,
        clubId,
      });

      toast.success(t('managers.addSuccess'));
      router.push('/admin/managers');
    } catch (error: unknown) {
      console.error('Error creating manager:', error);

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        if (axiosError.response?.data) {
          const responseData = axiosError.response.data as { message?: string; errors?: Record<string, string[]> };

          if (responseData.errors) {
            const newErrors: Record<string, string> = {};
            Object.keys(responseData.errors).forEach(key => {
              if (responseData.errors![key] && Array.isArray(responseData.errors![key])) {
                newErrors[key] = responseData.errors![key][0];
              }
            });
            setErrors(newErrors);
            toast.error(t('managers.pleaseCheckInfo'));
          } else {
            toast.error(responseData.message || t('managers.addFailed'));
          }
        } else {
          toast.error(t('managers.addFailed'));
        }
      } else {
        toast.error(t('managers.addFailed'));
      }
    } finally {
      setLoading(false);
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
              {t('managers.title')}
            </span>
          </div>
          <AddFormLayout
            title={t('managers.addManager')}
            onBack={() => router.push('/admin/managers')}
            backLabel={t('common.back')}
            submitLabel={t('managers.addManager')}
            onSubmit={handleSubmit}
          >
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('managers.selectBranch')}<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={clubId}
                  onChange={e => setClubId(e.target.value)}
                  required
                  name="clubId"
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option value="">{t('managers.selectBranchPlaceholder')}</option>
                  {clubs.map(club => (
                    <option key={club.clubId} value={club.clubId}>{club.clubName}</option>
                  ))}
                </select>
                <Image
                  src="/icon/chevron-down_Black.svg"
                  alt="Dropdown"
                  width={16}
                  height={16}
                  className="sm:w-5 sm:h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
              {errors.clubId && <span className="text-red-500 text-xs sm:text-sm">{errors.clubId}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('managers.managerName')}<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required className="py-2.5 sm:py-3" />
              {errors.name && <span className="text-red-500 text-xs sm:text-sm">{errors.name}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('common.phone')}<span className="text-red-500">*</span></label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} required className="py-2.5 sm:py-3" />
              {errors.phone && <span className="text-red-500 text-xs sm:text-sm">{errors.phone}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('managers.dateOfBirth')}<span className="text-red-500">*</span></label>
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
                placeholder={t('managers.dateFormat')}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-base text-black placeholder-gray-500 hover:border-lime-400 outline-none transition-all focus:border-lime-500"
              />
              {errors.dob && <span className="text-red-500 text-xs sm:text-sm">{errors.dob}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('common.email')}<span className="text-red-500">*</span></label>
              <Input value={email} onChange={e => setEmail(e.target.value)} required className="py-2.5 sm:py-3" />
              {errors.email && <span className="text-red-500 text-xs sm:text-sm">{errors.email}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('managers.citizenCode')}<span className="text-red-500">*</span></label>
              <Input value={citizenCode} onChange={e => setCitizenCode(e.target.value)} required className="py-2.5 sm:py-3" />
              {errors.citizenCode && <span className="text-red-500 text-xs sm:text-sm">{errors.citizenCode}</span>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('common.address')}<span className="text-red-500">*</span></label>
              <Input value={address} onChange={e => setAddress(e.target.value)} required className="py-2.5 sm:py-3" />
              {errors.address && <span className="text-red-500 text-xs sm:text-sm">{errors.address}</span>}
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-black">{t('common.status')}<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={isActive ? 'active' : 'inactive'}
                  onChange={e => setIsActive(e.target.value === 'active')}
                  required
                  name="isActive"
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option value="active">{t('managers.status.active')}</option>
                  <option value="inactive">{t('managers.status.inactive')}</option>
                </select>
                <Image
                  src="/icon/chevron-down_Black.svg"
                  alt="Dropdown"
                  width={16}
                  height={16}
                  className="sm:w-5 sm:h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
}
