'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/shared/AuthLayout';
import toast from 'react-hot-toast';
import { loginSuperAdmin } from '@/lib/saService';

export default function SuperAdminAccessPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
 
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Vui lòng nhập đúng định dạng email';
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
      await loginSuperAdmin(email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Email đã được gửi thành công!');
      window.location.href = `/superadmin/verification?email=${encodeURIComponent(email)}`;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message;
      if (message) {
        // Xử lý trường hợp tài khoản chưa xác minh
        if (message.includes('not verified') || message.includes('verification')) {
          toast.error('Tài khoản chưa được xác minh. Vui lòng kiểm tra email để lấy mã xác thực.');
        } else {
          toast.error(message);
        }
      } else {
        const errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Truy cập vào ScoreLens dành cho Super Admin"
      description=""
    //imageUrl="/images/billiards.png" // Đặt ảnh phù hợp
    >


      <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 overflow-hidden">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Nhập email Super Admin
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ScoreLens"
            required
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="lime"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Đang gửi...' : 'Gửi'}
        </Button>
      </form>
    </AuthLayout>
  );
}
