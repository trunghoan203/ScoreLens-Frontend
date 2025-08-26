"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { managerTableService } from '@/lib/managerTableService';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

const tableTypes = [
  { value: 'pool-8', label: 'Pool-8' },
  { value: 'carom', label: 'Carom' },
];

export default function AddTablePage() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [type, setType] = useState(tableTypes[0].value);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = t('managerTable.tableNameRequired');
    else if (name.length < 2) newErrors.name = t('managerTable.tableNameMinLength');
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
    try {
      await managerTableService.createTable({ name: name, category: type });
      toast.success(t('managerTable.addSuccess'));
      router.push('/manager/tables');
    } catch (error: any) {
      if (error?.response?.status !== 400) {
        console.error(error);
      }
      const errorMessage = error?.response?.data?.message || t('managerTable.addFailed');
      toast.error(errorMessage);
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
              {t('managerTable.pageTitle')}
            </span>
          </div>
          <AddFormLayout
            title={t('managerTable.addTableTitle')}
            onSubmit={handleSubmit}
            onBack={() => router.push('/manager/tables')}
          >
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('managerTable.tableNameLabel')}<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder={t('managerTable.tableNamePlaceholder')} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">{t('managerTable.tableTypeLabel')}<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-black outline-none appearance-none"
                  required
                >
                  {tableTypes.map(t => (
                    <option className="text-black" key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <Image
                  src="/icon/chevron-down_Black.svg"
                  alt="Dropdown"
                  width={20}
                  height={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 