"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';
import { managerCameraService } from '@/lib/managerCameraService';
import { managerTableService } from '@/lib/managerTableService';
import { CameraRecordButton } from '@/components/manager/CameraRecordButton';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface Table {
  tableId: string;
  name: string;
  category: string;
  status: string;
}

interface Camera {
  cameraId?: string;
  _id?: string;
  tableId?: string;
  IPAddress?: string;
  username?: string;
  password?: string;
  isConnect?: boolean;
}

export default function CameraDetailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const cameraId = params?.cameraId as string;

  const [tables, setTables] = useState<Table[]>([]);
  const [tableId, setTableId] = useState('');
  const [ip, setIp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnect, setIsConnect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCategory = (category: string) => {
    switch (category) {
      case 'pool-8':
        return t('cameras.formatCategory.pool8');
      case 'carom':
        return t('cameras.formatCategory.carom');
      default:
        return category;
    }
  };

  useEffect(() => {
    Promise.all([
      managerCameraService.getAllCameras(),
      managerTableService.getAllTables()
    ])
      .then(([cameraData, tableData]) => {
        let camerasArr: unknown[] = [];
        if (Array.isArray(cameraData)) camerasArr = cameraData;
        else if (cameraData && typeof cameraData === 'object' && Array.isArray((cameraData as { cameras?: unknown[] }).cameras)) camerasArr = (cameraData as { cameras: unknown[] }).cameras;
        else if (cameraData && typeof cameraData === 'object' && Array.isArray((cameraData as { data?: unknown[] }).data)) camerasArr = (cameraData as { data: unknown[] }).data;
        const found = camerasArr.find((c) => {
          const obj = c as Camera;
          return obj.cameraId === cameraId || obj._id === cameraId;
        });
        if (found) {
          const cameraObj = found as Camera;
          setTableId(cameraObj.tableId || '');
          setIp(cameraObj.IPAddress || '');
          setUsername(cameraObj.username || '');
          setPassword(cameraObj.password || '');
          setIsConnect(!!cameraObj.isConnect);
        } else {
          toast.error(t('cameras.cameraNotFound'));
        }
        let tablesArr: unknown[] = [];
        if (Array.isArray(tableData)) tablesArr = tableData;
        else if (tableData && typeof tableData === 'object' && Array.isArray((tableData as { tables?: unknown[] }).tables)) tablesArr = (tableData as { tables: unknown[] }).tables;
        else if (tableData && typeof tableData === 'object' && Array.isArray((tableData as { data?: unknown[] }).data)) tablesArr = (tableData as { data: unknown[] }).data;
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
        toast.error(t('cameras.cannotLoadData'));
      });
  }, [cameraId]);

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

  const handleSave = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await managerCameraService.updateCamera(cameraId, {
        tableId,
        IPAddress: ip,
        username,
        password,
        isConnect
      });
      toast.success(t('cameras.saveSuccess'));
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error(t('cameras.saveFailed'));
    }
  };

  const handleDelete = async () => {
    try {
      await managerCameraService.deleteCamera(cameraId);
      toast.success(t('cameras.deleteSuccess'));
      router.push('/manager/camera');
    } catch (error) {
      console.error(error);
      toast.error(t('cameras.deleteFailed'));
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
            title={isEditMode ? t('cameras.editCameraTitle') : t('cameras.cameraDetailsTitle')}
            onBack={() => router.push('/manager/camera')}
            backLabel={t('common.back')}
            submitLabel={isEditMode ? t('common.save') : t('common.edit')}
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
              title={t('cameras.deleteConfirm').replace('{name}', '')}
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
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.table')}<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={tableId}
                  onChange={e => setTableId(e.target.value)}
                  required
                  disabled={!isEditMode}
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  {tables.map(table => (
                    <option className="text-black" key={table.tableId} value={table.tableId}>
                      {table.name} - {formatCategory(table.category)}
                    </option>
                  ))}
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
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.ipAddress')}<span className="text-red-500">*</span></label>
              <Input value={ip} onChange={e => setIp(e.target.value)} required disabled={!isEditMode} />
              {errors.ip && <p className="text-red-500 text-sm mt-1">{errors.ip}</p>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.username')}<span className="text-red-500">*</span></label>
              <Input value={username} onChange={e => setUsername(e.target.value)} required disabled={!isEditMode} />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.password')}<span className="text-red-500">*</span></label>
              <PasswordInput value={password} onChange={e => setPassword(e.target.value)} required disabled={!isEditMode} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">{t('cameras.connectionStatus')}<span className="text-red-500">*</span></label>
              <div className="relative w-full">
                <select
                  value={isConnect ? 'true' : 'false'}
                  onChange={e => setIsConnect(e.target.value === 'true')}
                  required
                  disabled={!isEditMode}
                  className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-black outline-none focus:outline-none focus:border-lime-500 hover:border-lime-400 appearance-none"
                >
                  <option className="text-black" value="true">{t('cameras.connected')}</option>
                  <option className="text-black" value="false">{t('cameras.notConnected')}</option>
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

          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Camera Recording & AI Analysis</h2>
            


            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Record Camera</h3>
              <CameraRecordButton
                cameraId={cameraId}
                duration={20}
                onSuccess={(result) => {
                }}
                onError={(error) => {
                }}
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
} 