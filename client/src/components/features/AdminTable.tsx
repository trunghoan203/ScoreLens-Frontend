'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type AdminStatus = 'Đã duyệt' | 'Chưa duyệt' | 'Bị từ chối';

interface Admin {
  id: string;
  name: string;
  email: string;
  location: string;
  status: AdminStatus;
}

const allAdmins: Admin[] = [
    { id: '1', name: 'Vũ Nguyễn Kim Ngân', email: 'nv20181@gmail.com', location: 'Quy Nhơn', status: 'Đã duyệt' },
    { id: '2', name: 'Vũ Nguyễn Kim Ngân', email: 'nv20181@gmail.com', location: 'Quy Nhơn', status: 'Chưa duyệt' },
    { id: '3', name: 'Vũ Nguyễn Kim Ngân', email: 'nv20181@gmail.com', location: 'Quy Nhơn', status: 'Đã duyệt' },
    { id: '4', name: 'Vũ Nguyễn Kim Ngân', email: 'nv20181@gmail.com', location: 'Quy Nhơn', status: 'Bị từ chối' },
    { id: '5', name: 'Vũ Nguyễn Kim Ngân', email: 'nv20181@gmail.com', location: 'Quy Nhơn', status: 'Đã duyệt' },
    { id: '6', name: 'Vũ Nguyễn Kim Ngân', email: 'nv20181@gmail.com', location: 'Quy Nhơn', status: 'Đã duyệt' },
    { id: '7', name: 'Vũ Nguyễn Kim Ngân', email: 'nv20181@gmail.com', location: 'Quy Nhơn', status: 'Bị từ chối' },
    { id: '8', name: 'Vũ Nguyễn Kim Ngân', email: 'nv20181@gmail.com', location: 'Quy Nhơn', status: 'Chưa duyệt' },
];

const statusVariantMap: Record<AdminStatus, 'success' | 'danger' | 'default'> = {
  'Đã duyệt': 'success',
  'Chưa duyệt': 'danger',
  'Bị từ chối': 'default',
};

interface AdminTableProps {
  searchTerm: string;
  statusFilter: string;
}

export function AdminTable({ searchTerm, statusFilter }: AdminTableProps) {
  const [visibleCount, setVisibleCount] = React.useState(5);

  const filteredAdmins = allAdmins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || admin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const visibleAdmins = filteredAdmins.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const headers = ['Tên', 'Email', 'Địa điểm', 'Trạng thái'];

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="hidden rounded-lg bg-gray-900 text-white md:grid md:grid-cols-4 md:gap-4 md:px-6 md:py-3">
        {headers.map((header) => (
          <div key={header} className="text-center text-xs font-medium uppercase tracking-wider">
            {header}
          </div>
        ))}
      </div>

      {/* Table Body - Cards */}
      <div className="space-y-3">
        {visibleAdmins.length > 0 ? (
          visibleAdmins.map((admin) => (
            <div
              key={admin.id}
              className="grid grid-cols-1 items-center gap-4 rounded-lg bg-white p-4 text-center shadow transition hover:shadow-md md:grid-cols-4"
            >
              <div className="md:col-span-1">
                <span className="font-medium text-gray-900">{admin.name}</span>
              </div>
              <div className="text-gray-600 md:col-span-1">{admin.email}</div>
              <div className="text-gray-600 md:col-span-1">{admin.location}</div>
              <div className="flex justify-center md:col-span-1">
                <Badge variant={statusVariantMap[admin.status]}>{admin.status}</Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>Không tìm thấy admin nào.</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredAdmins.length && (
        <div className="pt-4 text-center">
          <Button
            onClick={handleLoadMore}
            className="bg-lime-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-lime-600"
          >
            XEM THÊM
          </Button>
        </div>
      )}
    </div>
  );
} 