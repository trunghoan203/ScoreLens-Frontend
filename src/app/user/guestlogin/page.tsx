import { Suspense } from 'react';
import { GuestLoginPageClient } from './GuestLoginPageClient';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function GuestLoginPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải trang..." />}>
      <GuestLoginPageClient />
    </Suspense>
  );
}
