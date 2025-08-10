'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/shared/AuthLayout';
import { SearchParamsWrapper } from '@/components/shared/SearchParamsWrapper';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function AdminVerificationPage() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => <AdminVerificationPageInner searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
}

function AdminVerificationPageInner({ searchParams }: { searchParams: URLSearchParams | null }) {
  const router = useRouter();
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
    // Có thể thêm ball_0.png nếu có
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
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      // Focus vào ô cuối cùng
      setTimeout(() => {
        inputRefs.current[5]?.focus();
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      toast.success('Xác thực thành công!');
      router.push(`/admin/branches?email=${encodeURIComponent(email)}&otp=${otpString}`);
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
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
          <div className="flex gap-3 justify-center mb-4" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <div
                key={index}
                className={`relative w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200 bg-white shadow-md cursor-pointer
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
                    src={numberImages[Number(digit)-1]}
                    alt={`Số ${digit}`}
                    width={36}
                    height={36}
                    className="drop-shadow"
                  />
                ) : (
                  <span className="text-gray-300 text-2xl select-none">-</span>
                )}
              </div>
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
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
} 