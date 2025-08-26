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
import { useI18n } from '@/lib/i18n/provider';

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
  const { t } = useI18n();

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
      newErrors.email = t('auth.adminLogin.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.adminLogin.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.adminLogin.passwordRequired');
    } else if (formData.password.length < 8) newErrors.password = t('auth.adminLogin.passwordMinLength');
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(formData.password))
      newErrors.password = t('auth.adminLogin.passwordComplexity');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, searchParams: URLSearchParams | null) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('/admin/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe
      });

      if (response.status === 200) {
        const data = response.data as { data?: { accessToken?: string; refreshToken?: string;[key: string]: unknown } };
        const accessToken = data.data?.accessToken;
        const refreshToken = data.data?.refreshToken;
        if (accessToken) {
          localStorage.setItem('adminAccessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        adminService.saveRememberMeData({
          email: formData.email,
          password: formData.password,
          rememberMe: rememberMe
        });

        toast.success(t('auth.adminLogin.loginSuccess'));
        const redirectUrl = searchParams?.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
          return;
        }

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
          if (admin.brandId) {
            router.push('/admin/dashboard');
          } else {
            router.push('/admin/confirm');
          }
        } catch (profileError) {
          console.log('Không thể lấy thông tin profile:', profileError);
          router.push('/admin/confirm');
        }
      } else {
        const errorMessage = (response.data as { message?: string })?.message || t('auth.adminLogin.loginFailed');
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };

      const message = err.response?.data?.message;
      const errors = err.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        if (firstError) {
          toast.error(firstError);
        } else if (message) {
          toast.error(message);
        } else {
          toast.error(t('auth.adminLogin.loginFailed'));
        }
      } else {
        toast.error(message || t('auth.adminLogin.loginFailed'));
      }
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
      title={t('auth.adminLogin.title')}
      description={t('auth.adminLogin.description')}
    >
      <SearchParamsWrapper>
        {(searchParams) => (
          <form onSubmit={(e) => handleSubmit(e, searchParams)} className="space-y-6 p-4 md:p-6 overflow-hidden min-h-[420px]" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('auth.adminLogin.emailLabel')}
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder={t('auth.adminLogin.emailPlaceholder')}
                required
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('auth.adminLogin.passwordLabel')}
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder={t('auth.adminLogin.passwordPlaceholder')}
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
                  <span className="text-gray-700">{t('auth.adminLogin.rememberMe')}</span>
                </label>
              </div>
              <Link
                href="/admin/forgotPassword"
                className="font-medium text-gray-800 hover:text-lime-500 transition-colors"
              >
                {t('auth.adminLogin.forgotPassword')}
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
                  {t('auth.adminLogin.loggingIn')}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  {t('auth.adminLogin.loginButton')}
                </div>
              )}
            </Button>

            <div className="text-center w-full mt-4">
              <span className="text-gray-800 text-sm">{t('auth.adminLogin.noAccount')} </span>
              <Link
                href="/admin/register"
                className="text-lime-600 font-semibold hover:underline text-sm transition-colors"
              >
                {t('auth.adminLogin.register')}
              </Link>
            </div>

            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.adminLogin.backToHome')}
              </Link>
            </div>
          </form>
        )}
      </SearchParamsWrapper>
    </AuthLayout>
  );
}
