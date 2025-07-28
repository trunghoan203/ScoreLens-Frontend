"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import MemberSearchBar from "@/components/manager/MemberSearchBar";
import MemberGrid from "@/components/manager/MemberGrid";
import MemberPageBanner from "@/components/manager/MemberPageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { managerMemberService } from '@/lib/managerMemberService';
import toast from 'react-hot-toast';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';

export interface Member {
  membershipId: string;
  fullName: string;
  phoneNumber: string;
  totalPlayTime?: number;
  _id?: string;
}

export default function MembersPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    managerMemberService.getAllMembers()
      .then((data: unknown) => {
        let membersArr: unknown[] = [];
        if (Array.isArray(data)) membersArr = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { memberships?: unknown[] }).memberships)) membersArr = (data as { memberships: unknown[] }).memberships;
        else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) membersArr = (data as { data: unknown[] }).data;
        const mappedMembers: Member[] = membersArr.map(m => {
          const obj = m as Partial<Member>;
          return {
            membershipId: obj.membershipId || obj._id || '',
            fullName: obj.fullName || '',
            phoneNumber: obj.phoneNumber || '',
            totalPlayTime: obj.totalPlayTime ?? 0,
          };
        });
        setMembers(mappedMembers);
      })
      .catch(() => {
        setError('Không thể tải danh sách hội viên');
        toast.error('Không thể tải danh sách hội viên');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMembers = members.filter(m => m.fullName.toLowerCase().includes(search.toLowerCase()));

  const handleAddMember = () => {
    router.push('/manager/members/add');
  };

  const handleMemberClick = (membershipId: string) => {
    router.push(`/manager/members/${membershipId}`);
  };

  if (isChecking) return null;

  return (
    <>
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
          {loading ? (
            <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <LoadingSkeleton type="text" lines={2} />
              <div>Không có dữ liệu</div>
            </div>
          ) : (
            <MemberGrid
              members={filteredMembers.map(m => ({
                id: m.membershipId,
                name: m.fullName,
                phone: m.phoneNumber,
                playTime: m.totalPlayTime !== undefined ? `${m.totalPlayTime} phút` : '',
              }))}
              onMemberClick={handleMemberClick}
            />
          )}
        </main>
      </div>
    </>
  );
} 