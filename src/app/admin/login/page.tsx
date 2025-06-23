'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login attempt:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
        {/* FORM LOGIN */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-[400px] h-[500px]">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logoScoreLensBlack.png"
              alt="ScoreLens Logo"
              width={200}
              height={50}
              priority
            />
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
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:text-black focus:border-transparent"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:text-black focus:border-transparent"
                placeholder="********"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-lime-500 focus:ring-lime-400 border-gray-300 rounded"
                />
                <span className="text-gray-700">Nhớ mật khẩu</span>
              </label>
              <Link href="#" className="font-medium text-gray-800 hover:text-lime-500">
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-500 transition-all hover:scale-105"
            >
              Đăng nhập
            </Button>
          </form>
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
