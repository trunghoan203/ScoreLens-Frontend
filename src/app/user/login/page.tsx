import { Suspense } from 'react';
import { StartSessionPageClient } from './StartSessionPageClient';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function LoginPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải trang..." />}>
      <StartSessionPageClient />
    </Suspense>
  );
}