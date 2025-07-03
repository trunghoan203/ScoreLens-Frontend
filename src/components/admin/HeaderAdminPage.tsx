import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function HeaderAdminPage() {
  const [adminName, setAdminName] = useState<string>('Chưa đăng nhập');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;
    if (token) {
      axios.get('/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data as { fullName?: string; admin?: { fullName?: string } };
        if (data.fullName) {
          setAdminName(data.fullName);
        } else if (data.admin && data.admin.fullName) {
          setAdminName(data.admin.fullName);
        }
      })
      .catch(() => setAdminName('Admin'));
    }
  }, []);

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Trang chủ</h1>
      <div className="flex items-center gap-4">
        {/* Icon thông báo */}
        <button className="relative focus:outline-none">
          <svg className="w-7 h-7 text-gray-500 hover:text-lime-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        {/* Avatar admin */}
        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
        </span>
        <span className="text-gray-700">{adminName}</span>
      </div>
    </div>
  );
} 