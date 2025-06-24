'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Link from 'next/link';

export default function AdminVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminVerificationPageInner />
    </Suspense>
  );
}

function AdminVerificationPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
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
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      return;
    }
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/admin/reset-password?token=${otpString}&email=${email}`);
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendTimer(60);
      setCanResend(false);
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = otp.every(digit => digit !== '') && !isLoading;

  return (
    <AuthLayout
      title="Xác thực tài khoản"
      description={`Chúng tôi đã gửi mã xác thực đến ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Nhập mã xác minh 6 chữ số
          </label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-500 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormValid}
        >
          {isLoading ? 'Đang xác minh...' : 'Xác minh'}
        </Button>

        <div className="text-center space-y-4">
          <div>
            <span className="text-gray-600 text-sm">Không nhận được mã? </span>
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-lime-600 font-semibold hover:underline text-sm transition-colors disabled:opacity-50"
              >
                Gửi lại mã
              </button>
            ) : (
              <span className="text-gray-500 text-sm">
                Gửi lại sau {resendTimer}s
              </span>
            )}
          </div>
          <div>
            <Link
              href="/admin/login"
              className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
} 