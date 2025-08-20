import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Image as LucideImage } from 'lucide-react';

interface BrandInfo {
  brandId: string;
  brandName: string;
  phoneNumber: string;
  website?: string;
  logo_url?: string;
  citizenCode: string;
}

interface BrandInfoFormProps {
  onSuccess: (data: BrandInfo) => void;
  initialData?: BrandInfo | null;
}

export function BrandInfoForm({ onSuccess, initialData }: BrandInfoFormProps) {
  const [, setImage] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '');
  const [brandName, setBrandName] = useState(initialData?.brandName || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');
  const [website, setWebsite] = useState(initialData?.website || '');
  const [citizenCode, setCitizenCode] = useState(initialData?.citizenCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setLogoUrl(initialData.logo_url || '');
      setBrandName(initialData.brandName || '');
      setPhoneNumber(initialData.phoneNumber || '');
      setWebsite(initialData.website || '');
      setCitizenCode(initialData.citizenCode || '');
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      uploadLogo(file);
    }
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/admin/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      const data = res.data as { success: boolean; url: string };
      setLogoUrl(data.url);
      toast.success('Upload logo thành công!');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error('Upload thất bại: ' + (error.response?.data?.message || (error as Error).message));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!brandName) newErrors.brandName = 'Tên thương hiệu là bắt buộc';
    else if (brandName.length < 2) newErrors.brandName = 'Tên thương hiệu phải có ít nhất 2 ký tự';
    if (!phoneNumber) newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phoneNumber)) newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    if (!citizenCode) {
      newErrors.citizenCode = 'CCCD là bắt buộc';
    } else if (!/^\d{12}$/.test(citizenCode)) {
      newErrors.citizenCode = 'CCCD phải có đúng 12 chữ số';
    } else {
      const provinceCode = parseInt(citizenCode.slice(0, 3), 10);
      if (provinceCode < 1 || provinceCode > 96) {
      newErrors.citizenCode = 'Mã tỉnh/thành phố không hợp lệ';
      }
      const genderCentury = parseInt(citizenCode[3], 10);
      if (genderCentury < 0 || genderCentury > 9) {
      newErrors.citizenCode = 'Mã giới tính/thế kỷ không hợp lệ';
      }
      const yearTwoDigits = parseInt(citizenCode.slice(4, 6), 10);
      if (yearTwoDigits < 0 || yearTwoDigits > 99) {
      newErrors.citizenCode = 'Năm sinh không hợp lệ';
      }
    }
    if (!logoUrl) newErrors.logoUrl = 'Logo là bắt buộc';
    if (website) {
      if (!/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(website)) {
        newErrors.website = 'URL không hợp lệ, phải bắt đầu bằng https://';
      }
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      let brandId = initialData?.brandId;
          const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      return;
    }
      if (initialData?.brandId) {
        const response = await axios.put(`/admin/brands/${initialData.brandId}`, {
          brandName,
          phoneNumber,
          website: website || undefined,
          logo_url: logoUrl,
          citizenCode,
        });
        const brandData = response.data as { brandId?: string; _id?: string };
        brandId = brandData.brandId || brandData._id || initialData.brandId || '';
        toast.success('Cập nhật thông tin thương hiệu thành công!');
      } else {
        brandId = '';
        toast.success('Lưu thông tin thương hiệu thành công!');
      }
      
      onSuccess({
        brandId,
        brandName,
        phoneNumber,
        website,
        logo_url: logoUrl,
        citizenCode,
      });
    } catch (error: unknown) {
      setImage(null);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  const isFormValid = brandName && phoneNumber && citizenCode && logoUrl;

  return (
    <form className="w-full max-w-2xl mx-auto flex flex-col gap-6 items-center px-0 pb-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
        {initialData?.brandId ? 'Chỉnh sửa thông tin thương hiệu' : 'Thông tin thương hiệu'}
      </h2>
      <div className="flex flex-col items-center w-full">
        <label className="block text-lg font-semibold mb-4 w-full text-center">Logo thương hiệu</label>
        <div className="relative w-60 h-60 bg-gray-100 rounded-xl flex items-center justify-center mb-4 border border-gray-200 overflow-hidden">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" fill className="object-cover w-full h-full" />
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
            <LucideImage className="w-5 h-5 text-gray-500" />
          </div>
        </div>
        {uploading}
        {logoUrl && !uploading}
      </div>
      <div className="w-full space-y-4">
        <div className="text-center text-sm text-red-500">Định dạng ảnh cho phép: PNG, JPG, JPEG, tối đa 5MB</div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên thương hiệu <span className="text-red-500">*</span></label>
          <Input 
            value={brandName} 
            onChange={e => setBrandName(e.target.value)} 
            placeholder="Nhập tên thương hiệu..." 
            required 
          />
          {errors.brandName && <div className="text-red-500 text-xs mt-1">{errors.brandName}</div>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
          <Input 
            value={phoneNumber} 
            onChange={e => setPhoneNumber(e.target.value)} 
            placeholder="Nhập số điện thoại..." 
            required
          />
          {errors.phoneNumber && <div className="text-red-500 text-xs mt-1">{errors.phoneNumber}</div>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
          <Input 
            value={website} 
            onChange={e => setWebsite(e.target.value)} 
            placeholder="https://example.com" 
          />
          {errors.website && <div className="text-red-500 text-xs mt-1">{errors.website}</div>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span></label>
          <Input 
            value={citizenCode} 
            onChange={e => setCitizenCode(e.target.value)} 
            placeholder="Nhập CCCD..." 
            required 
          />
          {errors.citizenCode && <div className="text-red-500 text-xs mt-1">{errors.citizenCode}</div>}
        </div>
      </div>
             <Button
         type="submit"
         variant="lime"
         fullWidth
         disabled={!isFormValid || isLoading}
         onClick={() => {
           if (!isFormValid) {
             const errors = validateForm();
             setErrors(errors);
           }
         }}
       >
         {isLoading 
           ? (initialData?.brandId ? 'Đang cập nhật...' : 'Đang lưu...') 
           : (initialData?.brandId ? 'Cập nhật và tiếp tục' : 'Lưu và tiếp tục')
         }
       </Button>
    </form>
  );
}