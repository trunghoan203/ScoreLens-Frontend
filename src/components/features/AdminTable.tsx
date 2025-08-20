'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type AdminStatus = 'Đã duyệt' | 'Chưa duyệt' | 'Bị từ chối';

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

const statusVariantMap: Record<AdminStatus, 'success' | 'danger' | 'default'> = {
  'Đã duyệt': 'success',
  'Chưa duyệt': 'default',
  'Bị từ chối': 'danger',
};

interface AdminTableProps {
  admins: Admin[];
  searchTerm: string;
  statusFilter: string;
  onRowClick: (adminId: string) => void;
}

export function AdminTable({ admins, searchTerm, statusFilter, onRowClick }: AdminTableProps) {
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
          matchesStatus = admin.status === 'Đã duyệt';
          break;
        case 'pending':
          matchesStatus = admin.status === 'Chưa duyệt';
          break;
        case 'rejected':
          matchesStatus = admin.status === 'Bị từ chối';
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
    <div className="w-full space-y-2">
      {/* Header */}
      <div className="grid grid-cols-3 bg-black text-white text-center font-semibold text-sm rounded-t-lg">
        <div className="py-3">Tên</div>
        <div className="py-3">Email</div>
        <div className="py-3">Trạng thái</div>
      </div>

      {/* Body */}
      <div className="space-y-2">
        {visibleAdmins.length > 0 ? (
          visibleAdmins.map((admin) => (
            <div
              key={admin.id}
              onClick={() => onRowClick(admin.id)}
              className="grid grid-cols-3 items-center text-center text-sm text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="py-4 font-semibold text-black text-lg">{admin.name}</div>
              <div className="py-4">{admin.email}</div>
              <div className="py-4 flex justify-center">
                <Badge
                  variant={statusVariantMap[admin.status]}
                  className="rounded-full px-5 py-2 text-base font-semibold"
                >
                  {admin.status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">Không tìm thấy admin nào.</div>
        )}
      </div>

      {visibleCount < sortedAdmins.length && (
        <div className="text-center pt-4">
          <Button
            onClick={handleLoadMore}
            className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-8 py-3 text-base rounded-xl hover:shadow-md transition"
          >
            XEM THÊM
          </Button>
        </div>
      )}
    </div>
  );
}