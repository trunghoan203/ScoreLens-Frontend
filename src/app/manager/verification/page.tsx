'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { VerificationPage } from '@/components/shared/VerificationPage';
import Image from 'next/image';

function ManagerVerificationPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clubCode = searchParams.get('clubCode') || '';

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative z-30 flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
        <VerificationPage
          identifierLabel="mã quản lý"
          identifierValue={clubCode}
          onSuccess={(code) => router.push(`/manager/reset-password?token=${code}&clubCode=${clubCode}`)}
        />
        <div className="hidden md:block w-[400px] h-[500px]">
          <Image
            src="/images/imgLogin.png"
            alt="Billiards table"
            width={400}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function ManagerVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManagerVerificationPageInner />
    </Suspense>
  );
} 