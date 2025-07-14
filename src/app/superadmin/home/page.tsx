'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { AdminFilters } from '@/components/features/AdminFilters';
import { AdminTable } from '@/components/features/AdminTable';
import { FeedbackTable } from '@/components/features/FeedbackTable';
import { getAdminList } from '@/lib/superAdminService';
import toast from 'react-hot-toast';

export default function AdminsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'duyet' | 'phanhoi'>('duyet');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'duyet') {
      setLoading(true);
      getAdminList({
        search: searchTerm,
        status: statusFilter,
        page: 1,
        limit: 50,
      })
        .then((res) => {
          const data = res.data as { admins: any[] };
          setAdmins(
            data.admins.map((admin: any) => ({
              id: admin.adminId,
              name: admin.fullName,
              email: admin.email,
              location: admin.location || '',
              status:
                admin.status === 'approved'
                  ? 'Đã duyệt'
                  : admin.status === 'pending'
                    ? 'Chưa duyệt'
                    : 'Bị từ chối',
            }))
          );
          setLoading(false);
        })
      setLoading(true);
      getAdminList({
        search: searchTerm,
        status: statusFilter,
        page: 1,
        limit: 50,
      })
        .then((res) => {
          const data = res.data as { admins: any[] };
          setAdmins(
            data.admins.map((admin: any) => ({
              id: admin.adminId,
              name: admin.fullName,
              email: admin.email,
              location: admin.location || '',
              status:
                admin.status === 'approved'
                  ? 'Đã duyệt'
                  : admin.status === 'pending'
                    ? 'Chưa duyệt'
                    : 'Bị từ chối',
            }))
          );
          setLoading(false);
        })
        .catch(() => {
          toast.error('Không lấy được danh sách admin');
          setLoading(false);
        });
    }
  }, [searchTerm, statusFilter, activeTab]);

  const handleRowClick = (adminId: string) => {
    router.push(`/superadmin/admin/${adminId}`);
  };

  const handleTabChange = (tab: 'duyet' | 'phanhoi') => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.push(`/superadmin/home?${params.toString()}`);
  };

  return (
    <>
      <HeaderAdmin />
      <PageBanner title={activeTab === 'duyet' ? 'DANH SÁCH ADMIN' : 'DANH SÁCH PHẢN HỒI'} />
      <div className="bg-[#EEEDED] w-full px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          <div className="flex justify-center">
            {/* ...tab code giữ nguyên... */}
          </div>
          <AnimatePresence mode="wait">
            {activeTab === 'duyet' ? (
              <motion.div
                key="duyet"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <AdminFilters
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onSearchChange={setSearchTerm}
                  onStatusChange={setStatusFilter}
                />
                {loading ? (
                  <div className="text-center py-8">Đang tải...</div>
                ) : (
                  <AdminTable
                    admins={admins}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    onRowClick={handleRowClick}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="phanhoi"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <FeedbackTable />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
