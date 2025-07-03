import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from '@/lib/axios';

interface VerifyCodeFormProps {
  email: string;
  onBack: () => void;
  onSuccess: (code: string) => void;
  apiEndpoint: string;
  codeField?: string;
}

export default function VerifyCodeForm({ email, onBack, onSuccess, apiEndpoint, codeField = 'activationCode' }: VerifyCodeFormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(apiEndpoint, {
        email,
        [codeField]: otpString,
      });
      onSuccess(otpString);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Xác thực thất bại. Vui lòng thử lại.');
      }
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
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-6 items-center px-0 pb-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Xác thực tài khoản</h2>
      <p className="text-gray-600 text-center mb-4">Chúng tôi đã gửi mã xác thực đến <span className="font-semibold text-black">{email}</span></p>
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg w-full">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
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
                disabled={isLoading}
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
        variant="lime"
        fullWidth
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
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại đăng ký
          </button>
        </div>
      </div>
    </form>
  );
} 