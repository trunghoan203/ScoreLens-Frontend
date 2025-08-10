"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import CameraSearchBar from "@/components/manager/CameraSearchBar";
import CameraGrid from "@/components/manager/CameraGrid";
import CameraPageBanner from "@/components/manager/CameraPageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { managerCameraService } from '@/lib/managerCameraService';
import { managerTableService } from '@/lib/managerTableService';
import toast from 'react-hot-toast';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';

export interface Camera {
  cameraId: string;
  tableId: string;
  IPAddress: string;
  username: string;
  password: string;
  isConnect: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Table {
  tableId: string;
  name: string;
  category: string;
  status: string;
}

export default function CameraPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      managerCameraService.getAllCameras(),
      managerTableService.getAllTables()
    ])
      .then(([cameraData, tableData]) => {
        let camerasArr: unknown[] = [];
        if (Array.isArray(cameraData)) camerasArr = cameraData;
        else if (cameraData && typeof cameraData === 'object' && Array.isArray((cameraData as { cameras?: unknown[] }).cameras)) camerasArr = (cameraData as { cameras: unknown[] }).cameras;
        else if (cameraData && typeof cameraData === 'object' && Array.isArray((cameraData as { data?: unknown[] }).data)) camerasArr = (cameraData as { data: unknown[] }).data;
        const mappedCameras: Camera[] = camerasArr.map(c => {
          const obj = c as Partial<Camera>;
          return {
            cameraId: obj.cameraId || '',
            tableId: obj.tableId || '',
            IPAddress: obj.IPAddress || '',
            username: obj.username || '',
            password: obj.password || '',
            isConnect: obj.isConnect ?? false,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
          };
        });
        setCameras(mappedCameras);
        let tablesArr: unknown[] = [];
        if (Array.isArray(tableData)) tablesArr = tableData;
        else if (tableData && typeof tableData === 'object' && Array.isArray((tableData as { tables?: unknown[] }).tables)) tablesArr = (tableData as { tables: unknown[] }).tables;
        else if (tableData && typeof tableData === 'object' && Array.isArray((tableData as { data?: unknown[] }).data)) tablesArr = (tableData as { data: unknown[] }).data;
        const mappedTables: Table[] = tablesArr.map(t => {
          const obj = t as Partial<Table>;
          return {
            tableId: obj.tableId || '',
            name: obj.name || '',
            category: obj.category ?? 'pool-8',
            status: obj.status ?? 'empty',
          };
        });
        setTables(mappedTables);
      })
      .catch(() => {
        setError('Không thể tải danh sách camera hoặc bàn');
        toast.error('Không thể tải danh sách camera hoặc bàn');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isChecking) return null;

  const formatCategory = (category: string) => {
    switch (category) {
      case 'pool-8':
        return 'Pool-8';
      case 'carom':
        return 'Carom';
      default:
        return category;
    }
  };

  const getTableDisplay = (tableId: string) => {
    const table = tables.find(t => t.tableId === tableId);
    if (!table) return tableId;
    return `${table.name} - ${formatCategory(table.category)}`;
  };

  const filteredCameras = cameras.filter(
    c => getTableDisplay(c.tableId).toLowerCase().includes(search.toLowerCase()) ||
      c.IPAddress.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCamera = async () => {
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/manager/camera/add');
    } catch (error) {
      console.error('Error navigating to add page:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCameraClick = (cameraId: string) => {
    router.push(`/manager/camera/${cameraId}`);
  };

  return (
    <>
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen">
          <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
            }`}>
            <HeaderManager />
          </div>
          <div className="p-10">
            <CameraPageBanner />
            {cameras.length > 0 && (
              <CameraSearchBar
                search={search}
                setSearch={setSearch}
                onAddCamera={isAdding ? () => { } : handleAddCamera}
              />
            )}
            {loading ? (
              <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : filteredCameras.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
                title="Không tìm thấy camera phù hợp"
                description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy camera phù hợp"
                secondaryAction={{
                  label: 'Xem tất cả',
                  onClick: () => setSearch(''),
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 12h16M4 20h16" />
                    </svg>
                  )
                }}
                showAdditionalInfo={false}
              />
            ) : (
              <CameraGrid
                cameras={filteredCameras.map(c => ({
                  id: c.cameraId,
                  table: getTableDisplay(c.tableId),
                  ip: c.IPAddress,
                  username: c.username,
                  password: c.password,
                  status: c.isConnect ? 'active' : 'inactive',
                }))}
                onCameraClick={handleCameraClick}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
} 