import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useManagerAuthGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('managerAccessToken') : null;
    if (!token) {
      router.replace('/manager/login');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  return { isChecking };
} 