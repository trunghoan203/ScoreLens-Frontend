"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/AuthLayout";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

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
    if (!formData.agree) newErrors.general = "Bạn phải đồng ý với điều khoản sử dụng";
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
      setStep(3); // sang bước xác minh
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response && err.response.data && err.response.data.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng ký tài khoản Admin"
      description="Vui lòng nhập thông tin để đăng ký tài khoản quản trị viên."
    >
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </Link>
          </div> 
                 </form>
      )}
      {step === 3 && (
        <div className="w-full max-w-lg mx-auto flex flex-col gap-6 items-center px-0 pb-8 animate-success-fade-in min-h-[420px]">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-black mt-8 mb-2">Vui lòng xác minh tài khoản qua email!</h2>
          <p className="text-lg text-center text-gray-700 mb-2">Chúng tôi đã gửi một email xác minh tới địa chỉ bạn vừa đăng ký. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để hoàn tất đăng ký.</p>
          <Button variant="lime" onClick={() => router.push("/admin/login")}>Quay về đăng nhập</Button>
        </div>
      )}
    </AuthLayout>
  );
}
