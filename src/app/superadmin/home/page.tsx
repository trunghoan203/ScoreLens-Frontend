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
  const [activeTab, setActiveTab] = useState<'approval' | 'feedback'>('approval');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'approval') {
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

  const handleTabChange = (tab: 'approval' | 'feedback') => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.push(`/superadmin/home?${params.toString()}`);
  };

  return (
    <>
      <HeaderAdmin />
      <PageBanner title={activeTab === 'approval' ? 'DANH SÁCH ADMIN' : 'DANH SÁCH PHẢN HỒI'} />
      <div className="bg-[#EEEDED] w-full px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Toggle Tabs */}
          <div className="flex justify-center">
            <div className="relative flex w-[280px] h-[42px] shadow-md rounded overflow-hidden">
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute w-1/2 h-full bg-[#8ADB10]"
                style={{
                  left: activeTab === 'approval' ? '0%' : '50%',
                  borderTopLeftRadius: activeTab === 'approval' ? '0.375rem' : '0',
                  borderBottomLeftRadius: activeTab === 'approval' ? '0.375rem' : '0',
                  borderTopRightRadius: activeTab === 'feedback' ? '0.375rem' : '0',
                  borderBottomRightRadius: activeTab === 'feedback' ? '0.375rem' : '0',
                }}
              />
              <button
                onClick={() => handleTabChange('approval')}
                className={`relative z-10 w-1/2 h-full flex items-center justify-center font-semibold transition-colors duration-300 ${activeTab === 'approval' ? 'text-white' : 'text-white bg-black'
                  } rounded-l`}
              >
                Đơn duyệt
              </button>
              <button
                onClick={() => handleTabChange('feedback')}
                className={`relative z-10 w-1/2 h-full flex items-center justify-center font-semibold transition-colors duration-300 ${activeTab === 'feedback' ? 'text-white' : 'text-white bg-black'
                  } rounded-r`}
              >
                Phản hồi
              </button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {activeTab === 'approval' ? (
              <motion.div
                key="approval"
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
                key="feedback"
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
