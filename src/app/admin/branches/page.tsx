"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import BranchSearchBar from '@/components/admin/BranchSearchBar';
import BranchTable from '@/components/admin/BranchTable';
import { LoadingSkeleton, TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { useRouter } from 'next/navigation';
import clubsService, { ClubResponse } from '@/lib/clubsService';
import adminService from '@/lib/adminService';
import toast from 'react-hot-toast';
import { useAdminAuthGuard } from '@/lib/hooks/useAdminAuthGuard';

export default function BranchesPage() {
  const { isChecking } = useAdminAuthGuard();
  const [search, setSearch] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [branches, setBranches] = useState(branchesData);
  const [isAdding, setIsAdding] = useState(false); // demo spinner nhỏ
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
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsAdding(false);
    router.push('/admin/branches/add');
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
              CHI NHÁNH
            </span>
          </div>
          <BranchSearchBar
            search={search}
            setSearch={handleSearch}
            onAddBranch={isAdding ? () => {} : handleAddBranch}
          />
          {isPageLoading ? (
            <div className="py-8">
              <TableSkeleton rows={5} />
            </div>
          ) : isSearching ? (
            <div className="py-8">
              <TableSkeleton rows={5} />
            </div>
          ) : branches.length === 0 ? (
            <div className="py-8">
              <LoadingSkeleton type="text" lines={2} />
              <div className="text-center text-gray-500 mt-4">Không tìm thấy chi nhánh nào</div>
            </div>
          ) : (
            <BranchTable 
              branches={branches.map(b => ({ 
                _id: b._id,
                clubId: b.clubId,
                name: b.clubName, 
                address: b.address, 
                tableNumber: b.tableNumber,
                status: b.status as 'open' | 'closed' 
              }))} 
            />
          )}
        </main>
      </div>
    </>
  );
} 