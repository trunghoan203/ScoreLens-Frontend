"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import ManagerTable from "@/components/admin/ManagerTable";
import { useRouter } from "next/navigation";
import ManagerSearchBar from "@/components/admin/ManagerSearchBar";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import managerService from '@/lib/managerService';
import adminService from '@/lib/adminService';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import toast from 'react-hot-toast';
import { useAdminAuthGuard } from '@/lib/hooks/useAdminAuthGuard';
import { Users2, Menu } from 'lucide-react';
import { ScoreLensLoading } from "@/components/ui/ScoreLensLoading";

interface Manager {
  name: string;
  phone: string;
  email: string;
  clubName?: string;
  status: 'active' | 'inactive';
  managerId?: string;
  _id?: string;
}

export default function ManagersPage() {
  const { isChecking } = useAdminAuthGuard();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  React.useEffect(() => {
    if (isChecking) return;
    const fetchManagers = async () => {
      setLoading(true);
      try {
        const profile = await adminService.getProfile();
        let apiRes: unknown = null;
        if (profile.brandId) {
          apiRes = await managerService.getManagers(profile.brandId);
        } else {
          toast.error('Tài khoản admin của bạn không được liên kết với thương hiệu nào.');
        }
        const data = apiRes && typeof apiRes === 'object' && apiRes !== null && Array.isArray((apiRes as Record<string, unknown>).data)
          ? (apiRes as Record<string, unknown>).data as unknown[]
          : [];

        let clubsData: ClubResponse[] = [];
        try {
          if (profile.brandId) {
            clubsData = await clubsService.getClubsByBrandId(profile.brandId);
          }
        } catch (error) {
          console.error('Error fetching clubs:', error);
        }

        const mapped: Manager[] = data.map((m) => {
          const obj = m as Record<string, unknown>;
          const clubId = typeof obj.clubId === 'string' ? obj.clubId : '';
          const club = clubsData.find(c => c.clubId === clubId);

          return {
            name: typeof obj.fullName === 'string' ? obj.fullName : '',
            phone: typeof obj.phoneNumber === 'string' ? obj.phoneNumber : '',
            email: typeof obj.email === 'string' ? obj.email : '',
            clubName: club ? club.clubName : (clubId ? `Club ID: ${clubId}` : 'N/A'),
            status: obj.isActive ? 'active' : 'inactive',
            managerId: typeof obj.managerId === 'string' ? obj.managerId : undefined,
            _id: typeof obj._id === 'string' ? obj._id : undefined,
          };
        });
        setManagers(mapped);
      } catch (error: unknown) {
        const errMsg = (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : undefined;
        toast.error(errMsg || 'Không thể tải danh sách quản lý');
        setManagers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
  }, [isChecking]);

  const filteredManagers = managers.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 900);
  };

  const handleAddManager = async () => {
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/admin/managers/add');
    } catch (error) {
      console.error('Error navigating to add page:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (isChecking) return null;

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderAdminPage />
          </div>
          <div className="px-10 pb-10">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
              <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
                QUẢN LÝ
              </span>
            </div>
            <ManagerSearchBar
              search={search}
              setSearch={handleSearch}
              onAddManager={isAdding ? () => { } : handleAddManager}
            />
            {loading ? (
              <div className="py-8">
                <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
              </div>
            ) : tableLoading ? (
              <div className="py-8">
                <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
              </div>
            ) : (search && filteredManagers.length === 0) || managers.length === 0 ? (
              <EmptyState
                icon={
                  <Users2 className="w-14 h-14 text-white" strokeWidth={1.5} />
                }
                title={search ? 'Không tìm thấy quản lý phù hợp' : 'Chưa có quản lý nào'}
                description={
                  search
                    ? 'Thử thay đổi từ khóa tìm kiếm để tìm thấy quản lý phù hợp'
                    : 'Sử dụng nút "Thêm quản lý" ở trên để tạo quản lý đầu tiên'
                }
                secondaryAction={search ? {
                  label: 'Xem tất cả',
                  onClick: () => setSearch(''),
                  icon: (
                    <Menu className="w-5 h-5" />
                  )
                } : undefined}
              />
            ) : (
              <ManagerTable managers={filteredManagers} />
            )}
          </div>
        </main>
      </div>
    </>
  );
} 