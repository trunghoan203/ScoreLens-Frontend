"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { managerCameraService } from '@/lib/managerCameraService';
import { managerTableService } from '@/lib/managerTableService';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface Table {
  tableId: string;
  name: string;
  category: string;
  status: string;
}

export default function AddCameraPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [tables, setTables] = useState<Table[]>([]);
  const [tableId, setTableId] = useState('');
  const [ip, setIp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    managerTableService.getAllTables()
      .then((data) => {
        let tablesArr: unknown[] = [];
        if (Array.isArray(data)) tablesArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { tables?: unknown[] }).tables)) tablesArr = (data as { tables: unknown[] }).tables;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) tablesArr = (data as { data: unknown[] }).data;
        const mappedTables: Table[] = tablesArr.map(t => {
          const obj = t as Partial<Table>;
          return {
            tableId: obj.tableId || '',
            name: obj.name || '',
            category: obj.category ?? 'pool-8',
            status: obj.status ?? 'empty',
          };
        });
        setTables(mappedTables);
      })
      .catch(() => {
        toast.error(t('cameras.cannotLoadTables'));
      });
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!ip) newErrors.ip = t('cameras.ipAddressRequired');
    else if (!/^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/.test(ip)) newErrors.ip = t('cameras.ipAddressInvalid');
    if (!username) newErrors.username = t('cameras.usernameRequired');
    else if (username.length < 2) newErrors.username = t('cameras.usernameMinLength');
    if (!password) newErrors.password = t('cameras.passwordRequired');
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const testResult = await managerCameraService.testConnection({
        IPAddress: ip,
        username,
        password
      });

      setIsChecking(true);

      if (testResult.success) {
        const createResult = await managerCameraService.createCamera({
          tableId,
          IPAddress: ip,
          username,
          password,
          isConnect: true
        }) as any;
        if (createResult.success) {
          toast.success(t('cameras.cameraAddedSuccess'));
          router.push('/manager/camera');
        } else {
          const errorMessage = createResult.message || t('cameras.cannotCreateCamera');
          console.error('Camera creation failed:', createResult);
          toast.error(errorMessage);
        }
      } else {
        toast.error(testResult.message || t('cameras.cannotConnectCamera'));
      }
    } catch (error) {
      console.error('Error in handleCheckCamera:', error);
      const errorMessage = error instanceof Error ? error.message : t('cameras.unknownError');
      toast.error(t('cameras.errorCheckingCamera') + ': ' + errorMessage);
    } finally {
      setIsChecking(false);
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
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6">
            <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-widest flex items-center gap-2 sm:gap-3">
              {t('cameras.manageCamera')}
            </span>
          </div>
          <AddFormLayout
            title={t('cameras.addCameraTitle')}
            onSubmit={handleSubmit}
            onBack={() => router.push('/manager/camera')}
            submitLabel={isChecking ? t('cameras.checking') : t('cameras.test')}
          >
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.table')}<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={tableId}
                  onChange={e => setTableId(e.target.value)}
                  required
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option className="text-black" value="">{t('cameras.selectTablePlaceholder')}</option>
                  {tables.map(table => (
                    <option className="text-black" key={table.tableId} value={table.tableId}>
                      {table.name} - {table.category === 'pool-8' ? t('cameras.formatCategory.pool8') : table.category === 'carom' ? t('cameras.formatCategory.carom') : table.category}
                    </option>
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
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.ipAddress')}<span className="text-red-500">*</span></label>
              <Input value={ip} onChange={e => setIp(e.target.value)} required placeholder={t('cameras.ipAddressPlaceholder')} />
              {errors.ip && <p className="text-red-500 text-sm mt-1">{errors.ip}</p>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.username')}<span className="text-red-500">*</span></label>
              <Input value={username} onChange={e => setUsername(e.target.value)} required placeholder={t('cameras.usernamePlaceholder')} />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.password')}<span className="text-red-500">*</span></label>
              <PasswordInput value={password} onChange={e => setPassword(e.target.value)} required placeholder={t('cameras.passwordPlaceholder')} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 