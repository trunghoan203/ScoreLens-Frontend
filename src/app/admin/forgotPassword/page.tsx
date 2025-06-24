'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/shared/AuthLayout';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Ref and state for dynamic image height
  const formRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (formRef.current) {
      // Xóa: const formHeight = ...
    }
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    setError('');

    try {
      // Fake API delay
      setTimeout(() => {
        router.push(`/admin/verification?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
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

      <form onSubmit={handleSubmit} className="space-y-6">
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
    </AuthLayout>
  );
}
