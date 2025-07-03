'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Link from 'next/link';
import VerifyCodeForm from '@/components/auth/VerifyCodeForm';
import axios from '@/lib/axios';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    try {
      await axios.post('/admin/forgotPassword', { email });
      setStep(2);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      if (error.response?.data?.message) setError(error.response.data.message);
      else setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }
    try {
      await axios.post('/admin/set-newPassword', { email, newPassword });
      setStep(4);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      if (error.response?.data?.message) setError(error.response.data.message);
      else setError('Đặt lại mật khẩu thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu?"
      description="Nhập email để lấy lại mật khẩu"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
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
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang gửi...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
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
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="55" cy="55" r="55" fill="#A3E635"/>
                <path d="M35 58L50 73L75 48" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
