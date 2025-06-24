import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface VerificationFormProps {
  email: string;
  onBack: () => void;
  onSuccess: (token: string) => void;
}

export function VerificationForm({ email, onBack, onSuccess }: VerificationFormProps) {
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
      onSuccess(otpString);
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
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-6 items-center px-0 pb-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Xác thực tài khoản</h2>
      <p className="text-gray-600 text-center mb-4">Chúng tôi đã gửi mã xác thực đến <span className="font-semibold text-black">{email}</span></p>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Nhập mã xác minh 6 chữ số
        </label>
        <div className="flex gap-3 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={el => {
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
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-lime-400 transition-all"
              disabled={isLoading}
            />
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