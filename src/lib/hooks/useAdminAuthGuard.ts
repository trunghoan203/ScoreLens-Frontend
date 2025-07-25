import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuthGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;
    if (!token) {
      router.replace('/admin/login');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  return { isChecking };
} 