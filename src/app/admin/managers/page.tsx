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
import { useI18n } from '@/lib/i18n/provider';

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
  const { t } = useI18n();
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
          toast.error(t('managers.noBrandLinked'));
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
            clubName: club ? club.clubName : (clubId ? t('managers.noBranch') : t('common.notAvailable')),
            status: obj.isActive ? 'active' : 'inactive',
            managerId: typeof obj.managerId === 'string' ? obj.managerId : undefined,
            _id: typeof obj._id === 'string' ? obj._id : undefined,
          };
        });
        setManagers(mapped);
      } catch (error: unknown) {
        const errMsg = (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : undefined;
        toast.error(errMsg || t('managers.cannotLoadList'));
        setManagers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
  }, [isChecking]);

  const filteredManagers = managers.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.phone?.toLowerCase().includes(search.toLowerCase())
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
      {loading && <ScoreLensLoading text={t('common.loading')} />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen lg:ml-0">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
            <HeaderAdminPage />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6 sm:mb-8">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-widest flex items-center gap-2 sm:gap-3">
                {t('managers.title')}
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
                title={search ? t('managers.noSearchResults') : t('managers.noManagers')}
                description={
                  search
                    ? t('managers.tryDifferentKeywords')
                    : t('managers.useAddButton')
                }
                secondaryAction={search ? {
                  label: t('common.viewAll'),
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