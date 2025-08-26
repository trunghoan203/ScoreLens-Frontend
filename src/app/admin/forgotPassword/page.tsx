'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Link from 'next/link';
import Image from 'next/image';
import VerifyCodeForm from '@/components/auth/VerifyCodeForm';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useI18n } from '@/lib/i18n/provider';

export default function AdminForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useLayoutEffect(() => {
    if (formRef.current) {
    }
  }, []);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/admin/forgotPassword', { email });
      toast.success(t('auth.forgotPassword.emailSentSuccess'));
      setStep(2);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || t('auth.forgotPassword.generalError');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (newPassword.length < 8) {
      const errorMessage = t('auth.forgotPassword.passwordMinLength');
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      const errorMessage = t('auth.forgotPassword.passwordMismatch');
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }
    try {
      await axios.post('/admin/set-newPassword', { email, newPassword });
      toast.success(t('auth.forgotPassword.resetSuccess'));
      setStep(4);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || t('auth.forgotPassword.resetFailed');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {step === 4 ? (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
          <div className="relative z-30 flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4">
            <div className="flex flex-col justify-center p-8 md:p-12 w-full md:w-[450px] min-h-[200px]">
              <div className="w-full max-w-lg mx-auto flex flex-col gap-4 sm:gap-6 items-center px-4 sm:px-0 animate-success-fade-in">
                <div className="flex flex-col items-center text-center mb-6">
                  <Image
                    src="/images/logoScoreLensBlack.png"
                    alt="ScoreLens Logo"
                    width={200}
                    height={50}
                    priority
                    className="mb-4"
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-2">{t('auth.forgotPassword.successTitle')}</h2>
                <p className="text-base sm:text-lg text-center text-gray-700 mb-2">{t('auth.forgotPassword.successDescription')}</p>
                <div className="flex justify-center my-4 sm:my-6">
                  <div className="animate-success-bounce">
                    <CheckCircle size={80} strokeWidth={2} className="sm:w-[110px] sm:h-[110px] text-lime-400" fill="none" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-bold text-black text-center mb-2 animate-success-pop">{t('auth.forgotPassword.canLoginNow')}</div>
                <Link href="/admin/login" className="bg-lime-400 text-white hover:bg-lime-500 rounded-lg py-3 sm:py-4 text-sm sm:text-base font-semibold transition-transform w-full flex justify-center items-center touch-manipulation">
                  {t('auth.forgotPassword.backToLogin')}
                </Link>
              </div>
            </div>
            <div className="hidden md:block w-[450px] h-[710px]">
              <Image
                src="/images/imgLogin.png"
                alt="Billiards table"
                width={450}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <AuthLayout
          title={t('auth.forgotPassword.title')}
          description={t('auth.forgotPassword.description')}
        >

          {step === 1 && (
            <form onSubmit={handleSubmitEmail} className="space-y-4 sm:space-y-6 p-4 sm:p-6 overflow-hidden" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.email')}
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all border-gray-300 text-sm sm:text-base"
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                variant="lime"
                fullWidth
                disabled={isLoading || !email}
                className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
                    <span className="text-sm sm:text-base">{t('auth.forgotPassword.sending')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-sm sm:text-base">{t('auth.forgotPassword.sendButton')}</span>
                  </div>
                )}
              </Button>
              <div className="text-center w-full mt-4">
                <span className="text-gray-800 text-xs sm:text-sm">{t('auth.forgotPassword.rememberPassword')} </span>
                <Link
                  href="/admin/login"
                  className="text-lime-600 font-semibold hover:underline text-xs sm:text-sm transition-colors touch-manipulation"
                >
                  {t('auth.forgotPassword.backToLogin')}
                </Link>
              </div>
              <div className="text-center mt-4 sm:mt-6">
                <Link
                  href="/"
                  className="text-xs sm:text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1 touch-manipulation"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t('common.backToHome')}
                </Link>
              </div>
            </form>
          )}
          {step === 2 && (
            <VerifyCodeForm
              email={email}
              apiEndpoint="/admin/verify-resetCode"
              codeField="resetCode"
              onBack={() => setStep(1)}
              onSuccess={() => {
                setStep(3);
              }}
            />
          )}
          {step === 3 && (
            <form onSubmit={handleSubmitNewPassword} className="space-y-4 sm:space-y-6 p-4 sm:p-6 overflow-hidden" noValidate>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.forgotPassword.newPasswordLabel')}
                </label>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all border-gray-300 text-sm sm:text-base"
                  placeholder={t('auth.forgotPassword.newPasswordPlaceholder')}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.forgotPassword.confirmPasswordLabel')}
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all border-gray-300 text-sm sm:text-base"
                  placeholder={t('auth.forgotPassword.confirmPasswordPlaceholder')}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                variant="lime"
                fullWidth
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold"
              >
                {isLoading ? t('auth.forgotPassword.resetting') : t('auth.forgotPassword.resetButton')}
              </Button>
            </form>
          )}
        </AuthLayout>
      )}
    </>
  );
}
