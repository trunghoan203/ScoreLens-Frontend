'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function AdminRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Tiêu đề lớn */}
      <h1 className="text-3xl md:text-4xl font-bold text-center pt-12 pb-8 text-black">
        ĐĂNG KÝ TÀI KHOẢN ADMIN
      </h1>

      {/* Steps */}
      <div className="flex flex-row justify-center mb-10 w-full max-w-2xl mx-auto">
        <button className="flex-1 py-3 rounded-tl-lg rounded-bl-lg bg-lime-400 text-black font-semibold text-lg">
          Đăng ký tài khoản
        </button>
        <button className="flex-1 py-3 bg-black text-white font-semibold text-lg">
          Thông tin chi tiết
        </button>
        <button className="flex-1 py-3 rounded-tr-lg rounded-br-lg bg-black text-white font-semibold text-lg">
          Xác nhận
        </button>
      </div>

      {/* Form */}
      <form className="w-full max-w-md mx-auto flex flex-col gap-6 items-center px-0 pb-8" autoComplete="off">
        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:text-black focus:ring-lime-400"
            placeholder="Nhập email của bạn"
            required
          />
        </div>

        {/* ✅ Password với PasswordInput */}
        <div className="w-full">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Mật khẩu
          </label>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:text-black focus:border-transparent"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <div className="w-full flex items-center gap-2">
          <input
            id="agree"
            type="checkbox"
            checked={agree}
            onChange={e => setAgree(e.target.checked)}
            className="h-4 w-4 text-lime-500 border-gray-300 rounded focus:ring-lime-400"
            required
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            Tôi đăng ký và đã đọc các{' '}
            <Link href="#" className="text-lime-600 underline">
              Điều khoản và chính sách bảo mật
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-500 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!email || !password || !agree}
        >
          Tiếp tục
        </Button>

        <div className="text-center w-full mt-2">
          <span className="text-gray-800 text-sm">Đã có tài khoản? </span>
          <Link href="/admin/login" className="text-lime-600 font-semibold hover:underline text-sm">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
