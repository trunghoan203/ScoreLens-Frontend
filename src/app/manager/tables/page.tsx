"use client";
import React, { useState } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import TableSearchBar from "@/components/manager/TableSearchBar";
import TableGrid from "@/components/manager/TableGrid";
import TablePageBanner from "@/components/manager/TablePageBanner";
import { useRouter } from "next/navigation";
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Dữ liệu mẫu cho bàn
const tablesData = [
  { id: '1', name: '01', type: 'pool', status: 'using' as const },
  { id: '2', name: '02', type: 'carom', status: 'available' as const },
];

export default function TablesPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  const router = useRouter();
  const filteredTables = tablesData.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddTable = () => {
    router.push('/manager/tables/add');
  };

  const handleTableClick = (tableId: string) => {
    // Logic xử lý khi click vào bàn
    router.push(`/manager/tables/${tableId}`);
  };

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
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
          {loading ? (
            <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
          ) : filteredTables.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <LoadingSkeleton type="text" lines={2} />
              <div>Không có dữ liệu</div>
            </div>
          ) : (
            <TableGrid
              tables={filteredTables}
              onTableClick={handleTableClick}
            />
          )}
        </main>
      </div>
    </>
  );
} 