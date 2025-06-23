'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      router.push(`/admin/verification?email=${encodeURIComponent(email)}`);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative z-30 flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
        {/* FORM FORGOT PASSWORD */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h2>
            </div>

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
                  className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:text-black focus:border-transparent"
                  placeholder="Nhập email của bạn"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-500 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'Gửi'
                )}
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

        {/* IMAGE */}
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