'use client';
import { usePathname } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Chỉ render HeaderAdmin ở trang /admin/confirm (và các trang con nếu muốn)
  const showHeader = pathname?.startsWith('/admin/confirm');

  return (
    <>
      {showHeader && <HeaderAdmin />}
      {children}
    </>
  );
} 