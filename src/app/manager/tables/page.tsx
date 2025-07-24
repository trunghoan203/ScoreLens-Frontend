"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import TableSearchBar from "@/components/manager/TableSearchBar";
import TableGrid from "@/components/manager/TableGrid";
import TablePageBanner from "@/components/manager/TablePageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { managerTableService } from '@/lib/managerTableService';
import toast from 'react-hot-toast';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';

export interface Table {
  tableId: string;
  clubId: string;
  number: number;
  category: 'pool-8' | 'carom';
  status: 'empty' | 'inuse' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}

export default function TablesPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    managerTableService.getAllTables()
      .then((data: unknown) => {
        let tablesArr: unknown[] = [];
        if (Array.isArray(data)) tablesArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { tables?: unknown[] }).tables)) tablesArr = (data as { tables: unknown[] }).tables;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) tablesArr = (data as { data: unknown[] }).data;
        const mappedTables: Table[] = tablesArr.map(t => {
          const obj = t as Partial<Table>;
          return {
            tableId: obj.tableId || '',
            clubId: obj.clubId || '',
            number: obj.number ?? 0,
            category: obj.category ?? 'pool-8',
            status: obj.status ?? 'empty',
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
          };
        });
        setTables(mappedTables);
      })
      .catch(() => {
        setError('Không thể tải danh sách bàn');
        toast.error('Không thể tải danh sách bàn');
      })
      .finally(() => setLoading(false));
  }, []);
  const router = useRouter();
  if (isChecking) return null;
  const filteredTables = tables.filter(
    t => typeof t.number === 'number' && t.number.toString().includes(search)
  );

  const handleAddTable = () => {
    router.push('/manager/tables/add');
  };

  const handleTableClick = (tableId: string) => {
    router.push(`/manager/tables/${tableId}`);
  };

  return (
    <>
      {/* Đã loại bỏ ScoreLensLoading toàn trang để tránh loading dư thừa */}
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
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : filteredTables.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <LoadingSkeleton type="text" lines={2} />
              <div>Không có dữ liệu</div>
            </div>
          ) : (
            <TableGrid
              tables={filteredTables.map(t => ({
                id: t.tableId,
                name: t.number.toString(),
                type: t.category,
                status: t.status,
              }))}
              onTableClick={handleTableClick}
            />
          )}
        </main>
      </div>
    </>
  );
} 