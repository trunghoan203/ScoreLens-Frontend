import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { ConfirmPopupDetail } from '@/components/admin/ConfirmPopupDetail'
import Image from 'next/image';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';
import adminService from '@/lib/adminService';
import { X, Plus, Image as LucideImage } from 'lucide-react';
import { useI18n } from '@/lib/i18n/provider';

interface BrandInfo {
  brandId: string;
  brandName: string;
  phoneNumber: string;
  website?: string;
  logo_url?: string;
  citizenCode: string;
}

interface Club {
  id?: string;
  name: string;
  address: string;
  deviceCount: string;
  phone: string;
}

interface ClubInfoFormProps {
  onSuccess: (data: Club[]) => void;
  onChange?: (data: Club[]) => void;
  brandInfo: BrandInfo | null;
  onBack: () => void;
  initialClubs?: Club[];
  mode?: 'create' | 'edit';
  onSaveClub?: (clubId: string, clubData: { clubName: string; address: string; phoneNumber: string; tableNumber: number }) => Promise<void>;
  onCreateClub?: (clubData: { clubName: string; address: string; phoneNumber: string; tableNumber: number }) => Promise<string>;
  onDeleteClub?: (clubId: string) => Promise<void>;
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col py-2 border-b border-gray-100">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold break-words">
      {value}
    </span>
  </div>
);

