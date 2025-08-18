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

export default function BranchesPage() {
  const { isChecking } = useAdminAuthGuard();
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
        toast.error('Không thể tải danh sách chi nhánh');
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
      toast.error('Lỗi tìm kiếm');
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
      {isPageLoading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderAdminPage />
          </div>
          <div className="px-10 pb-10">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
              <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
                CHI NHÁNH
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
                title={search ? 'Không tìm thấy chi nhánh phù hợp' : 'Chưa có chi nhánh nào'}
                description={search ? 'Thử thay đổi từ khóa tìm kiếm để tìm thấy chi nhánh phù hợp' : 'Sử dụng nút "Thêm chi nhánh" ở trên để tạo chi nhánh đầu tiên'}
                secondaryAction={search ? {
                  label: 'Xem tất cả',
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
                  actualTableCount: b.actualTableCount,
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