'use client';

import React, { useState } from 'react';
import { PageBanner } from '@/components/shared/PageBanner';
import { AdminTable } from '@/components/features/AdminTable';
import { AdminFilters } from '@/components/features/AdminFilters';

const AdminsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner title="DANH SÁCH ADMIN" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />
        <AdminTable searchTerm={searchTerm} statusFilter={statusFilter} />
      </div>
    </div>
  );
};

export default AdminsPage; 