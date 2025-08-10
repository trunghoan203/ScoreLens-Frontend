'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface SearchParamsWrapperProps {
  children: (searchParams: URLSearchParams | null) => React.ReactNode;
  fallback?: React.ReactNode;
}

function SearchParamsContent({ children }: { children: (searchParams: URLSearchParams | null) => React.ReactNode }) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export function SearchParamsWrapper({ children, fallback = null }: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <SearchParamsContent>{children}</SearchParamsContent>
    </Suspense>
  );
}
