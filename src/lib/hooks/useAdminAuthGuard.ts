import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '../adminService';

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

export function useAdminLogout() {
  const router = useRouter();

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAccessToken');
    }

    adminService.clearRememberMeData();

    router.push('/admin/login');
  };

  return { logout };
} 