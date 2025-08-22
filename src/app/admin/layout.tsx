'use client';
import { usePathname } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname?.startsWith('/admin/confirm');

  return (
    <>
      {showHeader && <HeaderAdmin />}
      <div className={showHeader ? 'pt-16 sm:pt-20' : ''}>
        {children}
      </div>
    </>
  );
} 