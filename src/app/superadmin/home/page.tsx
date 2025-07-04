'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageBanner } from '@/components/shared/PageBanner';
import { AdminTable } from '@/components/features/AdminTable';
import { AdminFilters } from '@/components/features/AdminFilters';
import { FeedbackTable } from '@/components/features/FeedbackTable';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'duyet' | 'phanhoi'>('duyet');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ✅ Dùng useEffect lấy param từ URL thay useSearchParams
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'phanhoi') {
        setActiveTab('phanhoi');
      } else {
        setActiveTab('duyet');
      }
    }
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
    <div className="min-h-screen bg-gray-50">
      <PageBanner title={activeTab === 'duyet' ? 'DANH SÁCH ADMIN' : 'ĐÁNH GIÁ'} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

        {/* TAB SWITCH */}
        <div className="flex justify-center">
          <div className="relative inline-flex bg-gray-200 rounded-full p-1">
            {/* Animated active indicator */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-1 bottom-1 w-1/2 rounded-full bg-lime-500 shadow"
              style={{
                left: activeTab === 'duyet' ? '4px' : 'calc(50% + 4px)',
              }}
            />

            {/* Tab Buttons */}
            <button
              onClick={() => handleTabChange('duyet')}
              className={`relative z-10 px-6 py-2 font-semibold rounded-full transition-colors duration-300 ${
                activeTab === 'duyet' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Đơn duyệt
            </button>
            <button
              onClick={() => handleTabChange('phanhoi')}
              className={`relative z-10 px-6 py-2 font-semibold rounded-full transition-colors duration-300 ${
                activeTab === 'phanhoi' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Phản hồi
            </button>
          </div>
        </div>

        {/* Animated Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'duyet' ? (
            <motion.div
              key="duyet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <FeedbackTable />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
