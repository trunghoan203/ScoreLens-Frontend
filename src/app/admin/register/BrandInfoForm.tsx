import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Image as LucideImage } from 'lucide-react';
import { uploadAndGetUrl, type SignUrlResponse } from '@/lib/uploadFileService';
import { useI18n } from '@/lib/i18n/provider';

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
  const { t } = useI18n();
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
      const token = localStorage.getItem('adminAccessToken');
      const res = await axios.get('/admin/sign-url', {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const signData: SignUrlResponse = res.data as SignUrlResponse;

      const uploadedUrl = await uploadAndGetUrl({
        file,
        sign: signData,
        resourceType: 'image'
      });

      setLogoUrl(uploadedUrl);
      toast.success(t('brandInfoForm.uploadSuccess'));
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(t('brandInfoForm.uploadFailed') + ': ' + (error.response?.data?.message || (error as Error).message));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!brandName) newErrors.brandName = t('brandInfoForm.brandNameRequired');
    else if (brandName.length < 2) newErrors.brandName = t('brandInfoForm.brandNameMinLength');
    if (!phoneNumber) newErrors.phoneNumber = t('brandInfoForm.phoneRequired');
    else if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(phoneNumber)) newErrors.phoneNumber = t('brandInfoForm.phoneInvalid');
    if (!citizenCode) {
      newErrors.citizenCode = t('brandInfoForm.citizenCodeRequired');
    } else if (!/^\d{12}$/.test(citizenCode)) {
      newErrors.citizenCode = t('brandInfoForm.citizenCodeLength');
    } else {
      const provinceCode = parseInt(citizenCode.slice(0, 3), 10);
      if (provinceCode < 1 || provinceCode > 96) {
        newErrors.citizenCode = t('brandInfoForm.citizenCodeProvinceInvalid');
      }
      const genderCentury = parseInt(citizenCode[3], 10);
      if (genderCentury < 0 || genderCentury > 9) {
        newErrors.citizenCode = t('brandInfoForm.citizenCodeGenderInvalid');
      }
      const yearTwoDigits = parseInt(citizenCode.slice(4, 6), 10);
      if (yearTwoDigits < 0 || yearTwoDigits > 99) {
        newErrors.citizenCode = t('brandInfoForm.citizenCodeYearInvalid');
      }
    }
    if (!logoUrl) newErrors.logoUrl = t('brandInfoForm.logoRequired');
    if (website) {
      if (!/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(website)) {
        newErrors.website = t('brandInfoForm.websiteInvalid');
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
        toast.success(t('brandInfoForm.updateSuccess'));
      } else {
        brandId = '';
        toast.success(t('brandInfoForm.saveSuccess'));
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
      const message = err.response?.data?.message || t('brandInfoForm.operationFailed');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  const isFormValid = brandName && phoneNumber && citizenCode && logoUrl;

  return (
    <form className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 items-center px-4 sm:px-6 lg:px-0 pb-8" onSubmit={handleSubmit} noValidate>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
        {initialData?.brandId ? t('brandInfoForm.editTitle') : t('brandInfoForm.title')}
      </h2>
      <div className="flex flex-col items-center w-full">
        <label className="block text-[#000000] sm:text-lg font-semibold mb-3 sm:mb-4 w-full text-center">{t('brandInfoForm.logoLabel')}</label>
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-gray-100 rounded-xl flex items-center justify-center mb-4 border border-gray-200 overflow-hidden touch-manipulation">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" fill className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400 text-sm sm:text-base text-center px-4">{t('brandInfoForm.logoNotSelected')}</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 sm:p-2 shadow border border-gray-200">
            <LucideImage className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </div>
        </div>
        {uploading && (
          <div className="text-sm sm:text-base text-gray-600 mb-2">{t('brandInfoForm.uploading')}</div>
        )}
      </div>
      <div className="w-full space-y-4 sm:space-y-6">
        <div className="text-center text-xs sm:text-sm text-red-500">{t('brandInfoForm.imageFormatInfo')}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">{t('brandInfoForm.brandNameLabel')} <span className="text-red-500">*</span></label>
            <Input
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              placeholder={t('brandInfoForm.brandNamePlaceholder')}
              required
              className="text-sm sm:text-base py-2 sm:py-3"
            />
            {errors.brandName && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.brandName}</div>}
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">{t('brandInfoForm.phoneLabel')} <span className="text-red-500">*</span></label>
            <Input
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder={t('brandInfoForm.phonePlaceholder')}
              required
              className="text-sm sm:text-base py-2 sm:py-3"
            />
            {errors.phoneNumber && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.phoneNumber}</div>}
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">{t('brandInfoForm.citizenCodeLabel')} <span className="text-red-500">*</span></label>
            <Input
              value={citizenCode}
              onChange={e => setCitizenCode(e.target.value)}
              placeholder={t('brandInfoForm.citizenCodePlaceholder')}
              required
              className="text-sm sm:text-base py-2 sm:py-3"
            />
            {errors.citizenCode && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.citizenCode}</div>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">{t('brandInfoForm.websiteLabel')}</label>
            <Input
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder={t('brandInfoForm.websitePlaceholder')}
              className="text-sm sm:text-base py-2 sm:py-3"
            />
            {errors.website && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.website}</div>}
          </div>
        </div>
      </div>

      <div className="w-full mt-6 sm:mt-8">
        <Button
          type="submit"
          variant="lime"
          className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold"
          disabled={!isFormValid || isLoading}
          onClick={() => {
            if (!isFormValid) {
              const errors = validateForm();
              setErrors(errors);
            }
          }}
        >
          {isLoading
            ? (initialData?.brandId ? t('brandInfoForm.updating') : t('brandInfoForm.saving'))
            : (initialData?.brandId ? t('brandInfoForm.updateAndContinue') : t('brandInfoForm.saveAndContinue'))
          }
        </Button>
      </div>
    </form>
  );
}