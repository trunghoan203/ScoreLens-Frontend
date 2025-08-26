"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';
import { managerMemberService } from '@/lib/managerMemberService';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface Member {
  membershipId: string;
  fullName: string;
  phoneNumber: string;
  status: 'active' | 'inactive';
  _id?: string;
}

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.memberId as string;
  const { t } = useI18n();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    managerMemberService.getAllMembers()
      .then((data: unknown) => {
        let membersArr: unknown[] = [];
        if (Array.isArray(data)) membersArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { memberships?: unknown[] }).memberships)) membersArr = (data as { memberships: unknown[] }).memberships;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) membersArr = (data as { data: unknown[] }).data;
        const found = membersArr.find((m) => {
          const obj = m as Partial<Member>;
          return obj.membershipId === memberId || obj._id === memberId;
        });
        if (found) {
          const memberObj = found as Partial<Member>;
          setName((memberObj.fullName || '').trim());
          setPhone(memberObj.phoneNumber || '');
          setStatus(memberObj.status || 'active');
        } else {
          toast.error(t('members.memberNotFound'));
        }
      })
      .catch(() => {
        toast.error(t('members.cannotLoadMemberData'));
      });
  }, [memberId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = name.trim();
    if (!trimmedName) newErrors.name = t('members.memberNameRequired');
    else if (trimmedName.length < 2) newErrors.name = t('members.memberNameMinLength');
    if (!phone) newErrors.phone = t('members.phoneRequired');
    else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phone)) newErrors.phone = t('members.phoneInvalid');
    setErrors(newErrors);
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const trimmedName = name.trim();
      await managerMemberService.updateMember(memberId, { fullName: trimmedName, phoneNumber: phone, status });
      toast.success(t('members.updateSuccess'));
      setIsEditMode(false);
      setErrors({});
      setName(trimmedName);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error && error.message === 'Số điện thoại đã được sử dụng bởi hội viên khác') {
        setErrors({ phone: t('members.phoneAlreadyUsed') });
      } else {
        toast.error(t('members.saveMemberFailed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await managerMemberService.deleteMember(memberId);
      toast.success(t('members.deleteSuccess'));
      router.push('/manager/members');
    } catch (error) {
      console.error(error);
      toast.error(t('members.deleteMemberFailed'));
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
              {t('members.memberManagement')}
            </span>
          </div>
          <AddFormLayout
            title={isEditMode ? t('members.editMember') : t('members.memberDetails')}
            onBack={() => router.push('/manager/members')}
            backLabel={t('common.back')}
            submitLabel={isEditMode ? t('common.save') : t('common.edit')}
            submitButtonDisabled={isSubmitting}
            extraActions={
              !isEditMode && (
                <button
                  type="button"
                  className="w-full sm:w-32 lg:w-40 bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
                  onClick={() => setShowConfirm(true)}
                >
                  {t('common.delete')}
                </button>
              )
            }
            onSubmit={e => {
              e.preventDefault();
              if (isEditMode) {
                handleSave();
              } else {
                setIsEditMode(true);
              }
            }}
          >
            <ConfirmPopup
              open={showConfirm}
              title={t('members.deleteConfirm').replace('{name}', name)}
              onCancel={() => setShowConfirm(false)}
              onConfirm={async () => {
                setShowConfirm(false);
                await handleDelete();
              }}
              confirmText={t('common.confirm')}
              cancelText={t('common.cancel')}
            >
              <></>
            </ConfirmPopup>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('members.memberName')}<span className="text-red-500">*</span></label>
              <Input
                value={name}
                onChange={e => {
                  const trimmedValue = e.target.value.trim();
                  setName(trimmedValue);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                required
                disabled={!isEditMode}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('members.memberCode')}<span className="text-red-500">*</span></label>
              <Input
                value={phone}
                onChange={e => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                required
                disabled={!isEditMode}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">{t('common.status')}<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
                  disabled={!isEditMode}
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option value="active">{t('members.status.active')}</option>
                  <option value="inactive">{t('members.status.inactive')}</option>
                </select>
                {isEditMode && (
                  <Image
                    src="/icon/chevron-down_Black.svg"
                    alt="Dropdown"
                    width={20}
                    height={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
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