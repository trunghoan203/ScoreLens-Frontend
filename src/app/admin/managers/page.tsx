"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import ManagerTable from "@/components/admin/ManagerTable";
import { useRouter } from "next/navigation";
import ManagerSearchBar from "@/components/admin/ManagerSearchBar";
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { TableSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Dữ liệu mẫu cho managers
const managersData = [
  { name: 'Võ Nguyễn Kim Ngân (người Hon iu chụt chụt)', phone: '0927323726', email: 'hagaoan@gmail.com', status: 'active' },
  { name: 'Võ Nguyễn Kim Ngân (người Hon iu chụt chụt)', phone: '0927323726', email: 'hagaoan@gmail.com', status: 'active' },
  { name: 'Võ Nguyễn Kim Ngân (người Hon iu chụt chụt)', phone: '0927323726', email: 'hagaoan@gmail.com', status: 'inactive' },
  { name: 'Võ Nguyễn Kim Ngân (người Hon iu chụt chụt)', phone: '0927323726', email: 'hagaoan@gmail.com', status: 'active' },
];

export default function ManagersPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const filteredManagers = managersData.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 900);
  };

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderAdminPage />
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              QUẢN LÝ
            </span>
          </div>
          {/* Thanh tìm kiếm và nút thêm quản lý */}
          <ManagerSearchBar
            search={search}
            setSearch={handleSearch}
            onAddManager={() => router.push('/admin/managers/add')}
          />
          {tableLoading ? (
            <div className="mt-6"><TableSkeleton rows={5} /></div>
          ) : filteredManagers.length === 0 ? (
            <div className="mt-6"><LoadingSkeleton type="card" lines={1} className="w-full max-w-md mx-auto" /></div>
          ) : (
            <ManagerTable managers={filteredManagers.map(m => ({ ...m, status: m.status as 'active' | 'inactive' }))} />
          )}
        </main>
      </div>
    </>
  );
} 