'use client';
import { usePathname } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname?.startsWith('/admin/confirm');

  return (
    <>
      {showHeader && <HeaderAdmin />}
      {children}
    </>
  );
} 