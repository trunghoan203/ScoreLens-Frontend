"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/AuthLayout";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n/provider';

export default function AdminRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
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

  const validateStep1 = () => {
    const newErrors: typeof errors = {};
    if (!formData.fullName) newErrors.fullName = t('auth.adminRegister.fullNameRequired');
    if (!formData.email) newErrors.email = t('auth.adminRegister.emailRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = () => {
    const newErrors: typeof errors = {};
    if (!formData.password) newErrors.password = t('auth.adminRegister.passwordRequired');
    else if (formData.password.length < 8) newErrors.password = t('auth.adminRegister.passwordMinLength');
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(formData.password)) newErrors.password = t('auth.adminRegister.passwordComplexity');
    if (!formData.confirmPassword) newErrors.confirmPassword = t('auth.adminRegister.confirmPasswordRequired');
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('auth.adminRegister.confirmPasswordMismatch');
    if (!formData.agree) {
      toast.error(t('auth.adminRegister.agreeRequired'));
      return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await axios.post("/admin/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      toast.success(t('auth.adminRegister.registerSuccess'));
      setStep(3);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };

      const message = err.response?.data?.message;
      const errors = err.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        if (firstError) {
          toast.error(firstError);
        } else if (message) {
          toast.error(message);
        } else {
          toast.error(t('auth.adminRegister.registerFailed'));
        }
      } else {
        toast.error(message || t('auth.adminRegister.registerFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };


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

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      return;
    }
    setIsVerifying(true);
    try {
      await axios.post("/admin/verify", {
        email: formData.email,
        activationCode: otpString,
      });
      toast.success(t('auth.adminRegister.registerSuccess'));
      router.push("/admin/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || t('auth.adminRegister.registerFailed');
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsVerifying(true);
    try {
      await axios.post("/admin/resend-verification", {
        email: formData.email,
      });
      setResendTimer(60);
      setCanResend(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || t('auth.adminRegister.registerFailed');
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const isOtpValid = otp.every(digit => digit !== '') && !isVerifying;

  return (
    <AuthLayout
      title={t('auth.adminRegister.title')}
      description={t('auth.adminRegister.description')}
    >
      {step === 1 && (
        <form className="space-y-6 p-4 md:p-6 overflow-hidden min-h-[420px]" onSubmit={e => { e.preventDefault(); if (validateStep1()) setStep(2); }} noValidate>
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.adminRegister.fullNameLabel')}
            </label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
              placeholder={t('auth.adminRegister.fullNamePlaceholder')}
              required
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.adminRegister.emailLabel')}
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder={t('auth.adminRegister.emailPlaceholder')}
              required
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <Button type="submit" variant="lime" fullWidth disabled={isLoading}>{t('auth.adminRegister.continueButton')}</Button>
          <div className="text-center w-full mt-4">
            <span className="text-gray-800 text-sm">{t('auth.adminRegister.hasAccount')} </span>
            <Link href="/admin/login" className="text-lime-600 font-semibold hover:underline text-sm transition-colors">
              {t('auth.adminRegister.login')}
            </Link>
          </div>
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.adminRegister.backToHome')}
            </Link>
          </div>
        </form>
      )}
      {step === 2 && (
        <form className="space-y-6 p-4 md:p-6 overflow-hidden min-h-[420px]" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.adminRegister.passwordLabel')}
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.password ? "border-red-500" : "border-gray-300"}`}
              placeholder={t('auth.adminRegister.passwordPlaceholder')}
              required
              disabled={isLoading}
            />
            <p className="text-gray-500 text-xs mt-1">
              {t('auth.adminRegister.passwordHint')}
            </p>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.adminRegister.confirmPasswordLabel')}
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              placeholder={t('auth.adminRegister.confirmPasswordPlaceholder')}
              required
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={formData.agree}
              onChange={handleInputChange}
              className="h-4 w-4 text-lime-500 focus:ring-lime-400 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="agree" className="text-gray-700 text-sm">
              {t('auth.adminRegister.agreeTerms')} <Link href="/terms" className="text-lime-600 font-semibold hover:underline">{t('auth.adminRegister.termsOfService')}</Link>
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="lime" fullWidth disabled={isLoading}>
              {isLoading ? t('auth.adminRegister.registering') : t('auth.adminRegister.registerButton')}
            </Button>
          </div>
          <div className="text-center mt-6">
            <Link
              href="#"
              onClick={e => { e.preventDefault(); setStep(1); }}
              className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.adminRegister.backButton')}
            </Link>
          </div>
        </form>
      )}
      {step === 3 && (
        <form className="space-y-6 p-4 md:p-6 overflow-hidden min-h-[420px]" onSubmit={handleVerifySubmit} noValidate>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              {t('auth.adminRegister.verificationTitle')}
            </label>
            <p className="text-gray-600 text-sm mb-4">
              {t('auth.adminRegister.verificationDescription')} {formData.email}
            </p>
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
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer rounded-full"
                    autoFocus={index === 0}
                  />
                  {digit ? (
                    <Image
                      src={numberImages[Number(digit) - 1]}
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
            disabled={!isOtpValid}
          >
            {isVerifying ? t('auth.adminRegister.verifying') : t('auth.adminRegister.verificationButton')}
          </Button>

          <div className="text-center space-y-4">
            <div>
              <span className="text-gray-600 text-sm">Không nhận được mã? </span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isVerifying}
                  className="text-lime-600 font-semibold hover:underline text-sm transition-colors disabled:opacity-50"
                >
                  {t('auth.adminRegister.resendCode')}
                </button>
              ) : (
                <span className="text-gray-500 text-sm">
                  {t('auth.adminRegister.resendTimer')} {resendTimer}s
                </span>
              )}
            </div>
            <div>
              <Link
                href="#"
                onClick={e => { e.preventDefault(); setStep(1); }}
                className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.adminRegister.backButton')}
              </Link>
            </div>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
