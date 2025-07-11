"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import BranchSearchBar from '@/components/admin/BranchSearchBar';
import BranchTable from '@/components/admin/BranchTable';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LoadingSkeleton, TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { useRouter } from 'next/navigation';

const branchesData = [
  { name: "WOW Billiard", address: "80 Lê Hồng Phong, phường Lý Thường Kiệt, thành phố Quy Nhơn", status: "open" },
  { name: "WOW Billiard", address: "80 Lê Hồng Phong, phường Lý Thường Kiệt, thành phố Quy Nhơn", status: "closed" },
  { name: "WOW Billiard", address: "80 Lê Hồng Phong, phường Lý Thường Kiệt, thành phố Quy Nhơn", status: "open" },
  { name: "WOW Billiard", address: "80 Lê Hồng Phong, phường Lý Thường Kiệt, thành phố Quy Nhơn", status: "closed" },
  { name: "WOW Billiard", address: "80 Lê Hồng Phong, phường Lý Thường Kiệt, thành phố Quy Nhơn", status: "open" },
  { name: "WOW Billiard", address: "80 Lê Hồng Phong, phường Lý Thường Kiệt, thành phố Quy Nhơn", status: "closed" },
  { name: "WOW Billiard", address: "80 Lê Hồng Phong, phường Lý Thường Kiệt, thành phố Quy Nhơn", status: "open" },
];

export default function BranchesPage() {
  const [search, setSearch] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [branches, setBranches] = useState(branchesData);
  const [isAdding, setIsAdding] = useState(false); // demo spinner nhỏ
  const router = useRouter();

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000); // 2 seconds loading
    return () => clearTimeout(timer);
  }, []);

  // Simulate search with loading
  const handleSearch = async (searchTerm: string) => {
    setSearch(searchTerm);
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const filtered = branchesData.filter(b =>
      b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setBranches(filtered);
    setIsSearching(false);
  };

  // Demo: Spinner nhỏ khi thêm chi nhánh
  const handleAddBranch = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsAdding(false);
    router.push('/admin/branches/add');
  };

  return (
    <>
  {isPageLoading && <ScoreLensLoading text="Đang tải..." />}
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
          onAddBranch={handleAddBranch}
          isSearching={isSearching}
        />
        {/* 4. LoadingSpinner nhỏ khi thêm chi nhánh (demo) */}
        {/* {isAdding && (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="md" text="Đang thêm chi nhánh..." color="lime" />
          </div>
        )} */}
        {/* 2. TableSkeleton khi search */}
        {isSearching && (
          <div className="py-8">
            <TableSkeleton rows={5} />
          </div>
        )}
        {/* 3. LoadingSkeleton cho từng dòng nếu không có dữ liệu */}
        {!isSearching && branches.length === 0 && (
          <div className="py-8">
            <LoadingSkeleton type="text" lines={2} />
            <div className="text-center text-gray-500 mt-4">Không tìm thấy chi nhánh nào</div>
          </div>
        )}
        {/* Hiển thị bảng khi có dữ liệu */}
        {!isSearching && branches.length > 0 && (
          <BranchTable branches={branches.map(b => ({ ...b, status: b.status as 'open' | 'closed' }))} />
        )}
      </main>
    </div>
    </>
  );
} 