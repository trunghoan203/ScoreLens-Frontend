import { Suspense } from 'react';
import { GuestJoinPageClient } from './GuestJoinPageClient';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function GuestPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang vào phòng..." />}>
      <GuestJoinPageClient />
    </Suspense>
  );
}