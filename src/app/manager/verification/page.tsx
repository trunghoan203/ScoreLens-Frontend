'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { managerService } from '@/lib/managerService';
import { useI18n } from '@/lib/i18n/provider';

export default function ManagerVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManagerVerificationPageInner />
    </Suspense>
  );
}

function ManagerVerificationPageInner() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const numberImages = [
    '/images/numberBalls/ball_1.png',
    '/images/numberBalls/ball_2.png',
    '/images/numberBalls/ball_3.png',
    '/images/numberBalls/ball_4.png',
    '/images/numberBalls/ball_5.png',
    '/images/numberBalls/ball_6.png',
    '/images/numberBalls/ball_7.png',
    '/images/numberBalls/ball_8.png',
    '/images/numberBalls/ball_9.png',
  ];

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setTimeout(() => {
        inputRefs.current[5]?.focus();
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error(t('auth.managerVerification.otpRequired'));
      return;
    }

    console.log('Submitting verification:', { email, otpString, otp });

    setIsLoading(true);
    try {
      const data = await managerService.verifyLogin(email, otpString);
      console.log('Verification response:', data);
      if (data && typeof data === 'object' && 'accessToken' in data && typeof data.accessToken === 'string') {
        localStorage.setItem('managerAccessToken', data.accessToken);
      }
      toast.success(t('auth.managerVerification.verificationSuccess'));
      window.location.href = `/manager/dashboard`;
    } catch (error) {
      console.error('Verification error:', error);
      const err = error as { message?: string };
      toast.error(err.message || t('auth.managerVerification.verificationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      await managerService.resendLoginCode(email);
      toast.success(t('auth.managerVerification.codeResent'));
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || t('auth.managerVerification.resendFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = otp.every(digit => digit !== '') && !isLoading;

  return (
    <AuthLayout
      title={t('auth.managerVerification.title')}
      description={`${t('auth.managerVerification.description')} ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
            {t('auth.managerVerification.verificationTitle')}
          </label>
          <div className="flex gap-2 sm:gap-3 justify-center mb-3 sm:mb-4" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <div
                key={index}
                className={`relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200 bg-white shadow-md cursor-pointer
                  ${inputRefs.current[index] && document.activeElement === inputRefs.current[index] ? 'border-lime-500 shadow-lg' : digit ? 'border-lime-400' : 'border-gray-300'}
                `}
                onClick={() => inputRefs.current[index]?.focus()}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  ref={el => { inputRefs.current[index] = el; }}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleOtpChange(index, value);
                  }}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  autoFocus={index === 0}
                />
                {digit ? (
                  <Image
                    src={numberImages[Number(digit) - 1]}
                    alt={`Số ${digit}`}
                    width={36}
                    height={36}
                    className="drop-shadow w-8 h-8 sm:w-9 sm:h-9"
                  />
                ) : (
                  <span className="text-gray-300 text-xl sm:text-2xl select-none">-</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="lime"
          fullWidth
          disabled={!isFormValid}
          className="py-2 sm:py-3 text-sm sm:text-base"
        >
          {isLoading ? t('auth.managerVerification.verifying') : t('auth.managerVerification.verificationButton')}
        </Button>

        <div className="text-center space-y-3 sm:space-y-4">
          <div>
            <span className="text-gray-600 text-sm">{t('auth.managerVerification.notReceivedCode')} </span>
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-lime-600 font-semibold hover:underline text-sm transition-colors disabled:opacity-50"
              >
                {t('auth.managerVerification.resendCode')}
              </button>
            ) : (
              <span className="text-gray-500 text-sm">
                {t('auth.managerVerification.resendTimer')} {resendTimer}s
              </span>
            )}
          </div>
          <div>
            <Link
              href="/manager/login"
              className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('auth.managerVerification.backToLogin')}
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}