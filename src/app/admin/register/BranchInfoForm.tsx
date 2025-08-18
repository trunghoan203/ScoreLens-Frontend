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

interface BrandInfo {
  brandId: string;
  brandName: string;
  phoneNumber: string;
  website?: string;
  logo_url?: string;
  citizenCode: string;
}

interface Branch {
  id?: string;
  name: string;
  address: string;
  deviceCount: string;
  phone: string;
}

interface BranchInfoFormProps {
  onSuccess: (data: Branch[]) => void;
  onChange?: (data: Branch[]) => void;
  brandInfo: BrandInfo | null;
  onBack: () => void;
  initialBranches?: Branch[];
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

export function BranchInfoForm({
  onSuccess, onChange, brandInfo, onBack, initialBranches, mode = 'create',
  onSaveClub, onCreateClub, onDeleteClub
}: BranchInfoFormProps) {
  const [branches, setBranches] = useState<Branch[]>(
    initialBranches && initialBranches.length > 0
      ? initialBranches
      : [{ name: '', address: '', deviceCount: '', phone: '' }]
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savingClubs, setSavingClubs] = useState<Set<string>>(new Set());
  const [editingBranches, setEditingBranches] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingClubId, setDeletingClubId] = useState<string | null>(null);

  useEffect(() => {
    if (initialBranches && initialBranches.length > 0) {
      setBranches(initialBranches);
    }
  }, [initialBranches]);

  const handleBranchChange = (idx: number, field: keyof Branch, value: string) => {
    const updatedBranches = branches.map((b, i) => i === idx ? { ...b, [field]: value } : b);
    setBranches(updatedBranches);
    onChange?.(updatedBranches);
  };

  const handleAddBranch = () => {
    const updatedBranches = [...branches, { id: undefined, name: '', address: '', deviceCount: '', phone: '' }];
    setBranches(updatedBranches);
    onChange?.(updatedBranches);
  };

