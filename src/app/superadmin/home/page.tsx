import { Suspense } from 'react';
import { AdminsPageClient } from './AdminsPageClient';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function SuperAdminHomePage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải trang quản trị..." />}>
      <AdminsPageClient />
    </Suspense>
  );
}