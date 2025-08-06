"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import MemberSearchBar from "@/components/manager/MemberSearchBar";
import MemberGrid from "@/components/manager/MemberGrid";
import MemberPageBanner from "@/components/manager/MemberPageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
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
  const [isAdding, setIsAdding] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Theo dõi scroll để thay đổi viền header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredMembers = members.filter(m => m.fullName.toLowerCase().includes(search.toLowerCase()));

  const handleAddMember = async () => {
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/manager/members/add');
    } catch (error) {
      console.error('Error navigating to add page:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleMemberClick = (membershipId: string) => {
    router.push(`/manager/members/${membershipId}`);
  };

  if (isChecking) return null;

  return (
    <>
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen">
          <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${
            isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
          }`}>
            <HeaderManager />
          </div>
          <div className="p-10">
          <MemberPageBanner />
          {members.length > 0 && (
            <MemberSearchBar
              search={search}
              setSearch={setSearch}
              onAddMember={isAdding ? () => {} : handleAddMember}
            />
          )}
          {loading ? (
            <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : members.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              title={search ? 'Không tìm thấy hội viên phù hợp' : 'Chưa có hội viên nào'}
              description={
                search 
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc thêm hội viên mới để mở rộng cộng đồng'
                  : 'Bắt đầu xây dựng cộng đồng hội viên chuyên nghiệp cho câu lạc bộ của bạn'
              }
              primaryAction={{
                label: 'Thêm hội viên mới',
                onClick: handleAddMember,
                loading: isAdding,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )
              }}
              secondaryAction={search ? {
                label: 'Xem tất cả',
                onClick: () => setSearch(''),
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 12h16M4 20h16" />
                  </svg>
                )
              } : undefined}
              additionalInfo="Hội viên sẽ giúp bạn xây dựng và phát triển cộng đồng câu lạc bộ hiệu quả"
              showAdditionalInfo={!search}
            />
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
          </div>
        </main>
      </div>
    </>
  );
} 