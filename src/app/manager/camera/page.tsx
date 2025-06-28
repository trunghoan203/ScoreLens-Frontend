"use client";
import React, { useState } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import CameraSearchBar from "@/components/manager/CameraSearchBar";
import CameraGrid from "@/components/manager/CameraGrid";
import CameraPageBanner from "@/components/manager/CameraPageBanner";
import { useRouter } from "next/navigation";

// Dữ liệu mẫu cho camera
const camerasData = [
  { id: '1', table: '01', ip: '192.168.1.100', username: 'admin', password: 'password123', status: 'active' as const },
  { id: '2', table: '02', ip: '192.168.1.101', username: 'admin', password: 'password123', status: 'inactive' as const },
  { id: '3', table: '03', ip: '192.168.1.102', username: 'admin', password: 'password123', status: 'active' as const },
  { id: '4', table: '04', ip: '192.168.1.103', username: 'admin', password: 'password123', status: 'active' as const },
];

export default function CameraPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const filteredCameras = camerasData.filter(c => c.table.toLowerCase().includes(search.toLowerCase()));

  const handleAddCamera = () => {
    // Logic thêm camera mới
    router.push('/manager/camera/add');
  };

  const handleCameraClick = (cameraId: string) => {
    // Logic xử lý khi click vào camera
    router.push(`/manager/camera/${cameraId}`);
  };

  return (
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
        <CameraGrid
          cameras={filteredCameras}
          onCameraClick={handleCameraClick}
        />
      </main>
    </div>
  );
} 