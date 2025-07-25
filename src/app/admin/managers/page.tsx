"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import ManagerTable from "@/components/admin/ManagerTable";
import { useRouter } from "next/navigation";
import ManagerSearchBar from "@/components/admin/ManagerSearchBar";
import { TableSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import managerService from '@/lib/managerService';
import adminService from '@/lib/adminService';
import toast from 'react-hot-toast';
import { useAdminAuthGuard } from '@/lib/hooks/useAdminAuthGuard';

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
          <ManagerSearchBar
            search={search}
            setSearch={handleSearch}
            onAddManager={() => router.push('/admin/managers/add')}
          />
          {loading ? (
            <div className="mt-6"><TableSkeleton rows={5} /></div>
          ) : tableLoading ? (
            <div className="mt-6"><TableSkeleton rows={5} /></div>
          ) : filteredManagers.length === 0 ? (
            <div className="mt-6"><LoadingSkeleton type="card" lines={1} className="w-full max-w-md mx-auto" />
              <div className="text-center text-gray-500 mt-4">Không tìm thấy quản lý nào</div>
            </div>
          ) : (
            <ManagerTable managers={filteredManagers} />
          )}
        </main>
      </div>
    </>
  );
} 