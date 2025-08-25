'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { AuthLayout } from '@/components/shared/AuthLayout';
import { SearchParamsWrapper } from '@/components/shared/SearchParamsWrapper';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Check, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n/provider';

function AdminResetPasswordPageInner({ searchParams }: { searchParams: URLSearchParams | null }) {
  const email = searchParams?.get('email');
  const router = useRouter();
  const { t } = useI18n();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t('auth.adminResetPassword.passwordMinLength'));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t('auth.adminResetPassword.passwordMismatch'));
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      toast.success(t('auth.adminResetPassword.resetSuccess'));
      setIsSuccess(true);
    } catch {
      toast.error(t('auth.adminResetPassword.resetFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('auth.adminResetPassword.successTitle')}</h2>
            <p className="text-gray-600">
              {t('auth.adminResetPassword.successDescription')}
            </p>
            <div className="pt-4">
              <Button
                onClick={() => router.push('/admin/login')}
                variant="lime"
                fullWidth
              >
                <ArrowLeft className="inline w-4 h-4 mr-1" /> {t('auth.adminResetPassword.backToLogin')}
              </Button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('auth.adminResetPassword.title')}
      description={email ? `${t('auth.adminResetPassword.descriptionWithEmail')} ${email}` : t('auth.adminResetPassword.description')}
    >
      <div className="flex-1 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 overflow-hidden">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.adminResetPassword.newPasswordLabel')}
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-black focus:ring-2 focus:ring-lime-400 focus:border-transparent border-gray-300"
              placeholder={t('auth.adminResetPassword.newPasswordPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.adminResetPassword.confirmPasswordLabel')}
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-black focus:ring-2 focus:ring-lime-400 focus:border-transparent border-gray-300"
              placeholder={t('auth.adminResetPassword.confirmPasswordPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="lime"
            fullWidth
            disabled={isLoading || !password || !confirmPassword}
          >
            {isLoading ? t('auth.adminResetPassword.resetting') : t('auth.adminResetPassword.resetButton')}
          </Button>
          <div className="text-center">
            <Link
              href="/admin/login"
              className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors"
            >
              ← {t('auth.adminResetPassword.backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => <AdminResetPasswordPageInner searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
} 