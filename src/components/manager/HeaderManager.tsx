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
    <div className="flex items-center justify-between w-full h-full">
      <h1 className="text-2xl font-bold text-[#000000]">Trang chủ</h1>
      <div className="flex items-center gap-6">
        <button className="relative focus:outline-none p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Image 
            src="/icon/bell.svg" 
            alt="Notifications" 
            width={22} 
            height={22} 
            className="text-gray-600 hover:text-gray-800 transition-colors" 
          />
          <span className="absolute -top-0.5 -right-0.5 block w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
          <Image 
            src="/images/Avatar.png" 
            alt="Manager Avatar" 
            width={36} 
            height={36} 
            className="w-full h-full object-cover" 
          />
        </div>
        <span className="text-[#000000] font-medium text-base">{managerName}</span>
      </div>
    </div>
  );
} 