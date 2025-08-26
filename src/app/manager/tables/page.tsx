"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import TableSearchBar from "@/components/manager/TableSearchBar";
import TableGrid from "@/components/manager/TableGrid";
import TablePageBanner from "@/components/manager/TablePageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import EmptyState from '@/components/ui/EmptyState';
import { managerTableService } from '@/lib/managerTableService';
import toast from 'react-hot-toast';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';
import { useI18n } from '@/lib/i18n/provider';

export interface Table {
  tableId: string;
  clubId: string;
  name: string;
  category: 'pool-8' | 'carom';
  status: 'empty' | 'inuse' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}

export default function TablesPage() {
  const { t } = useI18n();
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

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
            name: obj.name || '',
            category: obj.category ?? 'pool-8',
            status: obj.status ?? 'empty',
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
          };
        });
        setTables(mappedTables);
      })
      .catch(() => {
        setError(t('managerTable.cannotLoadTables'));
        toast.error(t('managerTable.cannotLoadTables'));
      })
      .finally(() => setLoading(false));
  }, [t]);

  if (isChecking) return null;

  const filteredTables = tables.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddTable = async () => {
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/manager/tables/add');
    } catch (error) {
      console.error('Error navigating to add page:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleTableClick = (tableId: string) => {
    router.push(`/manager/tables/${tableId}`);
  };

  return (
    <>
      {loading && <ScoreLensLoading text={t('managerTable.loading')} />}
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen lg:ml-0">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
            <HeaderManager />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
            <TablePageBanner />
            <TableSearchBar
              search={search}
              setSearch={setSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              onAddTable={isAdding ? () => { } : handleAddTable}
            />
            {loading ? (
              <div className="py-8">
                <LoadingSkeleton type="card" lines={3} className="w-full max-w-2xl mx-auto" />
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : filteredTables.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5v4m8-4v4M8 11h8M8 15h8" />
                  </svg>
                }
                title={t('managerTable.noTablesFound')}
                description={t('managerTable.tryDifferentSearch')}
                secondaryAction={search || categoryFilter ? {
                  label: t('managerTable.viewAll'),
                  onClick: () => {
                    setSearch('');
                    setCategoryFilter('');
                  },
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 12h16M4 20h16" />
                    </svg>
                  )
                } : undefined}
                showAdditionalInfo={false}
              />
            ) : (
              <TableGrid
                tables={filteredTables.map(t => ({
                  id: t.tableId,
                  name: t.name,
                  type: t.category,
                  status: t.status,
                }))}
                onTableClick={handleTableClick}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
} 