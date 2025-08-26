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
import { useI18n } from '@/lib/i18n/provider';
import Image from 'next/image';

export interface Member {
  membershipId: string;
  fullName: string;
  phoneNumber: string;
  status: 'active' | 'inactive';
  _id?: string;
}

export default function MembersPage() {
  const { t } = useI18n();
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
        setError(t('managerMembers.loadMembersError'));
        toast.error(t('managerMembers.loadMembersError'));
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMembers = members.filter(m =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.phoneNumber.toLowerCase().includes(search.toLowerCase())
  );

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
      {loading && <ScoreLensLoading text={t('managerMembers.loadingText')} />}
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen lg:ml-0">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
            <HeaderManager />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
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
                title={search ? t('managerMembers.noMembersFoundWithSearch') : t('managerMembers.noMembersFound')}
                description={t('managerMembers.noMembersDescription')}
                secondaryAction={search ? {
                  label: t('managerMembers.viewAll'),
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
                  <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-2 sm:px-3 py-2 sm:py-3 w-12 sm:w-16 rounded-lg font-medium transition flex items-center justify-center text-sm sm:text-base ${currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-lime-400 hover:bg-lime-500 text-white'
                        }`}
                    >
                      <Image
                        src="/icon/chevron-left.svg"
                        alt={t('managerMembers.previous')}
                        width={20}
                        height={20}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 sm:px-3 py-2 w-8 sm:w-10 rounded-lg font-medium transition flex items-center justify-center text-sm sm:text-base ${currentPage === page
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
                      className={`px-2 sm:px-3 py-2 sm:py-3 w-12 sm:w-16 rounded-lg font-medium transition flex items-center justify-center text-sm sm:text-base ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-lime-400 hover:bg-lime-500 text-white'
                        }`}
                    >
                      <Image
                        src="/icon/chevron-right.svg"
                        alt={t('managerMembers.next')}
                        width={20}
                        height={20}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center text-gray-400 italic text-xs sm:text-sm">
                  {t('managerMembers.showingMembers').replace('{start}', String(startIndex + 1)).replace('{end}', String(Math.min(endIndex, filteredMembers.length))).replace('{total}', String(filteredMembers.length))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 