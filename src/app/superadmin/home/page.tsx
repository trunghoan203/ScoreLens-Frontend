'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderSuperAdmin } from '@/components/shared/HeaderSuperAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { AdminFilters } from '@/components/features/AdminFilters';
import { AdminTable } from '@/components/features/AdminTable';
import { FeedbackTable } from '@/components/features/FeedbackTable';
import { getAdminList } from '@/lib/saAdminService';
import { useSuperAdminAuthGuard } from '@/lib/hooks/useSuperAdminAuthGuard';
import toast from 'react-hot-toast';

interface ApiAdmin {
  adminId: string;
  fullName: string;
  email: string;
  location?: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface TableAdmin {
  id: string;
  name: string;
  email: string;
  location: string;
  status: 'Đã duyệt' | 'Chưa duyệt' | 'Bị từ chối';
  createdAt: string;
}

function SuperAdminHomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'feedback' ? 'feedback' : 'approval';
  const { isChecking } = useSuperAdminAuthGuard();

  const [activeTab, setActiveTab] = useState<'approval' | 'feedback'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [admins, setAdmins] = useState<TableAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (activeTab === 'approval') {
      if (isInitialLoad || statusFilter !== '') {
        setLoading(true);
      }

      getAdminList({
        search: debouncedSearchTerm,
        status: statusFilter || undefined,
        page: 1,
        limit: 50,
      })
        .then((res) => {
          const data = res.data as { admins: ApiAdmin[] };
          const mappedAdmins: TableAdmin[] = data.admins.map((admin: ApiAdmin) => ({
            id: admin.adminId,
            name: admin.fullName,
            email: admin.email,
            location: admin.location || 'N/A',
            status:
              admin.status === 'approved'
                ? 'Đã duyệt'
                : admin.status === 'pending'
                  ? 'Chưa duyệt'
                  : 'Bị từ chối',
            createdAt: admin.createdAt,
          }));
          setAdmins(mappedAdmins);
          setLoading(false);
          setIsInitialLoad(false);
        })
        .catch(() => {
          toast.error('Không lấy được danh sách admin');
          setAdmins([]);
          setLoading(false);
          setIsInitialLoad(false);
        });
    }
  }, [debouncedSearchTerm, statusFilter, activeTab, isInitialLoad]);

  const handleRowClick = (adminId: string) => {
    router.push(`/superadmin/admin/${adminId}`);
  };

  const handleTabChange = (tab: 'approval' | 'feedback') => {
    setActiveTab(tab);
    router.push(`/superadmin/home?tab=${tab}`, { scroll: false });
  };

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Đang kiểm tra...</div>;
  }

  return (
    <>
      <HeaderSuperAdmin />
      <PageBanner title={activeTab === 'approval' ? 'DANH SÁCH ADMIN' : 'DANH SÁCH PHẢN HỒI'} />
      <div className="bg-[#EEEDED] w-full px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Toggle Tabs */}
          <div className="flex justify-center">
            <div className="relative flex w-[280px] h-[42px] bg-black shadow-md rounded-lg overflow-hidden">
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute w-1/2 h-full bg-[#8ADB10] rounded-lg"
                style={{
                  left: activeTab === 'approval' ? '0%' : '50%',
                }}
              />
              <button
                onClick={() => handleTabChange('approval')}
                className={`relative z-10 w-1/2 h-full flex items-center justify-center font-semibold transition-colors duration-300 ${activeTab === 'approval' ? 'text-white' : 'text-gray-300'}`}
              >
                Đơn duyệt
              </button>
              <button
                onClick={() => handleTabChange('feedback')}
                className={`relative z-10 w-1/2 h-full flex items-center justify-center font-semibold transition-colors duration-300 ${activeTab === 'feedback' ? 'text-white' : 'text-gray-300'}`}
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
                    onRowClick={handleRowClick}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
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

export default function SuperAdminHomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuperAdminHomeContent />
    </Suspense>
  );
}