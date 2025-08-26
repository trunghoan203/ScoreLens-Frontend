"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import BranchSearchBar from '@/components/admin/BranchSearchBar';
import BranchTable from '@/components/admin/BranchTable';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useRouter } from 'next/navigation';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import adminService from '@/lib/adminService';
import toast from 'react-hot-toast';
import { useAdminAuthGuard } from '@/lib/hooks/useAdminAuthGuard';
import { Building2, Menu } from 'lucide-react';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { useI18n } from '@/lib/i18n/provider';

export default function BranchesPage() {
  const { isChecking } = useAdminAuthGuard();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [branches, setBranches] = useState<ClubResponse[]>([]);
  const [allBranches, setAllBranches] = useState<ClubResponse[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isChecking) return;
    const loadClubs = async () => {
      try {
        setIsPageLoading(true);
        const brandId = await adminService.getBrandId();
        if (brandId) {
          const clubs = await clubsService.getClubsByBrandId(brandId);
          setAllBranches(clubs);
          setBranches(clubs);
        } else {
          const clubs = await clubsService.getAllClubs();
          setAllBranches(clubs);
          setBranches(clubs);
        }
      } catch (error) {
        console.error('Error loading clubs:', error);
        toast.error(t('branches.cannotLoadBranches'));
      } finally {
        setIsPageLoading(false);
      }
    };
    loadClubs();
  }, [isChecking]);

  const handleSearch = async (searchTerm: string) => {
    setSearch(searchTerm);
    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const filtered = allBranches.filter(b =>
        b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.clubName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setBranches(filtered);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error(t('branches.searchError'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddBranch = async () => {
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/admin/branches/add');
    } catch (error) {
      console.error('Error navigating to add page:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (isChecking) return null;

  return (
    <>
      {isPageLoading && <ScoreLensLoading text={t('common.loading')} />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen lg:ml-0">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
            <HeaderAdminPage />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6 sm:mb-8">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-widest flex items-center gap-2 sm:gap-3">
                {t('branches.title')}
              </span>
            </div>
            <BranchSearchBar
              search={search}
              setSearch={handleSearch}
              onAddBranch={isAdding ? () => { } : handleAddBranch}
            />
            {isPageLoading ? (
              <div className="py-8">
                <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
              </div>
            ) : isSearching ? (
              <div className="py-8">
                <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
              </div>
            ) : branches.length === 0 ? (
              <EmptyState
                icon={
                  <Building2 className="w-14 h-14 text-white" strokeWidth={1.5} />
                }
                title={search ? t('branches.noSearchResults') : t('branches.noBranches')}
                description={search ? t('branches.tryDifferentKeywords') : t('branches.useAddButton')}
                secondaryAction={search ? {
                  label: t('branches.viewAll'),
                  onClick: () => setSearch(''),
                  icon: (
                    <Menu className="w-5 h-5" />
                  )
                } : undefined}
              />
            ) : (
              <BranchTable
                branches={branches.map(b => ({
                  _id: b._id,
                  clubId: b.clubId,
                  name: b.clubName,
                  address: b.address,
                  actualTableCount: (typeof b.actualTableCount === 'number' ? b.actualTableCount : b.tableNumber),
                  status: b.status as 'open' | 'closed'
                }))}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
} 