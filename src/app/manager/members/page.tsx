"use client";
import React, { useState } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import MemberSearchBar from "@/components/manager/MemberSearchBar";
import MemberGrid from "@/components/manager/MemberGrid";
import MemberPageBanner from "@/components/manager/MemberPageBanner";
import { useRouter } from "next/navigation";
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Dữ liệu mẫu cho hội viên
const membersData = [
  { id: '1', name: 'Nguyễn Văn A', phone: '0123456789', playTime: '2 giờ 30 phút' },
  { id: '2', name: 'Trần Thị B', phone: '0987654321', playTime: '1 giờ 45 phút' },
  { id: '3', name: 'Lê Văn C', phone: '0369852147', playTime: '3 giờ 15 phút' },
  { id: '4', name: 'Phạm Thị D', phone: '0521478963', playTime: '45 phút' },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  const router = useRouter();
  const filteredMembers = membersData.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddMember = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      router.push('/manager/members/add');
    }, 1000);
  };

  const handleMemberClick = (memberId: string) => {
    // Logic xử lý khi click vào hội viên
    router.push(`/manager/members/${memberId}`);
  };

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderManager />
          <MemberPageBanner />
          <MemberSearchBar
            search={search}
            setSearch={setSearch}
            onAddMember={handleAddMember}
          />
          {listLoading ? (
            <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <LoadingSkeleton type="text" lines={2} />
              <div>Không có dữ liệu</div>
            </div>
          ) : (
            <MemberGrid
              members={filteredMembers}
              onMemberClick={handleMemberClick}
            />
          )}
          <div className="flex justify-end mt-6">
            <button className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2" onClick={handleAddMember} disabled={actionLoading}>
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Thêm hội viên'}
            </button>
          </div>
        </main>
      </div>
    </>
  );
} 