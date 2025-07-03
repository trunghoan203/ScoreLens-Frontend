'use client';

import React, { useState } from 'react';
import { PageBanner } from '@/components/shared/PageBanner';
import { AdminTable } from '@/components/features/AdminTable';
import { AdminFilters } from '@/components/features/AdminFilters';
import { AdminDetailPopup } from '@/components/features/AdminDetailPopup';

const allAdmins = [
  { id: '1', name: 'Nguyễn Văn A', email: 'a@gmail.com', location: 'Hà Nội', status: 'Đã duyệt' },
  { id: '2', name: 'Nguyễn Văn B', email: 'b@gmail.com', location: 'HCM', status: 'Chưa duyệt' },
  { id: '3', name: 'Nguyễn Văn C', email: 'c@gmail.com', location: 'Đà Nẵng', status: 'Bị từ chối' },
];

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const selectedAdmin = allAdmins.find((admin) => admin.id === selectedAdminId) ?? null;

  /**
   * Xử lý click vào từng admin,
   * MỞ POPUP thay vì điều hướng.
   */
  const handleRowClick = (adminId: string) => {
    setSelectedAdminId(adminId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner title="DANH SÁCH ADMIN" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <AdminFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        <AdminTable
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Popup hiển thị chi tiết admin */}
      <AdminDetailPopup
        open={!!selectedAdmin}
        onClose={() => setSelectedAdminId(null)}
        admin={selectedAdmin}
      />
    </div>
  );
}
