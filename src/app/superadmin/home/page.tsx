'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminTable } from '@/components/features/AdminTable';
import { AdminFilters } from '@/components/features/AdminFilters';
import { FeedbackTable } from '@/components/features/FeedbackTable';
import { PageBanner } from '@/components/shared/PageBanner';

export default function AdminsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'duyet' | 'phanhoi'>('duyet');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'phanhoi') setActiveTab('phanhoi');
    else setActiveTab('duyet');
  }, []);

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
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <PageBanner title={activeTab === 'duyet' ? 'DANH SÁCH ADMIN' : 'DANH SÁCH PHẢN HỒI'} />

        <div className="flex justify-center">
          <div className="relative flex items-center bg-gray-200 rounded-full p-1 shadow">
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute h-[40px] w-[140px] rounded-full bg-lime-500 shadow"
              style={{ left: activeTab === 'duyet' ? '4px' : 'calc(50% + 4px)' }}
            />
            <button
              onClick={() => handleTabChange('duyet')}
              className={`relative z-10 w-[140px] h-[40px] flex items-center justify-center font-semibold rounded-full transition-colors duration-300 ${activeTab === 'duyet' ? 'text-white' : 'text-gray-700'}`}
            >
              Đơn duyệt
            </button>
            <button
              onClick={() => handleTabChange('phanhoi')}
              className={`relative z-10 w-[140px] h-[40px] flex items-center justify-center font-semibold rounded-full transition-colors duration-300 ${activeTab === 'phanhoi' ? 'text-white' : 'text-gray-700'}`}
            >
              Phản hồi
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 md:p-6">
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
                <AdminTable
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onRowClick={handleRowClick}
                />
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
    </main>
  );
}