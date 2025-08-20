import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useSuperAdminAuthGuard() {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const publicPaths = ['/superadmin/login', '/superadmin/verification', '/superadmin/register'];
            if (publicPaths.includes(pathname)) {
                setIsChecking(false);
                return;
            }

            const accessToken = localStorage.getItem('superAdminAccessToken');

            const refreshToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('refresh_token='))
                ?.split('=')[1];

            if (!accessToken && !refreshToken) {
                localStorage.clear();
                document.cookie.split(";").forEach(function (c) {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                router.replace('/superadmin/login');
                return;
            }

            setIsChecking(false);
        };

        const timer = setTimeout(checkAuth, 100);
        return () => clearTimeout(timer);
    }, [router, pathname]);

    return { isChecking };
}
