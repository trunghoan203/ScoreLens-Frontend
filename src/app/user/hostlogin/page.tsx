import { Suspense } from 'react';
import { HostLoginPageClient } from './HostLoginPageClient';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function HostLoginPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải trang..." />}>
      <HostLoginPageClient />
    </Suspense>
  );
}