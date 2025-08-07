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

  // OTP verification state
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

  // Validate từng bước
  const validateStep1 = () => {
    const newErrors: typeof errors = {};
    if (!formData.fullName) newErrors.fullName = "Họ tên là bắt buộc";
    if (!formData.email) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = () => {
    const newErrors: typeof errors = {};
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
    else if (formData.password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = "Mật khẩu phải chứa chữ hoa, chữ thường và số";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (!formData.agree) {
      toast.error("Bạn phải đồng ý với điều khoản sử dụng");
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
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.');
      setStep(3); // sang bước xác minh
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP handlers
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
      toast.success("Xác minh thành công! Vui lòng đăng nhập để tiếp tục.");
      router.push("/admin/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || "Xác minh thất bại. Vui lòng thử lại.";
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
      const errorMessage = err.response?.data?.message || "Gửi lại mã thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const isOtpValid = otp.every(digit => digit !== '') && !isVerifying;

  return (
    <AuthLayout
      title="Đăng ký tài khoản Admin"
      description="Vui lòng nhập thông tin để đăng ký tài khoản quản trị viên."
    >

      {step === 1 && (
        <form className="space-y-6 p-4 md:p-6 overflow-hidden min-h-[420px]" onSubmit={e => { e.preventDefault(); if (validateStep1()) setStep(2); }}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
              Họ tên
            </label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
              placeholder="Nhập họ tên của bạn"
              required
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="Nhập email của bạn"
              required
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <Button type="submit" variant="lime" fullWidth disabled={isLoading}>Tiếp tục</Button>
          <div className="text-center w-full mt-4">
            <span className="text-gray-800 text-sm">Đã có tài khoản? </span>
            <Link href="/admin/login" className="text-lime-600 font-semibold hover:underline text-sm transition-colors">
              Đăng nhập
            </Link>
          </div>
          <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>
        </div>
        </form>
      )}
      {step === 2 && (
        <form className="space-y-6 p-4 md:p-6 overflow-hidden min-h-[420px]" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.password ? "border-red-500" : "border-gray-300"}`}
              placeholder="Nhập mật khẩu"
              required
              disabled={isLoading}
            />
            <p className="text-gray-500 text-xs mt-1">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
            </p>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Xác nhận mật khẩu
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              placeholder="Nhập lại mật khẩu"
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
              Tôi đồng ý với <Link href="#" className="text-lime-600 font-semibold hover:underline">điều khoản sử dụng</Link>
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="lime" fullWidth disabled={isLoading}>
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </div>
          <div className="text-center mt-6">
            <Link
              href="#"
              onClick={e => { e.preventDefault(); setStep(1); }}
              className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Link>
          </div> 
        </form>
      )}
      {step === 3 && (
        <form className="space-y-6 p-4 md:p-6 overflow-hidden min-h-[420px]" onSubmit={handleVerifySubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Nhập mã xác minh 6 chữ số
            </label>
            <p className="text-gray-600 text-sm mb-4">
              Chúng tôi đã gửi mã xác thực đến {formData.email}
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
            disabled={!isOtpValid}
          >
            {isVerifying ? 'Đang xác minh...' : 'Xác minh'}
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
                href="#"
                onClick={e => { e.preventDefault(); setStep(1); }}
                className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Link>
            </div>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
