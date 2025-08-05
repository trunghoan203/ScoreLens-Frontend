import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Image from 'next/image';

export default function HeaderManager() {
  const [managerName, setManagerName] = useState<string>('Chưa đăng nhập');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('managerAccessToken') : null;
    if (token) {
      axios.get('/manager/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data as { fullName?: string; manager?: { fullName?: string } };
        if (data.fullName) {
          setManagerName(data.fullName);
        } else if (data.manager && data.manager.fullName) {
          setManagerName(data.manager.fullName);
        }
      })
      .catch(() => setManagerName('Manager'));
    }
  }, []);

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-[#000000]">Trang chủ</h1>
      <div className="flex items-center gap-4">
        <button className="relative focus:outline-none">
          <Image src="/icon/bell.svg" alt="Notifications" width={28} height={28} className="text-gray-500 hover:text-lime-500 transition" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image src="/images/Avatar.png" alt="Manager Avatar" width={32} height={32} className="w-full h-full object-cover" />
        </div>
        <span className="text-[#000000]">{managerName}</span>
      </div>
    </div>
  );
} 