'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Link from 'next/link';
import VerifyCodeForm from '@/components/auth/VerifyCodeForm';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ref and state for dynamic image height
  const formRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useLayoutEffect(() => {
    if (formRef.current) {
      // Xóa: const formHeight = ...
    }
  }, []);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/admin/forgotPassword', { email });
      toast.success('Email đã được gửi thành công! Vui lòng kiểm tra hộp thư.');
      setStep(2);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (newPassword.length < 8) {
      const errorMessage = 'Mật khẩu phải có ít nhất 8 ký tự.';
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      const errorMessage = 'Mật khẩu xác nhận không khớp.';
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }
    try {
      await axios.post('/admin/set-newPassword', { email, newPassword });
      toast.success('Đặt lại mật khẩu thành công!');
      setStep(4);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Đặt lại mật khẩu thất bại.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu?"
      description="Nhập email để lấy lại mật khẩu"
    >

      {step === 1 && (
        <form onSubmit={handleSubmitEmail} className="space-y-6 p-4 md:p-6 overflow-hidden">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all border-gray-300"
              placeholder="Nhập email của bạn"
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            variant="lime"
            fullWidth
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" />
                Đang gửi...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                Gửi
              </div>
            )}
          </Button>
          <div className="text-center w-full mt-4">
            <span className="text-gray-800 text-sm">Đã nhớ mật khẩu? </span>
            <Link
              href="/admin/login"
              className="text-lime-600 font-semibold hover:underline text-sm transition-colors"
            >
              Quay lại đăng nhập
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
        <form onSubmit={handleSubmitNewPassword} className="space-y-6 p-4 md:p-6 overflow-hidden">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all border-gray-300"
              placeholder="Nhập mật khẩu mới"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all border-gray-300"
              placeholder="Nhập lại mật khẩu mới"
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            variant="lime"
            fullWidth
            disabled={isLoading || !newPassword || !confirmPassword}
          >
            {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
          </Button>
        </form>
      )}
      {step === 4 && (
        <div className="w-full max-w-lg mx-auto flex flex-col gap-6 items-center px-0 pb-8 animate-success-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-black mt-8 mb-2">ĐẶT LẠI MẬT KHẨU THÀNH CÔNG</h2>
          <p className="text-lg text-center text-gray-700 mb-2">Bạn có thể đăng nhập với mật khẩu mới.</p>
          <div className="flex justify-center my-6">
            <div className="animate-success-bounce">
              <CheckCircle size={110} strokeWidth={2} fill="#A3E635" className="text-lime-400 bg-transparent rounded-full" />
            </div>
          </div>
          <div className="text-2xl font-bold text-black text-center mb-2 animate-success-pop">Bạn đã có thể đăng nhập!</div>
          <Link href="/admin/login" className="text-lime-600 font-semibold hover:underline text-lg transition-colors">
            Đăng nhập
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
