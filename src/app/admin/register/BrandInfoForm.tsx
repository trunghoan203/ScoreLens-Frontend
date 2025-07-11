import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

interface BrandInfo {
  brandId: string;
  brandName: string;
  numberPhone: string;
  website?: string;
  logo_url?: string;
  citizenCode: string;
}

interface BrandInfoFormProps {
  onSuccess: (data: BrandInfo) => void;
}

export function BrandInfoForm({ onSuccess }: BrandInfoFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [brandName, setBrandName] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [citizenCode, setCitizenCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Upload logo nếu có
      let logo_url = '';
      if (image) {
        const formData = new FormData();
        formData.append('logo', image);
        logo_url = 'https://example.com/logo.png';
      }

      // Gọi API tạo brand
      const response = await axios.post('/admin/brands', {
        brandName,
        numberPhone,
        website: website || undefined,
        logo_url: logo_url || undefined,
        citizenCode,
      });

      const brandData = response.data as { brandId?: string; _id?: string };
      toast.success('Tạo thương hiệu thành công!');
      
      onSuccess({
        brandId: brandData.brandId || brandData._id || '',
        brandName,
        numberPhone,
        website,
        logo_url,
        citizenCode,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Tạo thương hiệu thất bại. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = brandName && numberPhone && citizenCode;

  return (
    <form className="w-full max-w-2xl mx-auto flex flex-col gap-6 items-center px-0 pb-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Thông tin thương hiệu</h2>
      
      {/* Image upload */}
      <div className="flex flex-col items-center w-full">
        <label className="block text-lg font-semibold mb-4 w-full text-center">Logo thương hiệu</label>
        <div className="relative w-60 h-60 bg-gray-100 rounded-xl flex items-center justify-center mb-4 border border-gray-200 overflow-hidden">
          {image ? (
            <Image src={URL.createObjectURL(image)} alt="Preview" fill className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400">Chưa chọn logo</span>
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên thương hiệu <span className="text-red-500">*</span></label>
          <Input 
            value={brandName} 
            onChange={e => setBrandName(e.target.value)} 
            placeholder="Nhập tên thương hiệu..." 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
          <Input 
            value={numberPhone} 
            onChange={e => setNumberPhone(e.target.value)} 
            placeholder="Nhập số điện thoại..." 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
          <Input 
            value={website} 
            onChange={e => setWebsite(e.target.value)} 
            placeholder="https://example.com" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span></label>
          <Input 
            value={citizenCode} 
            onChange={e => setCitizenCode(e.target.value)} 
            placeholder="Nhập CCCD..." 
            required 
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="lime"
        fullWidth
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Đang tạo thương hiệu...' : 'Tiếp tục'}
      </Button>
    </form>
  );
} 