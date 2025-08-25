import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { useMobileMenuStore } from '@/lib/mobileMenuState';
import { useI18n } from '@/lib/i18n/provider';

export default function SidebarManager() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenuStore();
  const { t } = useI18n();

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
      toast.success(t('common.logoutSuccess'));
    } catch {
      localStorage.removeItem('managerAccessToken');
      toast.error(t('common.logoutFailed'));
    }
    router.push('/');
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, setIsMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isDashboardOrMatch = pathname?.startsWith('/manager/dashboard') || pathname?.startsWith('/manager/matches');

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className="hidden lg:flex w-64 bg-[#181818] text-white flex-col py-8 px-4 min-h-screen sticky top-0 h-screen z-30">
        <div className="flex flex-col items-center mb-10">
          <ScoreLensLogo href="/manager/dashboard" />
        </div>
        <nav className="flex-1 space-y-2">
          <Link
            href="/manager/dashboard"
            className={`block px-4 py-3 rounded-lg font-semibold transition text-sm xl:text-base ${isDashboardOrMatch ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.dashboard')}
          </Link>
          <Link
            href="/manager/tables"
            className={`block px-4 py-3 rounded-lg font-semibold transition text-sm xl:text-base ${pathname?.startsWith('/manager/tables') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.tables')}
          </Link>
          <Link
            href="/manager/members"
            className={`block px-4 py-3 rounded-lg font-semibold transition text-sm xl:text-base ${pathname?.startsWith('/manager/members') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.members')}
          </Link>
          <Link
            href="/manager/camera"
            className={`block px-4 py-3 rounded-lg font-semibold transition text-sm xl:text-base ${pathname?.startsWith('/manager/camera') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.cameras')}
          </Link>
          <Link
            href="/manager/feedbacks"
            className={`block px-4 py-3 rounded-lg font-semibold transition text-sm xl:text-base ${pathname?.startsWith('/manager/feedbacks') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.feedbacks')}
          </Link>
          <Button
            type="button"
            variant="lime"
            className="w-full font-bold text-white px-6 py-3 rounded-xl text-sm xl:text-base mt-6"
            onClick={() => setShowLogout(true)}
          >
            {t('common.logout')}
          </Button>
        </nav>
      </aside>

      <aside
        className={`lg:hidden fixed top-0 left-0 w-80 max-w-[90vw] bg-[#181818] text-white flex flex-col py-6 px-4 h-full z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 flex justify-center">
            <ScoreLensLogo href="/manager/dashboard" />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-700 transition"
            aria-label={t('common.closeMenu')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-3">
          <Link
            href="/manager/dashboard"
            onClick={handleLinkClick}
            className={`block px-4 py-4 rounded-lg font-semibold transition text-base touch-manipulation ${isDashboardOrMatch ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.dashboard')}
          </Link>
          <Link
            href="/manager/tables"
            onClick={handleLinkClick}
            className={`block px-4 py-4 rounded-lg font-semibold transition text-base touch-manipulation ${pathname?.startsWith('/manager/tables') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.tables')}
          </Link>
          <Link
            href="/manager/members"
            onClick={handleLinkClick}
            className={`block px-4 py-4 rounded-lg font-semibold transition text-base touch-manipulation ${pathname?.startsWith('/manager/members') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.members')}
          </Link>
          <Link
            href="/manager/camera"
            onClick={handleLinkClick}
            className={`block px-4 py-4 rounded-lg font-semibold transition text-base touch-manipulation ${pathname?.startsWith('/manager/camera') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.cameras')}
          </Link>
          <Link
            href="/manager/feedbacks"
            onClick={handleLinkClick}
            className={`block px-4 py-4 rounded-lg font-semibold transition text-base touch-manipulation ${pathname?.startsWith('/manager/feedbacks') ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'hover:bg-lime-100 hover:text-black'}`}
          >
            {t('nav.feedbacks')}
          </Link>
          <div className="pt-4">
            <Button
              type="button"
              variant="lime"
              className="w-full font-bold text-white px-6 py-4 rounded-xl text-base touch-manipulation"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowLogout(true);
              }}
            >
              {t('common.logout')}
            </Button>
          </div>
        </nav>
      </aside>

      <ConfirmPopup
        open={showLogout}
        title={t('common.confirmLogout')}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
      >
        <div className="flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-black my-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
        </div>
      </ConfirmPopup>
    </>
  );
} 