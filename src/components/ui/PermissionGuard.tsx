import React from 'react';

interface PermissionGuardProps {
  children: React.ReactNode;
  canAccess: boolean;
  fallback?: React.ReactNode;
  requiredRole?: 'host' | 'participant' | 'manager';
  currentRole?: 'host' | 'participant' | 'manager';
  showFallback?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  canAccess,
  fallback,
  requiredRole,
  currentRole,
  showFallback = true
}) => {
  if (canAccess) {
    return <>{children}</>;
  }

  if (!showFallback) {
    return null;
  }

  // Fallback mặc định nếu không có fallback tùy chỉnh
  if (!fallback) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Bạn không có quyền truy cập
            </p>
            {requiredRole && currentRole && (
              <p className="text-xs text-yellow-700">
                Yêu cầu: <strong>{requiredRole}</strong> | Hiện tại: <strong>{currentRole}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{fallback}</>;
};

export default PermissionGuard;
