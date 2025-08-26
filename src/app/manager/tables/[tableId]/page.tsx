"use client";
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import AddFormLayout from '@/components/shared/AddFormLayout';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';
import { managerTableService } from '@/lib/managerTableService';
import QRCode from 'react-qr-code';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

const tableTypes = [
  { value: 'pool-8', label: 'Pool-8' },
  { value: 'carom', label: 'Carom' },
];

interface Table {
  _id: string;
  tableId: string;
  name: string;
  category: string;
  status: string;
  qrCodeData?: string;
  [key: string]: unknown;
}

export default function TableDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tableId = params?.tableId as string;
  const { t } = useI18n();
  const [, setLoading] = useState(true);
  const [, setTable] = useState<Table | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoading(true);
    managerTableService.getAllTables()
      .then((data: unknown) => {
        let tablesArr: unknown[] = [];
        if (Array.isArray(data)) tablesArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { tables?: unknown[] }).tables)) tablesArr = (data as { tables: unknown[] }).tables;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) tablesArr = (data as { data: unknown[] }).data;
        const found = tablesArr.find((t) => {
          const obj = t as Partial<Table>;
          return obj.tableId === tableId || obj._id === tableId;
        });
        if (found) {
          const tableObj = found as Table;
          setTable(tableObj);
          setName(String(tableObj.name));
          setType(tableObj.category);
          setStatus(tableObj.status);
          setQrCodeData(tableObj.qrCodeData || '');
        }
      })
      .catch(() => {
      })
      .finally(() => setLoading(false));
  }, [tableId]);

  const statusOptions = [
    { value: 'empty', label: t('managerTable.statusEmpty') },
    { value: 'inuse', label: t('managerTable.statusInUse') },
    { value: 'maintenance', label: t('managerTable.statusMaintenance') },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = t('managerTable.tableNameRequired');
    else if (name.length < 2) newErrors.name = t('managerTable.tableNameMinLength');
    setErrors(newErrors);
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await managerTableService.updateTable(tableId, { name: name, category: type, status });
      toast.success(t('managerTable.saveSuccess'));
      setIsEditMode(false);
    } catch (error: any) {
      if (error?.response?.status !== 400) {
        console.error(error);
      }
      const errorMessage = error?.response?.data?.message || t('managerTable.saveFailed');
      toast.error(errorMessage);
    }
  };

  const handleEditClick = () => {
    if (status === 'inuse') {
      toast.error(t('managerTable.tableInMatchError'));
      return;
    }
    setIsEditMode(true);
  };

  const handleDelete = async () => {
    try {
      await managerTableService.deleteTable(tableId);
      toast.success(t('managerTable.deleteSuccess'));
      router.push('/manager/tables');
    } catch (error) {
      console.error(error);
      toast.error(t('managerTable.deleteFailed'));
    }
  };

  const handleDeleteClick = () => {
    if (status === 'inuse') {
      toast.error(t('managerTable.tableInMatchError'));
      return;
    }
    setShowConfirm(true);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("QRCode");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new window.Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `QR_Code_${name.replace(/\s/g, '_')}`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      }
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
            title={isEditMode ? t('managerTable.editTableTitle') : t('managerTable.tableDetailsTitle')}
            onBack={() => router.push('/manager/tables')}
            backLabel={t('managerTable.backLabel')}
            submitLabel={isEditMode ? t('managerTable.saveLabel') : t('managerTable.editLabel')}
            extraActions={
              !isEditMode && (
                <button
                  type="button"
                  className="w-full sm:w-32 lg:w-40 bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
                  onClick={handleDeleteClick}
                >
                  {t('managerTable.deleteLabel')}
                </button>
              )
            }
            onSubmit={e => {
              e.preventDefault();
              if (isEditMode) {
                handleSave();
              } else {
                handleEditClick();
              }
            }}
          >
            <ConfirmPopup
              open={showConfirm}
              title={t('managerTable.deleteConfirmTitle')}
              onCancel={() => setShowConfirm(false)}
              onConfirm={async () => {
                setShowConfirm(false);
                await handleDelete();
              }}
              confirmText={t('managerTable.confirmText')}
              cancelText={t('managerTable.cancelText')}
            >
              <></>
            </ConfirmPopup>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('managerTable.tableNameLabel')}<span className="text-red-500">*</span></label>
              <Input value={name} onChange={e => setName(e.target.value)} required disabled={!isEditMode} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="w-full mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-2 text-black">{t('managerTable.tableTypeLabel')}<span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  className="flex w-full border border-gray-300 rounded-md bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all appearance-none"
                  value={type}
                  onChange={e => setType(e.target.value)}
                  required
                  disabled={!isEditMode}
                >
                  {tableTypes.map(t => (
                    <option className="text-black" key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {isEditMode && (
                  <Image
                    src="/icon/chevron-down_Black.svg"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  />
                )}
              </div>
            </div>
            <div className="w-full mb-8 sm:mb-10">
              <label className="block text-sm font-semibold mb-2 text-black">{t('managerTable.statusLabel')}<span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  className="flex w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all appearance-none"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  required
                >
                  {statusOptions.map(s => (
                    <option className="text-black" key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {isEditMode && (
                  <Image
                    src="/icon/chevron-down_Black.svg"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  />
                )}
              </div>
            </div>

            {qrCodeData && (
              <div className="w-full mb-4 sm:mb-6">
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                    <QRCode
                      id="QRCode"
                      value={qrCodeData}
                      size={200}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadQR}
                    className="mt-3 px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    {t('managerTable.downloadQR')}
                  </button>
                </div>
              </div>
            )}
          </AddFormLayout>
        </div>
      </main>
    </div>
  );
} 