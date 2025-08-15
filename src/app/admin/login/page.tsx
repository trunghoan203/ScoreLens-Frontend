'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { AuthLayout } from '@/components/shared/AuthLayout';
import { SearchParamsWrapper } from '@/components/shared/SearchParamsWrapper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { adminService } from '@/lib/adminService';
import toast from 'react-hot-toast';
import { Loader2, LogIn, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }); 
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load saved credentials on component mount
  useEffect(() => {
    const savedData = adminService.getRememberMeData();
    if (savedData) {
      setFormData({
        email: savedData.email,
        password: savedData.password
      });
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, searchParams: URLSearchParams | null) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Gửi request login với rememberMe bằng axios
      const response = await axios.post('/admin/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe
      });

      if (response.status === 200) {
        const data = response.data as { data?: { accessToken?: string; refreshToken?: string; [key: string]: unknown } };
        const accessToken = data.data?.accessToken;
        const refreshToken = data.data?.refreshToken;
        if (accessToken) {
          localStorage.setItem('adminAccessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        // Lưu thông tin đăng nhập nếu user chọn nhớ mật khẩu
        adminService.saveRememberMeData({
          email: formData.email,
          password: formData.password,
          rememberMe: rememberMe
        });

        toast.success('Đăng nhập thành công!');
        const redirectUrl = searchParams?.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
          return;
        }
        
        // Gọi API lấy profile với accessToken vừa nhận
        try {
          const profileResponse = await axios.get('/admin/profile', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const profileData = profileResponse.data as { admin?: { brandId?: string | null, status?: string, rejectedReason?: string } };
          const admin = profileData.admin;
          if (!admin) {
            router.push('/admin/confirm');
            return;
          }
          if (admin.status === 'pending') {
            localStorage.setItem('rejectedAdminInfo', JSON.stringify(admin));
            router.push('/admin/pending');
            return;
          }
          if (admin.status === 'rejected') {
            localStorage.setItem('rejectedAdminInfo', JSON.stringify(admin));
            router.push('/admin/rejected');
            return;
          }
          // approved
          if (admin.brandId) {
            router.push('/admin/branches');
          } else {
            router.push('/admin/confirm');
          }
        } catch (profileError) {
          console.log('Không thể lấy thông tin profile:', profileError);
          router.push('/admin/confirm');
        }
      } else {
        const errorMessage = (response.data as { message?: string })?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <AuthLayout
      title="Đăng nhập Admin"
      description="Vui lòng đăng nhập để tiếp tục"
    >
      <SearchParamsWrapper>
        {(searchParams) => (
          <form onSubmit={(e) => handleSubmit(e, searchParams)} className="space-y-6 p-4 md:p-6 overflow-hidden min-h-[420px]">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập email của bạn"
                required
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập mật khẩu"
                required
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="h-4 w-4 text-lime-500 focus:ring-lime-400 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <span className="text-gray-700">Nhớ mật khẩu</span>
                </label> 
              </div>
              <Link 
                href="/admin/forgotPassword" 
                className="font-medium text-gray-800 hover:text-lime-500 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              variant="lime"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" />
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  Đăng nhập
                </div>
              )}
            </Button>

            <div className="text-center w-full mt-4">
              <span className="text-gray-800 text-sm">Bạn chưa có tài khoản? </span>
              <Link 
                href="/admin/register" 
                className="text-lime-600 font-semibold hover:underline text-sm transition-colors"
              >
                Đăng ký
              </Link>
            </div>

            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại trang chủ
              </Link>
            </div>
          </form>
        )}
      </SearchParamsWrapper>
    </AuthLayout>
  );
}
