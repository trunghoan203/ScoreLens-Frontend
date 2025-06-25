"use client";
import React, { useState } from "react";
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import BranchSearchBar from '@/components/admin/BranchSearchBar';
import BranchTable from '@/components/admin/BranchTable';
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
  const router = useRouter();
  const filtered = branchesData.filter(b => b.address.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderAdminPage />
        <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
            CHI NHÁNH
          </span>
        </div>
        <BranchSearchBar search={search} setSearch={setSearch} onAddBranch={() => router.push('/admin/branches/add')} />
        <BranchTable branches={filtered.map(b => ({ ...b, status: b.status as 'open' | 'closed' }))} />
      </main>
    </div>
  );
} 