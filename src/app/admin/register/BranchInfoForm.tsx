import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import Image from 'next/image';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';
import { Plus, Trash2, ImageIcon } from 'lucide-react';

interface BrandInfo {
  brandId: string;
  brandName: string;
  phoneNumber: string;
  website?: string;
  logo_url?: string;
  citizenCode: string;
}

interface Branch {
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
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold text-right">{value}</span>
  </div>
);

export function BranchInfoForm({ onSuccess, onChange, brandInfo, onBack, initialBranches }: BranchInfoFormProps) {
  const [branches, setBranches] = useState<Branch[]>(
    initialBranches && initialBranches.length > 0 
      ? initialBranches 
      : [{ name: '', address: '', deviceCount: '', phone: '' }]
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    const updatedBranches = [...branches, { name: '', address: '', deviceCount: '', phone: '' }];
    setBranches(updatedBranches);
    onChange?.(updatedBranches);
  };

  const handleRemoveBranch = (idx: number) => {
    const updatedBranches = branches.filter((_, i) => i !== idx);
    setBranches(updatedBranches);
    onChange?.(updatedBranches);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);

    try {
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

  const isFormValid = branches.every(branch => branch.name && branch.address && branch.deviceCount && branch.phone);

  return (
    <>
      <form className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-start px-0 pb-8" onSubmit={handleSubmit}>
        <div className="w-full">
          <div className="mb-4">
            <Button type="button" onClick={onBack}>← Quay lại bước trước</Button>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Thông tin chi nhánh</h2>
          <div className="space-y-6">
            {branches.map((branch, idx) => (
              <div key={idx} className="relative p-6 border rounded-xl bg-white shadow-md">
                <div className="absolute top-4 right-4 flex gap-2">
                  {branches.length > 1 && (
                    <button type="button" onClick={() => handleRemoveBranch(idx)} className="p-1.5 rounded-full bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                  {idx === branches.length - 1 && (
                    <button type="button" onClick={handleAddBranch} className="p-1.5 rounded-full bg-lime-50">
                      <Plus className="w-4 h-4 text-lime-600" />
                    </button>
                  )}
                </div>
                <span className="text-base font-semibold text-lime-600 mb-4 block">Chi nhánh {idx + 1}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tên Câu Lạc Bộ</label>
                    <Input value={branch.name} onChange={e => handleBranchChange(idx, 'name', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Số Bàn</label>
                    <Input value={branch.deviceCount} onChange={e => handleBranchChange(idx, 'deviceCount', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Địa Chỉ</label>
                    <Input value={branch.address} onChange={e => handleBranchChange(idx, 'address', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Số Điện Thoại</label>
                    <Input value={branch.phone} onChange={e => handleBranchChange(idx, 'phone', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Số Camera</label>
                    <Input value={branch.deviceCount} onChange={e => handleBranchChange(idx, 'deviceCount', e.target.value)} required />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-red-600 mt-2 w-full">
            <b>*YÊU CẦU:</b>
            <ul className="list-disc ml-4 mt-1">
              <li>Camera độ phân giải full HD.</li>
              <li>Tốc độ khung hình tối thiểu 60 fps.</li>
              <li>Camera được đặt tại trung tâm mặt bàn hướng từ trên xuống.</li>
            </ul>
          </div>
          <div className="mt-8">
            <Button type="submit" disabled={!isFormValid || isLoading} variant="lime" fullWidth>
              {isLoading ? 'Đang xử lý...' : 'Xác nhận thông tin'}
            </Button>
          </div>
        </div>
      </form>
      <ConfirmPopup
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Xác nhận thông tin đăng ký"
        confirmText={isLoading ? 'Đang tạo...' : 'Tạo thương hiệu và chi nhánh'}
        cancelText="Hủy"
      >
        <div className="space-y-6 w-full">
          {brandInfo && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Thông tin thương hiệu</h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border">
                  {brandInfo.logo_url ? (
                    <Image src={brandInfo.logo_url} alt="Logo" width={128} height={128} className="object-cover w-full h-full" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
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
            {branches.map((branch, idx) => (
              <div key={idx} className="relative p-4 border rounded-lg bg-gray-50 text-sm mt-4">
                <p className="font-bold text-base text-gray-900 mb-3">
                  <span className="text-lime-600">●</span> Chi Nhánh {idx + 1}: {branch.name}
                </p>
                <div className="space-y-2">
                  <InfoRow label="Địa chỉ" value={branch.address} />
                  <InfoRow label="Số bàn" value={branch.deviceCount} />
                  <InfoRow label="Số camera" value={branch.deviceCount} />
                  <InfoRow label="Số điện thoại" value={branch.phone} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ConfirmPopup>
    </>
  );
}
