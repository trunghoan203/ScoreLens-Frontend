import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface BrandInfo {
  image: File | null;
  shopName: string;
  fullName: string;
  cccd: string;
  phone: string;
}

interface BrandInfoFormProps {
  onSuccess: (data: BrandInfo) => void;
}

export function BrandInfoForm({ onSuccess }: BrandInfoFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [shopName, setShopName] = useState('');
  const [fullName, setFullName] = useState('');
  const [cccd, setCccd] = useState('');
  const [phone, setPhone] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({ image, shopName, fullName, cccd, phone });
  };

  const isFormValid = shopName && fullName && cccd;

  return (
    <form className="w-full max-w-2xl mx-auto flex flex-col gap-6 items-center px-0 pb-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Thông tin thương hiệu</h2>
      
      {/* Image upload */}
      <div className="flex flex-col items-center w-full">
        <label className="block text-lg font-semibold mb-4 w-full text-center">Hình ảnh thương hiệu</label>
        <div className="relative w-60 h-60 bg-gray-100 rounded-xl flex items-center justify-center mb-4 border border-gray-200 overflow-hidden">
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
      </div>

      {/* Form fields */}
      <div className="w-full space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Quán <span className="text-red-500">*</span></label>
          <Input 
            value={shopName} 
            onChange={e => setShopName(e.target.value)} 
            placeholder="Nhập Tên Giả Đấu..." 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
          <Input 
            value={fullName} 
            onChange={e => setFullName(e.target.value)} 
            placeholder="Nhập Tên..." 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span></label>
          <Input 
            value={cccd} 
            onChange={e => setCccd(e.target.value)} 
            placeholder="Nhập CCCD ..." 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Số Điện Thoại</label>
          <Input 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="Nhập SĐT ..." 
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="lime"
        fullWidth
        disabled={!isFormValid}
      >
        Tiếp tục
      </Button>
    </form>
  );
} 