export function ClubInfoForm({
  onSuccess, onChange, brandInfo, onBack, initialClubs, mode = 'create',
  onSaveClub, onCreateClub, onDeleteClub
}: ClubInfoFormProps) {
  const { t } = useI18n();
  const [clubs, setClubs] = useState<Club[]>(
    initialClubs && initialClubs.length > 0
      ? initialClubs
      : [{ name: '', address: '', deviceCount: '', phone: '' }]
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savingClubs, setSavingClubs] = useState<Set<string>>(new Set());
  const [editingClubs, setEditingClubs] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingClubId, setDeletingClubId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialClubs && initialClubs.length > 0) {
      setClubs(initialClubs);
    }
  }, [initialClubs]);

  const handleClubChange = (idx: number, field: keyof Club, value: string) => {
    const updatedClubs = clubs.map((b, i) => i === idx ? { ...b, [field]: value } : b);
    setClubs(updatedClubs);
    onChange?.(updatedClubs);
  };

  const handleAddClub = () => {
    const updatedClubs = [...clubs, { id: undefined, name: '', address: '', deviceCount: '', phone: '' }];
    setClubs(updatedClubs);
    onChange?.(updatedClubs);
  };

  const handleRemoveClub = (idx: number) => {
    const club = clubs[idx];
    if (club.id && onDeleteClub) {
      setDeletingClubId(club.id);
      setShowDeleteConfirm(true);
    } else {
      const updatedClubs = clubs.filter((_, i) => i !== idx);
      setClubs(updatedClubs);
      onChange?.(updatedClubs);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingClubId || !onDeleteClub) return;

    setShowDeleteConfirm(false);
    try {
      await onDeleteClub(deletingClubId);
      const updatedClubs = clubs.filter(b => b.id !== deletingClubId);
      setClubs(updatedClubs);
      onChange?.(updatedClubs);
      toast.success(t('clubInfoForm.deleteSuccess'));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || t('clubInfoForm.deleteFailed');
      toast.error(message);
    } finally {
      setDeletingClubId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingClubId(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    clubs.forEach((club, idx) => {
      if (!club.name) newErrors[`name-${idx}`] = t('clubInfoForm.clubNameRequired');
      if (!club.address) newErrors[`address-${idx}`] = t('clubInfoForm.addressRequired');
      if (!club.deviceCount) newErrors[`deviceCount-${idx}`] = t('clubInfoForm.tableCountRequired');
      if (!club.phone) newErrors[`phone-${idx}`] = t('clubInfoForm.phoneRequired');
      else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(club.phone)) newErrors[`phone-${idx}`] = t('clubInfoForm.phoneInvalid');
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);

    try {
      if (mode === 'edit') {
        onSuccess(clubs);
        setIsLoading(false);
        return;
      }
      let brandId = brandInfo?.brandId;

      if (!brandId) {
        const brandResponse = await axios.post('/admin/brands', {
          brandName: brandInfo?.brandName,
          phoneNumber: brandInfo?.phoneNumber,
          website: brandInfo?.website || undefined,
          logo_url: brandInfo?.logo_url,
          citizenCode: brandInfo?.citizenCode,
        });
        const brandData = brandResponse.data as { brandId?: string; _id?: string };
        brandId = brandData.brandId || brandData._id || '';

        if (brandInfo) brandInfo.brandId = brandId;
      }

      const clubsData = clubs.map(club => ({
        clubName: club.name,
        address: club.address,
        phoneNumber: club.phone,
        tableNumber: parseInt(club.deviceCount) || 0,
        status: 'open'
      }));

      await axios.post('/admin/clubs', clubsData);
      toast.success(t('clubInfoForm.createBrandAndClubSuccess'));
      try {
        await adminService.updateStatus();
      } catch {
        toast.error(t('clubInfoForm.cannotUpdateStatus'));
      }

      if (brandId && brandId !== brandInfo?.brandId) {
        if (brandInfo) brandInfo.brandId = brandId;
      }

      onSuccess(clubs);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || t('clubInfoForm.operationFailed');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleSaveClub = async (idx: number) => {
    const club = clubs[idx];
    if (!onSaveClub && !onCreateClub) return;

    const clubData = {
      clubName: club.name,
      address: club.address,
      phoneNumber: club.phone,
      tableNumber: parseInt(club.deviceCount) || 0,
    };

    const clubId = club.id || `new-${idx}`;
    setSavingClubs(prev => new Set(prev).add(clubId));

    try {
      if (club.id && onSaveClub) {
        await onSaveClub(club.id, clubData);
        toast.success(t('clubInfoForm.updateSuccess'));
      } else if (!club.id && onCreateClub) {
        const newClubId = await onCreateClub(clubData);
        const updatedClubs = clubs.map((b, i) => i === idx ? { ...b, id: newClubId } : b);
        setClubs(updatedClubs);
        onChange?.(updatedClubs);
        toast.success(t('clubInfoForm.createSuccess'));
      }

      setEditingClubs(prev => {
        const newSet = new Set(prev);
        newSet.delete(clubId);
        return newSet;
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || (club.id ? t('clubInfoForm.updateFailed') : t('clubInfoForm.createFailed'));
      toast.error(message);
    } finally {
      setSavingClubs(prev => {
        const newSet = new Set(prev);
        newSet.delete(clubId);
        return newSet;
      });
    }
  };

  const handleEditToggle = (idx: number) => {
    const club = clubs[idx];
    const clubId = club.id || `new-${idx}`;

    if (editingClubs.has(clubId)) {
      handleSaveClub(idx);
    } else {
      setEditingClubs(prev => new Set(prev).add(clubId));
    }
  };

  const isFormValid = clubs.every(club =>
    club.name && club.address && club.deviceCount && club.phone
  );

  return (
    <>
      <form className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 items-start px-4 sm:px-6 lg:px-0 pb-8" onSubmit={handleSubmit} noValidate>
        <div className="w-full">
          <div className="mb-4 sm:mb-6">
            <Button
              type="button"
              className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
              style={{
                background: '#ECFCCB',
                border: '1.5px solid #A3E635',
                color: '#365314',
                fontWeight: 700,
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: '0 1px 4px 0 rgba(163,230,53,0.10)'
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#D9F99D';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px 0 rgba(163,230,53,0.18)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#ECFCCB';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px 0 rgba(163,230,53,0.10)';
              }}
              onClick={onBack}
            >
              {t('clubInfoForm.backToPrevious')}
            </Button>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">{t('clubInfoForm.title')}</h2>

          <div className="space-y-4 sm:space-y-6">
            {clubs.map((club, idx) => (
              <div
                key={idx}
                className="relative p-4 sm:p-6 border rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg w-full"
              >
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-1 sm:gap-2">
                  {clubs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveClub(idx)}
                      className="p-1.5 sm:p-2 rounded-full bg-red-50 hover:bg-red-200 text-red-500 border border-red-200 shadow-sm transition touch-manipulation"
                      aria-label={t('clubInfoForm.removeClub')}
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  {idx === clubs.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddClub}
                      className="p-1.5 sm:p-2 rounded-full bg-lime-50 hover:bg-lime-200 text-lime-600 border border-lime-200 shadow-sm transition touch-manipulation"
                      aria-label={t('clubInfoForm.addClub')}
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>

                <div className="mb-4 pr-16 sm:pr-20">
                  <span className="text-sm sm:text-base font-semibold text-lime-600">{t('clubInfoForm.club')} {idx + 1}</span>
                </div>

                <div className="space-y-4">
                  {/* Tên chi nhánh - full width */}
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                      {t('clubInfoForm.clubNameLabel')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={club.name}
                      onChange={e => handleClubChange(idx, 'name', e.target.value)}
                      placeholder={t('clubInfoForm.clubNamePlaceholder')}
                      required
                      disabled={club.id ? !editingClubs.has(club.id) : false}
                      className={`${club.id ? (editingClubs.has(club.id) ? '' : '!bg-gray-100 text-gray-500') : ''} w-full text-sm sm:text-base`}
                    />
                    {errors[`name-${idx}`] && <div className="text-red-500 text-xs mt-1">{errors[`name-${idx}`]}</div>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                        {t('clubInfoForm.tableCountLabel')} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={club.deviceCount}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          handleClubChange(idx, 'deviceCount', val);
                        }}
                        placeholder={t('clubInfoForm.tableCountPlaceholder')}
                        required
                        min="1"
                        disabled={club.id ? !editingClubs.has(club.id) : false}
                        className={`${club.id ? (editingClubs.has(club.id) ? '' : '!bg-gray-100 text-gray-500') : ''} w-full text-sm sm:text-base`}
                      />
                      {errors[`deviceCount-${idx}`] && <div className="text-red-500 text-xs mt-1">{errors[`deviceCount-${idx}`]}</div>}
                    </div>

                    <div className="w-full sm:col-span-1 lg:col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                        {t('clubInfoForm.addressLabel')} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={club.address}
                        onChange={e => handleClubChange(idx, 'address', e.target.value)}
                        placeholder={t('clubInfoForm.addressPlaceholder')}
                        required
                        disabled={club.id ? !editingClubs.has(club.id) : false}
                        className={`${club.id ? (editingClubs.has(club.id) ? '' : '!bg-gray-100 text-gray-500') : ''} w-full text-sm sm:text-base`}
                      />
                      {errors[`address-${idx}`] && <div className="text-red-500 text-xs mt-1">{errors[`address-${idx}`]}</div>}
                    </div>

                    <div className="w-full sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                        {t('clubInfoForm.phoneLabel')} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={club.phone}
                        onChange={e => handleClubChange(idx, 'phone', e.target.value)}
                        placeholder={t('clubInfoForm.phonePlaceholder')}
                        required
                        disabled={club.id ? !editingClubs.has(club.id) : false}
                        className={`${club.id ? (editingClubs.has(club.id) ? '' : '!bg-gray-100 text-gray-500') : ''} w-full text-sm sm:text-base`}
                      />
                      {errors[`phone-${idx}`] && <div className="text-red-500 text-xs mt-1">{errors[`phone-${idx}`]}</div>}
                    </div>
                  </div>
                </div>

                {mode === 'edit' && (
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-6">
                    <button
                      type="button"
                      onClick={() => handleEditToggle(idx)}
                      disabled={savingClubs.has(club.id || `new-${idx}`)}
                      className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-md bg-lime-500 hover:bg-lime-600 text-white text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition touch-manipulation order-1 sm:order-2"
                    >
                      {savingClubs.has(club.id || `new-${idx}`)
                        ? t('clubInfoForm.saving')
                        : club.id
                          ? (editingClubs.has(club.id) ? t('clubInfoForm.save') : t('clubInfoForm.edit'))
                          : t('clubInfoForm.createNew')
                      }
                    </button>
                    {club.id && editingClubs.has(club.id) && (
                      <button
                        type="button"
                        onClick={() => {
                          const clubId = club.id;
                          if (!clubId) return;
                          setEditingClubs(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(clubId);
                            return newSet;
                          });
                          if (initialClubs) {
                            const originalClub = initialClubs.find(b => b.id === club.id);
                            if (originalClub) {
                              const updatedClubs = clubs.map((b, i) =>
                                i === idx ? originalClub : b
                              );
                              setClubs(updatedClubs);
                              onChange?.(updatedClubs);
                            }
                          }
                        }}
                        className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-medium transition touch-manipulation order-2 sm:order-1"
                      >
                        {t('clubInfoForm.cancel')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {mode !== 'edit' && (
            <div className="mt-6 sm:mt-8">
              <Button
                type="submit"
                variant="lime"
                className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold"
                disabled={!isFormValid || isLoading}
              >
                {isLoading
                  ? (initialClubs && initialClubs.length > 0 ? t('clubInfoForm.updating') : t('clubInfoForm.preparing'))
                  : (initialClubs && initialClubs.length > 0 ? t('clubInfoForm.updateAndContinue') : t('clubInfoForm.confirmInfo'))
                }
              </Button>
            </div>
          )}
        </div>
      </form>

      <ConfirmPopupDetail
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={t('clubInfoForm.confirmTitle')}
        confirmText={isLoading ? t('clubInfoForm.creating') : t('clubInfoForm.confirmText')}
        cancelText={t('clubInfoForm.cancelText')}
      >
        <div className="space-y-6 w-full overflow-x-hidden [&_*]:min-w-0">
          {brandInfo && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">{t('clubInfoForm.brandInfoTitle')}</h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border">
                  {brandInfo.logo_url ? (
                    <Image
                      src={brandInfo.logo_url}
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
                  <InfoRow label={t('clubInfoForm.brandName')} value={brandInfo.brandName} />
                  <InfoRow label={t('clubInfoForm.phoneNumber')} value={brandInfo.phoneNumber} />
                  <InfoRow label={t('clubInfoForm.website')} value={brandInfo.website || t('clubInfoForm.noWebsite')} />
                  <InfoRow label={t('clubInfoForm.citizenCode')} value={brandInfo.citizenCode} />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('clubInfoForm.clubInfoTitle')}</h3>
            {clubs.map((club: Club, idx: number) => (
              <div key={idx} className="relative p-4 border rounded-lg bg-gray-50 text-sm mt-4">
                <p className="font-bold text-base text-gray-900 mb-3">
                  <span className="text-lime-600">●</span> {t('clubInfoForm.club')} {idx + 1}: {club.name}
                </p>
                <div className="space-y-2">
                  <InfoRow label={t('clubInfoForm.address')} value={club.address} />
                  <InfoRow label={t('clubInfoForm.tableCount')} value={club.deviceCount} />
                  <InfoRow label={t('clubInfoForm.phone')} value={club.phone} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ConfirmPopupDetail>

      <ConfirmPopup
        open={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title={t('clubInfoForm.deleteConfirmTitle')}
        confirmText={t('clubInfoForm.deleteConfirmText')}
        cancelText={t('clubInfoForm.cancelText')}
      >
        <p className="text-sm text-gray-800 text-center">{t('clubInfoForm.deleteConfirmMessage')}</p>
      </ConfirmPopup>
    </>
  );
}
