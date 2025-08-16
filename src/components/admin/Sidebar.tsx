import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    setShowLogout(false);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;
      if (token) {
        await axios.post('/admin/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('adminAccessToken');
      }
      toast.success('Đăng xuất thành công!');
    } catch {
      localStorage.removeItem('adminAccessToken');
      toast.error('Đăng xuất thất bại.');
    }
    router.push('/');
  };

  return (
    <aside className="w-64 bg-[#181818] text-white flex flex-col py-8 px-4 min-h-screen sticky top-0 h-screen z-30">
      <div className="flex flex-col items-center mb-10">
        <ScoreLensLogo href="/admin/branches" />
      </div>
      <nav className="flex-1 space-y-2">
        <Link
          href="/admin/branches"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/admin/branches') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Chi nhánh
        </Link>
        <Link
          href="/admin/managers"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/admin/managers') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Quản lý
        </Link>
        <Link
          href="/admin/club"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/admin/club') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Thương hiệu
        </Link>
        <Link
          href="/admin/feedbacks"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/admin/feedbacks') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
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
          <svg className="w-16 h-16 text-black my-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
        </div>
      </ConfirmPopup>
    </aside>
  );
} 