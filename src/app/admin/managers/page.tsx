"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import ManagerTable from "@/components/admin/ManagerTable";
import { useRouter } from "next/navigation";
import ManagerSearchBar from "@/components/admin/ManagerSearchBar";
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import managerService from '@/lib/managerService';
import adminService from '@/lib/adminService';
import toast from 'react-hot-toast';
import { useAdminAuthGuard } from '@/lib/hooks/useAdminAuthGuard';
import { Users2, Plus, Menu } from 'lucide-react';

interface Manager {
  name: string;
  phone: string;
  email: string;
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
        const mapped: Manager[] = data.map((m) => {
          const obj = m as Record<string, unknown>;
          return {
            name: typeof obj.fullName === 'string' ? obj.fullName : '',
            phone: typeof obj.phoneNumber === 'string' ? obj.phoneNumber : '',
            email: typeof obj.email === 'string' ? obj.email : '',
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
    m.name?.toLowerCase().includes(search.toLowerCase())
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
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderAdminPage />
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              QUẢN LÝ
            </span>
          </div>
          {managers.length > 0 && (
            <ManagerSearchBar
              search={search}
              setSearch={handleSearch}
              onAddManager={isAdding ? () => {} : handleAddManager}
            />
          )}
          {loading ? (
            <div className="py-8">
              <TableSkeleton rows={5} />
            </div>
          ) : tableLoading ? (
            <div className="py-8">
              <TableSkeleton rows={5} />
            </div>
                    ) : managers.length === 0 ? (
            <EmptyState
              icon={
                <Users2 className="w-14 h-14 text-white" strokeWidth={1.5} />
              }
              title={search ? 'Không tìm thấy quản lý phù hợp' : 'Chưa có quản lý nào'}
              description={
                search 
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc thêm quản lý mới để mở rộng đội ngũ của bạn'
                  : 'Bắt đầu xây dựng đội ngũ quản lý chuyên nghiệp cho thương hiệu của bạn'
              }
              primaryAction={{
                label: 'Thêm quản lý mới',
                onClick: handleAddManager,
                loading: isAdding,
                icon: (
                  <Plus className="w-5 h-5" />
                )
              }}
              secondaryAction={search ? {
                label: 'Xem tất cả',
                onClick: () => setSearch(''),
                icon: (
                  <Menu className="w-5 h-5" />
                )
              } : undefined}
              additionalInfo="Quản lý sẽ giúp bạn vận hành và phát triển thương hiệu hiệu quả"
              showAdditionalInfo={!search}
            />
          ) : (
            <ManagerTable managers={filteredManagers} />
          )}
        </main>
      </div>
    </>
  );
} 