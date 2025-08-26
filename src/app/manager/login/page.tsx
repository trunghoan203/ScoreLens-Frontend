'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { managerService } from '@/lib/managerService';
import { useI18n } from '@/lib/i18n/provider';

export default function ManagerLoginPage() {
  const [email, setemail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = t('auth.managerLogin.emailRequired');
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
      await managerService.login(email);
      window.location.href = `/manager/verification?email=${encodeURIComponent(email)}`;
      toast.success(t('auth.managerLogin.verificationSent'));
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || t('auth.managerLogin.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.managerLogin.title')}
      description={t('auth.managerLogin.description')}
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 overflow-hidden" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('auth.managerLogin.emailLabel')}
          </label>
          <Input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all text-sm sm:text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder={t('auth.managerLogin.emailPlaceholder')}
            required
            disabled={isLoading}
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
          className="py-2 sm:py-3 text-sm sm:text-base"
        >
          {isLoading ? t('auth.managerLogin.loggingIn') : t('auth.managerLogin.loginButton')}
        </Button>

        <div className="text-center mt-4 sm:mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('auth.managerLogin.backToHome')}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
