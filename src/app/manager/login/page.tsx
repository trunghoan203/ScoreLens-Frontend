'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { managerService } from '@/lib/managerService';

export default function ManagerLoginPage() {
  const [citizenCode, setcitizenCode] = useState('');
  const [errors, setErrors] = useState<{ citizenCode?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!citizenCode) {
      newErrors.citizenCode = 'Mã quản lý là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await managerService.login(citizenCode);
      toast.success('Mã xác thực đã được gửi!');
      window.location.href = `/manager/verification?citizenCode=${encodeURIComponent(citizenCode)}`;
    } catch (error: any) {
      toast.error(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập Quản lý"
      description="Vui lòng nhập mã quản lý để tiếp tục"
    >


      <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 overflow-hidden">
        <div>
          <label htmlFor="citizenCode" className="block text-sm font-semibold text-gray-700 mb-2">
            Mã quản lý
          </label>
          <PasswordInput
            id="citizenCode"
            name="citizenCode"
            value={citizenCode}
            onChange={(e) => setcitizenCode(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${
              errors.citizenCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập mã quản lý"
            required
            disabled={isLoading}
          />
          {errors.citizenCode && (
            <p className="text-red-500 text-sm mt-1">{errors.citizenCode}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="lime"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
