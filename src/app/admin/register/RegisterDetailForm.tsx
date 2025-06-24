import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Branch {
  name: string;
  address: string;
  tableCount: string;
  cameraCount: string;
}

interface RegisterDetailFormProps {
  onSuccess: (data: unknown) => void;
}

export function RegisterDetailForm({ onSuccess }: RegisterDetailFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [shopName, setShopName] = useState('');
  const [fullName, setFullName] = useState('');
  const [cccd, setCccd] = useState('');
  const [phone, setPhone] = useState('');
  const [branches, setBranches] = useState<Branch[]>([
    { name: '', address: '', tableCount: '', cameraCount: '' },
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleBranchChange = (idx: number, field: keyof Branch, value: string) => {
    setBranches(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  };

  const handleAddBranch = () => {
    setBranches(prev => [...prev, { name: '', address: '', tableCount: '', cameraCount: '' }]);
  };

  const handleRemoveBranch = (idx: number) => {
    setBranches(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: validate and call onSuccess
    onSuccess({ image, shopName, fullName, cccd, phone, branches });
  };

  return (
    <form className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start px-0 pb-8" onSubmit={handleSubmit}>
      {/* Left: Image upload + requirements */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <label className="block text-lg font-semibold mb-2 w-full text-left">Hình ảnh</label>
        <div className="relative w-60 h-60 bg-gray-100 rounded-xl flex items-center justify-center mb-2 border border-gray-200 overflow-hidden">
          {image ? (
            <Image src={URL.createObjectURL(image)} alt="Preview" fill className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400">Chưa chọn hình</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
            </svg>
          </div>
        </div>
        <div className="text-xs text-red-600 mt-2 w-full">
          <b>*YÊU CẦU:</b>
          <ul className="list-disc ml-4 mt-1">
            <li>Camera độ phân giải full HD.</li>
            <li>Tốc độ khung hình tối thiểu 60 fps.</li>
            <li>Camera được đặt tại trung tâm mặt bàn hướng từ trên xuống.</li>
          </ul>
        </div>
      </div>
      {/* Right: Form fields */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Quán</label>
          <Input value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Nhập Tên Giả Đấu..." required />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và Tên</label>
          <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nhập Tên..." required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span></label>
          <Input value={cccd} onChange={e => setCccd(e.target.value)} placeholder="Nhập CCCD ..." required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Số Điện Thoại</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập SĐT ..." />
        </div>
        {branches.map((branch, idx) => (
          <React.Fragment key={idx}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Chi Nhánh <span className="text-red-500">*</span></label>
              <Input value={branch.name} onChange={e => handleBranchChange(idx, 'name', e.target.value)} placeholder="Nhập Tên Chi Nhánh..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Địa Chỉ <span className="text-red-500">*</span></label>
              <Input value={branch.address} onChange={e => handleBranchChange(idx, 'address', e.target.value)} placeholder="Nhập Địa Chỉ..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số Bàn <span className="text-red-500">*</span></label>
              <Input value={branch.tableCount} onChange={e => handleBranchChange(idx, 'tableCount', e.target.value)} placeholder="Nhập Số Bàn..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số Lượng Camera <span className="text-red-500">*</span></label>
              <Input value={branch.cameraCount} onChange={e => handleBranchChange(idx, 'cameraCount', e.target.value)} placeholder="Nhập Số Lượng Camera..." required />
            </div>
            <div className="col-span-2 flex gap-2 items-center mb-2">
              {branches.length > 1 && (
                <button type="button" onClick={() => handleRemoveBranch(idx)} className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
              {idx === branches.length - 1 && (
                <button type="button" onClick={handleAddBranch} className="p-2 rounded bg-lime-100 hover:bg-lime-200 text-lime-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              )}
            </div>
          </React.Fragment>
        ))}
        <div className="col-span-2 mt-4">
          <Button type="submit" variant="lime" fullWidth>TIẾP TỤC</Button>
        </div>
      </div>
    </form>
  );
} 