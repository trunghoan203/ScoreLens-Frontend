"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import MemberSearchBar from "@/components/manager/MemberSearchBar";
import MemberGrid from "@/components/manager/MemberGrid";
import MemberPageBanner from "@/components/manager/MemberPageBanner";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import EmptyState from '@/components/ui/EmptyState';
import { managerMemberService } from '@/lib/managerMemberService';
import toast from 'react-hot-toast';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';
import Image from 'next/image';

export interface Member {
  membershipId: string;
  fullName: string;
  phoneNumber: string;
  status: 'active' | 'inactive';
  _id?: string;
}

export default function MembersPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPage = 10;
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
            status: obj.status || 'active',
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

  const totalPages = Math.ceil(filteredMembers.length / itemPage);
  const startIndex = (currentPage - 1) * itemPage;
  const endIndex = startIndex + itemPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderManager />
          </div>
          <div className="px-10 pb-10">
            <MemberPageBanner />
            <MemberSearchBar
              search={search}
              setSearch={setSearch}
              onAddMember={isAdding ? () => { } : handleAddMember}
            />
            {loading ? (
              <div className="py-8">
                <LoadingSkeleton type="card" lines={3} className="w-full max-w-2xl mx-auto" />
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : filteredMembers.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                }
                title={search ? 'Không tìm thấy hội viên phù hợp' : 'Chưa có hội viên nào'}
                description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy hội viên phù hợp"
                secondaryAction={search ? {
                  label: 'Xem tất cả',
                  onClick: () => setSearch(''),
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 12h16M4 20h16" />
                    </svg>
                  )
                } : undefined}
                showAdditionalInfo={!search}
              />
            ) : (
              <>
                <MemberGrid
                  members={currentMembers.map(m => ({
                    id: m.membershipId,
                    name: m.fullName,
                    phone: m.phoneNumber,
                    status: m.status,
                  }))}
                  onMemberClick={handleMemberClick}
                />

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-3 w-16 rounded-lg font-medium transition flex items-center justify-center ${currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-lime-400 hover:bg-lime-500 text-white'
                        }`}
                    >
                      <Image
                        src="/icon/chevron-left.svg"
                        alt="Previous"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 w-10 rounded-lg font-medium transition flex items-center justify-center ${currentPage === page
                          ? 'bg-lime-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-3 w-16 rounded-lg font-medium transition flex items-center justify-center ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-lime-400 hover:bg-lime-500 text-white'
                        }`}
                    >
                      <Image
                        src="/icon/chevron-right.svg"
                        alt="Next"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center text-gray-400 italic text-xs">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)} trong tổng số {filteredMembers.length} hội viên
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 