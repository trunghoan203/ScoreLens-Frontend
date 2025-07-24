"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import CameraSearchBar from "@/components/manager/CameraSearchBar";
import CameraGrid from "@/components/manager/CameraGrid";
import CameraPageBanner from "@/components/manager/CameraPageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
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
  number: number;
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
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      managerCameraService.getAllCameras(),
      managerTableService.getAllTables()
    ])
      .then(([cameraData, tableData]) => {
        // Parse cameras
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
        // Parse tables
        let tablesArr: unknown[] = [];
        if (Array.isArray(tableData)) tablesArr = tableData;
        else if (tableData && typeof tableData === 'object' && Array.isArray((tableData as { tables?: unknown[] }).tables)) tablesArr = (tableData as { tables: unknown[] }).tables;
        else if (tableData && typeof tableData === 'object' && Array.isArray((tableData as { data?: unknown[] }).data)) tablesArr = (tableData as { data: unknown[] }).data;
        const mappedTables: Table[] = tablesArr.map(t => {
          const obj = t as Partial<Table>;
          return {
            tableId: obj.tableId || '',
            number: obj.number ?? 0,
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

  if (isChecking) return null;

  // Tìm tên bàn theo tableId
  const getTableDisplay = (tableId: string) => {
    const table = tables.find(t => t.tableId === tableId);
    if (!table) return tableId;
    return `Bàn ${table.number} - ${table.category}`;
  };

  const filteredCameras = cameras.filter(
    c => getTableDisplay(c.tableId).toLowerCase().includes(search.toLowerCase()) || 
         c.IPAddress.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCamera = () => {
    router.push('/manager/camera/add');
  };

  const handleCameraClick = (cameraId: string) => {
    router.push(`/manager/camera/${cameraId}`);
  };

  return (
    <>
      {/* Đã loại bỏ ScoreLensLoading toàn trang để tránh loading dư thừa */}
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderManager />
          <CameraPageBanner />
          <CameraSearchBar
            search={search}
            setSearch={setSearch}
            onAddCamera={handleAddCamera}
          />
          {loading ? (
            <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : filteredCameras.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <LoadingSkeleton type="text" lines={2} />
              <div>Không có dữ liệu</div>
            </div>
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
        </main>
      </div>
    </>
  );
} 