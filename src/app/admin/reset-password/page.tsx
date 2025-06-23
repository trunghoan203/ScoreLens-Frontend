'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import Link from 'next/link';
import Image from 'next/image';

function AdminResetPasswordPageInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="relative z-30 flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col justify-center p-8 md:p-12 w-[400px] h-[500px]">
            <div className="flex flex-col items-center">
              <Image
                src="/images/logoScoreLensBlack.png"
                alt="ScoreLens Logo"
                width={200}
                height={50}
                priority
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu thành công!</h2>
                <p className="text-gray-600">
                  Bạn đã có thể đăng nhập với mật khẩu mới.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => router.push('/admin/login')}
                    className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-500 transition-all hover:scale-105"
                  >
                    Quay lại đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-[400px] h-[500px]">
            <Image
              src="/images/imgLogin.png"
              alt="Billiards table"
              width={400}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative z-30 flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col justify-center p-8 md:p-12 w-[400px] h-[500px]">
          <div className="flex flex-col items-center">
            <Image
              src="/images/logoScoreLensBlack.png"
              alt="ScoreLens Logo"
              width={200}
              height={50}
              priority
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h2>
              <p className="text-gray-600">
                {email ? <>Đặt lại mật khẩu cho <strong>{email}</strong></> : 'Vui lòng nhập mật khẩu mới.'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="Nhập mật khẩu mới"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-500 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </Button>
              <div className="text-center">
                <Link 
                  href="/admin/login" 
                  className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors"
                >
                  ← Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden md:block w-[400px] h-[500px]">
          <Image
            src="/images/imgLogin.png"
            alt="Billiards table"
            width={400}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminResetPasswordPageInner />
    </Suspense>
  );
} 