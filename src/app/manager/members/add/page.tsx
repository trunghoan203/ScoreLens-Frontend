"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { managerMemberService } from '@/lib/managerMemberService';
import { useI18n } from '@/lib/i18n/provider';

export default function AddMemberPage() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = t('managerAddMember.memberNameRequired');
    else if (name.length < 2) newErrors.name = t('managerAddMember.memberNameMinLength');
    if (!phone) newErrors.phone = t('managerAddMember.phoneRequired');
    else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phone)) newErrors.phone = t('managerAddMember.phoneInvalid');
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await managerMemberService.createMember({ fullName: name, phoneNumber: phone });
      toast.success(t('managerAddMember.addSuccess'));
      router.push('/manager/members');
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error && (error.message === 'Số điện thoại đã được sử dụng bởi hội viên khác' || error.message === 'Phone number is already used by another member')) {
        setErrors({ phone: t('managerAddMember.phoneAlreadyUsed') });
      } else {
        toast.error(t('managerAddMember.addFailed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white min-h-screen lg:ml-0">
        <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
          <HeaderManager />
        </div>
        <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6 sm:mb-8">
            <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-widest flex items-center gap-2 sm:gap-3">
              {t('managerAddMember.title')}
            </span>
          </div>
          <AddFormLayout
            title={t('managerAddMember.addMemberTitle')}
            onSubmit={handleSubmit}
            onBack={() => router.push('/manager/members')}
            submitButtonDisabled={isSubmitting}
          >
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('managerAddMember.memberNameLabel')}<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder={t('managerAddMember.memberNamePlaceholder')} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">{t('managerAddMember.phoneLabel')}<span className="text-red-500">*</span></label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} required placeholder={t('managerAddMember.phonePlaceholder')} />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 