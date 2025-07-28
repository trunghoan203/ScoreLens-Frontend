import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';
import Image from 'next/image';

export default function SidebarManager() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    setShowLogout(false);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('managerAccessToken') : null;
      if (token) {
        await axios.post('/manager/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('managerAccessToken');
      }
      toast.success('Đăng xuất thành công!');
    } catch {
      localStorage.removeItem('managerAccessToken');
      toast.error('Đăng xuất thất bại.');
    }
    router.push('/');
  };

  return (
    <aside className="w-64 bg-[#181818] text-white flex flex-col py-8 px-4 min-h-screen sticky top-0 h-screen z-30">
      <div className="flex flex-col items-center mb-10">
        <ScoreLensLogo href="/manager/dashboard" />
      </div>
      <nav className="flex-1 space-y-2">
        <Link
          href="/manager/dashboard"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/dashboard') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Trang chủ
        </Link>
        <Link
          href="/manager/camera"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/camera') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Quản lý camera
        </Link>
        <Link
          href="/manager/members"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/members') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Quản lý hội viên
        </Link>
        <Link
          href="/manager/tables"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/tables') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Quản lý bàn
        </Link>
        <Link
          href="/manager/feedbacks"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/feedbacks') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Phản hồi
        </Link>
        <Button
          type="button"
          variant="lime"
          className="w-full font-bold text-white px-8 py-3 rounded-xl text-base mt-4"
          onClick={() => setShowLogout(true)}
        >
          Đăng xuất
        </Button>
      </nav>
      <ConfirmPopup
        open={showLogout}
        title="Bạn có chắc chắn muốn đăng xuất không?"
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
        confirmText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="flex flex-col items-center justify-center">
          <Image src="/icon/window.svg" alt="Logout" width={64} height={64} className="text-black my-4" />
        </div>
      </ConfirmPopup>
    </aside>
  );
} 