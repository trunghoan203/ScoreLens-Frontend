"use client";
import React, { useState } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import MemberSearchBar from "@/components/manager/MemberSearchBar";
import MemberGrid from "@/components/manager/MemberGrid";
import MemberPageBanner from "@/components/manager/MemberPageBanner";
import { useRouter } from "next/navigation";

// Dữ liệu mẫu cho hội viên
const membersData = [
  { id: '1', name: 'Nguyễn Văn A', phone: '0123456789', playTime: '2 giờ 30 phút' },
  { id: '2', name: 'Trần Thị B', phone: '0987654321', playTime: '1 giờ 45 phút' },
  { id: '3', name: 'Lê Văn C', phone: '0369852147', playTime: '3 giờ 15 phút' },
  { id: '4', name: 'Phạm Thị D', phone: '0521478963', playTime: '45 phút' },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const filteredMembers = membersData.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddMember = () => {
    // Logic thêm hội viên mới
    router.push('/manager/members/add');
  };

  const handleMemberClick = (memberId: string) => {
    // Logic xử lý khi click vào hội viên
    router.push(`/manager/members/${memberId}`);
  };

  return (
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
        <MemberGrid
          members={filteredMembers}
          onMemberClick={handleMemberClick}
        />
      </main>
    </div>
  );
} 