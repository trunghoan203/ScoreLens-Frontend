'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/provider';

type AdminStatus = string;

interface Admin {
  id: string;
  name: string;
  email: string;
  status: AdminStatus;
  createdAt: string;
  brand?: {
    address: string;
  };
}

const getStatusVariant = (status: string): 'success' | 'danger' | 'default' => {
  switch (status) {
    case 'Đã duyệt':
    case 'Approved':
      return 'success';
    case 'Bị từ chối':
    case 'Rejected':
      return 'danger';
    case 'Chưa duyệt':
    case 'Pending':
    default:
      return 'default';
  }
};

interface AdminTableProps {
  admins: Admin[];
  searchTerm: string;
  statusFilter: string;
  onRowClick: (adminId: string) => void;
}

export function AdminTable({ admins, searchTerm, statusFilter, onRowClick }: AdminTableProps) {
  const { t } = useI18n();
  const [visibleCount, setVisibleCount] = React.useState(5);

  const sortedAdmins = admins.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const filteredAdmins = sortedAdmins.filter((admin) => {
    const searchLower = searchTerm.toLowerCase();
    const nameLower = admin.name.toLowerCase();
    const emailLower = admin.email.toLowerCase();

    const matchesSearch = nameLower.includes(searchLower) || emailLower.includes(searchLower);

    let matchesStatus = true;
    if (statusFilter) {
      switch (statusFilter) {
        case 'approved':
          matchesStatus = admin.status === t('superAdminHome.statusApproved');
          break;
        case 'pending':
          matchesStatus = admin.status === t('superAdminHome.statusPending');
          break;
        case 'rejected':
          matchesStatus = admin.status === t('superAdminHome.statusRejected');
          break;
        default:
          matchesStatus = true;
      }
    }

    return matchesSearch && matchesStatus;
  });

  const visibleAdmins = filteredAdmins.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="w-full">
      <div className="hidden lg:block overflow-x-auto">
        <div className="space-y-2 rounded-lg min-w-[800px]">
          <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
            <div className="col-span-4 py-3 text-sm xl:text-base">{t('superAdminHome.table.name')}</div>
            <div className="col-span-4 py-3 text-sm xl:text-base">{t('superAdminHome.table.email')}</div>
            <div className="col-span-4 py-3 text-sm xl:text-base">{t('superAdminHome.table.status')}</div>
          </div>
          {visibleAdmins.length > 0 ? (
            visibleAdmins.map((admin) => (
              <div
                key={admin.id}
                className="grid grid-cols-12 items-center text-center bg-white rounded-lg cursor-pointer hover:bg-lime-50 transition"
                onClick={() => onRowClick(admin.id)}
              >
                <div className="col-span-4 py-4 font-semibold text-black text-sm xl:text-base px-2">{admin.name}</div>
                <div className="col-span-4 py-4 text-gray-700 text-sm xl:text-base px-2">{admin.email}</div>
                <div className="col-span-4 py-4 flex justify-center px-2">
                  <Badge
                    variant={getStatusVariant(admin.status)}
                    className="rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-base font-semibold"
                  >
                    {admin.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">{t('superAdminHome.noAdminsFound')}</div>
          )}
        </div>
      </div>

      <div className="block lg:hidden space-y-3">
        {visibleAdmins.length > 0 ? (
          visibleAdmins.map((admin) => (
            <div
              key={admin.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
              onClick={() => onRowClick(admin.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base mb-1">{admin.name}</h3>
                  <p className="text-gray-600 text-sm">{admin.email}</p>
                </div>
                <Badge
                  variant={getStatusVariant(admin.status)}
                  className="ml-3 px-3 py-1 rounded-full text-white font-medium text-xs flex-shrink-0"
                >
                  {admin.status}
                </Badge>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-end">
                  <span className="text-lime-600 text-xs font-medium">{t('superAdminHome.table.clickToViewDetails')}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">{t('superAdminHome.noAdminsFound')}</div>
        )}
      </div>

      {visibleCount < sortedAdmins.length && (
        <div className="text-center pt-3 sm:pt-4">
          <Button
            onClick={handleLoadMore}
            className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl hover:shadow-md transition"
          >
            {t('superAdminHome.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}