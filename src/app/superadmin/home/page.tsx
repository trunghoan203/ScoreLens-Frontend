'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { AdminFilters } from '@/components/features/AdminFilters';
import { AdminTable } from '@/components/features/AdminTable';
import { FeedbackTable } from '@/components/features/FeedbackTable';

export default function AdminsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'duyet' | 'phanhoi'>('duyet');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveTab(params.get('tab') === 'phanhoi' ? 'phanhoi' : 'duyet');
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
    <>
      {/* 1. Header full-width at the very top */}
      <HeaderAdmin />

      {/* 2. Banner sits directly under header */}
      <PageBanner title={activeTab === 'duyet' ? 'DANH SÁCH ADMIN' : 'DANH SÁCH PHẢN HỒI'} />

      {/* 3. Container frame for the rest of the page */}
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
                  left: activeTab === 'duyet' ? '0%' : '50%',
                  borderTopLeftRadius: activeTab === 'duyet' ? '0.375rem' : '0',
                  borderBottomLeftRadius: activeTab === 'duyet' ? '0.375rem' : '0',
                  borderTopRightRadius: activeTab === 'phanhoi' ? '0.375rem' : '0',
                  borderBottomRightRadius: activeTab === 'phanhoi' ? '0.375rem' : '0',
                }}
              />
              <button
                onClick={() => handleTabChange('duyet')}
                className={`relative z-10 w-1/2 h-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                  activeTab === 'duyet' ? 'text-white' : 'text-white bg-black'
                } rounded-l`}
              >
                Đơn duyệt
              </button>
              <button
                onClick={() => handleTabChange('phanhoi')}
                className={`relative z-10 w-1/2 h-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                  activeTab === 'phanhoi' ? 'text-white' : 'text-white bg-black'
                } rounded-r`}
              >
                Phản hồi
              </button>
            </div>
          </div>

          {/* Dynamic Content */}
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
    </>
  );
}
