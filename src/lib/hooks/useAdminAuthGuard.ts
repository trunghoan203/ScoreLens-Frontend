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
    // Xóa token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAccessToken');
    }
    
    // Xóa thông tin nhớ mật khẩu nếu có
    adminService.clearRememberMeData();
    
    // Chuyển hướng về trang login
    router.push('/admin/login');
  };

  return { logout };
} 