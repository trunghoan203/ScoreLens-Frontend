"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import ManagerTable from "@/components/admin/ManagerTable";
import { useRouter } from "next/navigation";
import ManagerSearchBar from "@/components/admin/ManagerSearchBar";

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

  return (
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
          setSearch={setSearch}
          onAddManager={() => router.push('/admin/managers/add')}
        />
        <ManagerTable managers={filteredManagers.map(m => ({ ...m, status: m.status as 'active' | 'inactive' }))} />
      </main>
    </div>
  );
} 