'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { VerificationPage } from '@/components/shared/VerificationPage';
import Image from 'next/image';

function AdminVerificationPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative z-30 flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
        <VerificationPage
          identifierLabel="email"
          identifierValue={email}
          onSuccess={(code) => router.push(`/admin/reset-password?token=${code}&email=${email}`)}
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

export default function AdminVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminVerificationPageInner />
    </Suspense>
  );
} 