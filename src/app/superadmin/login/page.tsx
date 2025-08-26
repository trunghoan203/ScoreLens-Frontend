'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/shared/AuthLayout';
import { useI18n } from '@/lib/i18n/provider';
import toast from 'react-hot-toast';
import { loginSuperAdmin } from '@/lib/saService';

export default function SuperAdminAccessPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    try {
      await loginSuperAdmin(email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t('superAdminLogin.emailSentSuccess'));
      window.location.href = `/superadmin/verification?email=${encodeURIComponent(email)}`;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };
      const message = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      if (errors?.email && errors.email.length > 0) {
        toast.error(errors.email[0]);
        setErrors((prev) => ({ ...prev, email: errors.email[0] }));
      } else if (message) {
        toast.error(message);
      } else {
        toast.error(t('superAdminLogin.generalError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('superAdminLogin.pageTitle')}
      description={t('superAdminLogin.description')}
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 overflow-hidden">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('superAdminLogin.emailLabel')}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('superAdminLogin.emailPlaceholder')}
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
          {isLoading ? t('superAdminLogin.sending') : t('superAdminLogin.submitButton')}
        </Button>
      </form>
    </AuthLayout>
  );
}
