"use client";
import React, { useState } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import TableSearchBar from "@/components/manager/TableSearchBar";
import TableGrid from "@/components/manager/TableGrid";
import TablePageBanner from "@/components/manager/TablePageBanner";
import { useRouter } from "next/navigation";

// Dữ liệu mẫu cho bàn
const tablesData = [
  { id: '1', name: '01', type: 'pool', status: 'using' as const },
  { id: '2', name: '02', type: 'carom', status: 'available' as const },
];

export default function TablesPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const filteredTables = tablesData.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddTable = () => {
    // Logic thêm bàn mới
    router.push('/manager/tables/add');
  };

  const handleTableClick = (tableId: string) => {
    // Logic xử lý khi click vào bàn
    router.push(`/manager/tables/${tableId}`);
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderManager />
        <TablePageBanner />
        <TableSearchBar
          search={search}
          setSearch={setSearch}
          onAddTable={handleAddTable}
        />
        <TableGrid
          tables={filteredTables}
          onTableClick={handleTableClick}
        />
      </main>
    </div>
  );
} 