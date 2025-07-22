import { Suspense } from 'react';
import { HomeRandomPageClient } from './HomeRandomPageClient';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function HomeRandomPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang khởi tạo phòng..." />}>
      <HomeRandomPageClient />
    </Suspense>
  );
}