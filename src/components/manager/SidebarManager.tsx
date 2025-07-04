import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { Button } from '@/components/ui/button';

export default function SidebarManager() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(false);
    // Thực hiện logout thực tế ở đây
    router.push('/');
  };

  return (
    <aside className="w-64 bg-[#18191A] text-white flex flex-col py-8 px-4 min-h-screen">
      <div className="flex flex-col items-center mb-10">
        <ScoreLensLogo />
      </div>
      <nav className="flex-1 space-y-2">
        <Link
          href="/manager/dashboard"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/dashboard') ? 'bg-lime-400 text-black' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Trang chủ
        </Link>
        <Link
          href="/manager/camera"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/camera') ? 'bg-lime-400 text-black' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Quản lý camera
        </Link>
        <Link
          href="/manager/members"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/members') ? 'bg-lime-400 text-black' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Quản lý hội viên
        </Link>
        <Link
          href="/manager/tables"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/tables') ? 'bg-lime-400 text-black' : 'hover:bg-lime-100 hover:text-black'}`}
        >
          Quản lý bàn
        </Link>
        <Link
          href="/manager/feedbacks"
          className={`block px-4 py-2 rounded-lg font-semibold transition ${pathname?.startsWith('/manager/feedbacks') ? 'bg-lime-400 text-black' : 'hover:bg-lime-100 hover:text-black'}`}
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