'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { verifySuperAdminLogin } from '@/lib/saService';

export default function SuperAdminVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuperAdminVerificationPageInner />
    </Suspense>
  );
}

function SuperAdminVerificationPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const numberImages = [
    '/images/numberBalls/ball_0.png',
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

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '');
    if (digit.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
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
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      setTimeout(() => inputRefs.current[5]?.focus(), 0);
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
      const res = await verifySuperAdminLogin(email, otpString);
      // Lưu access_token vào localStorage
      const data = res.data as { accessToken?: string };
      if (data.accessToken) {
        localStorage.setItem('adminAccessToken', data.accessToken);
      }
      toast.success('Xác thực thành công!');
      router.push(`/superadmin/home`);
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi lại mã
  // const handleResend = async () => {
  //   try {
  //     await resendLoginCode(email);
  //     toast.success('Đã gửi lại mã xác thực!');
  //   } catch {
  //     toast.error('Không gửi lại được mã xác thực');
  //   }
  // };

  return (
    <AuthLayout
      title={
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Nhập mã xác minh</p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6" onPaste={handlePaste}>
        <div className="flex gap-3 justify-center mb-4">
          {otp.map((digit, index) => (
            <div
              key={index}
              className={`relative w-12 aspect-square flex items-center justify-center rounded-full border-2 transition-all duration-200 bg-white shadow-md cursor-pointer
                ${inputRefs.current[index] && document.activeElement === inputRefs.current[index]
                  ? 'border-lime-500 shadow-lg'
                  : digit
                    ? 'border-lime-400'
                    : 'border-gray-300'}
              `}
              onClick={() => inputRefs.current[index]?.focus()}
            >
              <input
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={el => { inputRefs.current[index] = el; }}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                autoFocus={index === 0}
              />
              {digit ? (
                <Image
                  src={numberImages[Number(digit)]}
                  alt={`Ball ${digit}`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300 select-none">-</div>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 text-center">
          Nếu bạn không nhận được mã,{' '}
          <span className="text-green-600 hover:underline cursor-pointer">Hãy gửi lại</span>
        </p>

        <Button
          type="submit"
          variant="lime"
          fullWidth
          disabled={isLoading || otp.some(d => !d)}
          className="mt-2"
        >
          {isLoading ? 'Đang gửi...' : 'Gửi'}
        </Button>

        {/* Nút quay lại trang chủ */}
        <div className="flex justify-center">
          <div
            onClick={() => router.push('/superadmin/login')}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-lime-600 cursor-pointer transition-colors"
          >
            <span className="text-base">←</span>
            <span>Quay lại trang chủ</span>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