  const handleRemoveBranch = (idx: number) => {
    const branch = branches[idx];
    if (branch.id && onDeleteClub) {
      setDeletingClubId(branch.id);
      setShowDeleteConfirm(true);
    } else {
      const updatedBranches = branches.filter((_, i) => i !== idx);
      setBranches(updatedBranches);
      onChange?.(updatedBranches);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingClubId || !onDeleteClub) return;

    setShowDeleteConfirm(false);
    try {
      await onDeleteClub(deletingClubId);
      const updatedBranches = branches.filter(b => b.id !== deletingClubId);
      setBranches(updatedBranches);
      onChange?.(updatedBranches);
      toast.success('Xóa chi nhánh thành công!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Xóa chi nhánh thất bại!';
      toast.error(message);
    } finally {
      setDeletingClubId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingClubId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);

    try {
      if (mode === 'edit') {
        onSuccess(branches);
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

      const clubsData = branches.map(branch => ({
        clubName: branch.name,
        address: branch.address,
        phoneNumber: branch.phone,
        tableNumber: parseInt(branch.deviceCount) || 0,
        status: 'open'
      }));

      await axios.post('/admin/clubs', clubsData);
      toast.success('Tạo thương hiệu và câu lạc bộ thành công!');
      try {
        await adminService.updateStatus();
      } catch {
        toast.error('Không thể cập nhật trạng thái admin về pending.');
      }

      if (brandId && brandId !== brandInfo?.brandId) {
        if (brandInfo) brandInfo.brandId = brandId;
      }

      onSuccess(branches);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleSaveClub = async (idx: number) => {
    const branch = branches[idx];
    if (!onSaveClub && !onCreateClub) return;

    const clubData = {
      clubName: branch.name,
      address: branch.address,
      phoneNumber: branch.phone,
      tableNumber: parseInt(branch.deviceCount) || 0,
    };

    const branchId = branch.id || `new-${idx}`;
    setSavingClubs(prev => new Set(prev).add(branchId));

    try {
      if (branch.id && onSaveClub) {
        await onSaveClub(branch.id, clubData);
        toast.success('Cập nhật chi nhánh thành công!');
      } else if (!branch.id && onCreateClub) {
        const newClubId = await onCreateClub(clubData);
        const updatedBranches = branches.map((b, i) => i === idx ? { ...b, id: newClubId } : b);
        setBranches(updatedBranches);
        onChange?.(updatedBranches);
        toast.success('Tạo chi nhánh thành công!');
      }

      setEditingBranches(prev => {
        const newSet = new Set(prev);
        newSet.delete(branchId);
        return newSet;
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || (branch.id ? 'Cập nhật chi nhánh thất bại!' : 'Tạo chi nhánh thất bại!');
      toast.error(message);
    } finally {
      setSavingClubs(prev => {
        const newSet = new Set(prev);
        newSet.delete(branchId);
        return newSet;
      });
    }
  };

  const handleEditToggle = (idx: number) => {
    const branch = branches[idx];
    const branchId = branch.id || `new-${idx}`;

    if (editingBranches.has(branchId)) {
      handleSaveClub(idx);
    } else {
      setEditingBranches(prev => new Set(prev).add(branchId));
    }
  };

  const isFormValid = branches.every(branch =>
    branch.name && branch.address && branch.deviceCount && branch.phone
  );

  return (
    <>
      <form className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-start px-0 pb-8" onSubmit={handleSubmit}>
        <div className="w-full">
          <div className="mb-4">
            <Button
              type="button"
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
              ← Quay lại bước trước
            </Button>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Thông tin chi nhánh</h2>

          <div className="space-y-6 overflow-x-hidden">
            {branches.map((branch, idx) => (
              <div
                key={idx}
                className="relative p-6 border rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg max-w-full overflow-hidden"
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  {branches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBranch(idx)}
                      className="p-1.5 rounded-full bg-red-50 hover:bg-red-200 text-red-500 border border-red-200 shadow-sm transition"
                      aria-label="Xóa chi nhánh"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {idx === branches.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddBranch}
                      className="p-1.5 rounded-full bg-lime-50 hover:bg-lime-200 text-lime-600 border border-lime-200 shadow-sm transition"
                      aria-label="Thêm chi nhánh"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-base font-semibold text-lime-600">Chi nhánh {idx + 1}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
                  <div className="col-span-3 min-w-0">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Tên Câu Lạc Bộ <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={branch.name}
                      onChange={e => handleBranchChange(idx, 'name', e.target.value)}
                      placeholder="Nhập Tên Chi Nhánh..."
                      required
                      disabled={branch.id ? !editingBranches.has(branch.id) : false}
                      className={`${branch.id ? (editingBranches.has(branch.id) ? '' : '!bg-gray-100 text-gray-500') : ''} w-full truncate`}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Số Bàn <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={branch.deviceCount}
                      onChange={e => handleBranchChange(idx, 'deviceCount', e.target.value)}
                      placeholder="Nhập Số Bàn..."
                      required
                      min="1"
                      disabled={branch.id ? !editingBranches.has(branch.id) : false}
                      className={`${branch.id ? (editingBranches.has(branch.id) ? '' : '!bg-gray-100 text-gray-500') : ''} w-full truncate`}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Địa Chỉ <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={branch.address}
                      onChange={e => handleBranchChange(idx, 'address', e.target.value)}
                      placeholder="Nhập Địa Chỉ"
                      required
                      disabled={branch.id ? !editingBranches.has(branch.id) : false}
                      className={`${branch.id ? (editingBranches.has(branch.id) ? '' : '!bg-gray-100 text-gray-500') : ''} w-full truncate`}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Số Điện Thoại <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={branch.phone}
                      onChange={e => handleBranchChange(idx, 'phone', e.target.value)}
                      placeholder="Nhập Số Điện Thoại..."
                      required
                      disabled={branch.id ? !editingBranches.has(branch.id) : false}
                      className={`${branch.id ? (editingBranches.has(branch.id) ? '' : '!bg-gray-100 text-gray-500') : ''} w-full truncate`}
                    />
                  </div>
                </div>

                {mode === 'edit' && (
                  <div className="flex justify-end gap-2 mt-4">
                    {branch.id && editingBranches.has(branch.id) && (
                      <button
                        type="button"
                        onClick={() => {
                          const branchId = branch.id;
                          if (!branchId) return;
                          setEditingBranches(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(branchId);
                            return newSet;
                          });
                          if (initialBranches) {
                            const originalBranch = initialBranches.find(b => b.id === branch.id);
                            if (originalBranch) {
                              const updatedBranches = branches.map((b, i) =>
                                i === idx ? originalBranch : b
                              );
                              setBranches(updatedBranches);
                              onChange?.(updatedBranches);
                            }
                          }
                        }}
                        className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
                      >
                        Hủy
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditToggle(idx)}
                      disabled={savingClubs.has(branch.id || `new-${idx}`)}
                      className="px-4 py-2 rounded-md bg-lime-500 hover:bg-lime-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {savingClubs.has(branch.id || `new-${idx}`)
                        ? 'Đang lưu...'
                        : branch.id
                          ? (editingBranches.has(branch.id) ? 'Lưu' : 'Chỉnh sửa')
                          : 'Tạo mới'
                      }
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {mode !== 'edit' && (
            <div className="mt-8">
              <Button
                type="submit"
                variant="lime"
                fullWidth
                disabled={!isFormValid || isLoading}
              >
                {isLoading
                  ? (initialBranches && initialBranches.length > 0 ? 'Đang cập nhật...' : 'Đang chuẩn bị...')
                  : (initialBranches && initialBranches.length > 0 ? 'Cập nhật và tiếp tục' : 'Xác nhận thông tin')
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
        title="Xác nhận thông tin đăng ký"
        confirmText={isLoading ? 'Đang tạo...' : 'Xác nhận'}
        cancelText="Hủy"
      >
        <div className="space-y-6 w-full overflow-x-hidden [&_*]:min-w-0">
          {brandInfo && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Thông tin thương hiệu</h3>
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
                  <InfoRow label="Tên thương hiệu" value={brandInfo.brandName} />
                  <InfoRow label="Số điện thoại" value={brandInfo.phoneNumber} />
                  <InfoRow label="Website" value={brandInfo.website || 'N/A'} />
                  <InfoRow label="CCCD" value={brandInfo.citizenCode} />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Thông tin chi nhánh</h3>
            {branches.map((branch: Branch, idx: number) => (
              <div key={idx} className="relative p-4 border rounded-lg bg-gray-50 text-sm mt-4">
                <p className="font-bold text-base text-gray-900 mb-3">
                  <span className="text-lime-600">●</span> Chi Nhánh {idx + 1}: {branch.name}
                </p>
                <div className="space-y-2">
                  <InfoRow label="Địa chỉ" value={branch.address} />
                  <InfoRow label="Số bàn" value={branch.deviceCount} />
                  <InfoRow label="Số điện thoại" value={branch.phone} />
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
        title="Xác nhận xóa chi nhánh"
        confirmText="Xóa"
        cancelText="Hủy"
      >
        <p className="text-sm text-gray-800 text-center">Bạn có chắc chắn muốn xóa chi nhánh này không?</p>
      </ConfirmPopup>
    </>
  );
}
