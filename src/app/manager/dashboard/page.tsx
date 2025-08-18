'use client';
import React, { useState, useEffect } from 'react';
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import DashboardSummary from '@/components/manager/DashboardSummary';
import TableFilterBar from '@/components/manager/TableFilterBar';
import TableCardList from '@/components/manager/TableCardList';
import ButtonViewMore from '@/components/manager/ButtonViewMore';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import EmptyState from '@/components/ui/EmptyState';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';
import { managerTableService } from '@/lib/managerTableService';
import { managerMemberService } from '@/lib/managerMemberService';
import { managerMatchService } from '@/lib/managerMatchService';

import toast from 'react-hot-toast';

interface TableData {
  id: string;
  tableId?: string;
  name: string;
  type: string;
  status: 'inuse' | 'empty' | 'maintenance' | 'using' | 'available';
  teamA?: string;
  teamB?: string;
  time?: string;
  matchId?: string;
  matchStatus?: 'pending' | 'ongoing' | 'completed';
  elapsedTime?: string;
  isAiAssisted?: boolean;
  scoreA?: number;
  scoreB?: number;
  creatorType?: 'manager' | 'member' | 'guest' | null;
}

interface RawTableData {
  tableId?: string;
  id?: string;
  _id?: string;
  name: string;
  category?: string;
  type?: string;
  status: string;
  teamA?: string;
  teamB?: string;
  time?: string;
}

interface MembersData {
  memberships?: unknown[];
}

export default function ManagerDashboardPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const router = useRouter();
  const [actionLoading, setActionLoading] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    totalTables: 0,
    inUse: 0,
    available: 0,
    members: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [tables, setTables] = useState<TableData[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [activeMatches, setActiveMatches] = useState<Map<string, {
    matchId: string;
    status: string;
    startTime: Date | null;
    isAiAssisted?: boolean;
    scoreA?: number;
    scoreB?: number;
    creatorType?: 'manager' | 'member' | 'guest' | null;
  }>>(new Map());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingStats(true);
        setLoadingTables(true);

        const tablesData = await managerTableService.getAllTables();
        const tablesArray = Array.isArray(tablesData) ? tablesData : (tablesData as { tables?: RawTableData[] })?.tables || [];

        const transformedTables: TableData[] = tablesArray.map((table: RawTableData) => ({
          id: table.tableId || table.id || table._id || '',
          tableId: table.tableId,
          name: table.name,
          type: table.category || table.type || '',
          status: table.status as TableData['status'],
          teamA: table.teamA,
          teamB: table.teamB,
          time: table.time
        }));

        setTables(transformedTables);

        const inUseTables = transformedTables.filter(table => table.status === 'inuse');
        const matchDataPromises = inUseTables.map(async (table) => {
          try {
            const ongoingResponse = await managerMatchService.getMatchesByTable(table.id, 'ongoing', 1, 1) as Record<string, unknown>;
            if (ongoingResponse.success && Array.isArray(ongoingResponse.data) && ongoingResponse.data.length > 0) {
              const match = ongoingResponse.data[0];

              const teams = match.teams as Array<{ score: number }> || [];
              const scoreA = teams[0]?.score || 0;
              const scoreB = teams[1]?.score || 0;

              let creatorType: 'manager' | 'member' | 'guest' | null = null;
              if (match.managerId) {
                creatorType = 'manager';
              } else if (match.createdByMembershipId) {
                creatorType = 'member';
              } else if (match.creatorGuestToken) {
                creatorType = 'guest';
              }

              return {
                tableId: table.id,
                matchId: match.matchId,
                status: match.status,
                startTime: match.startTime ? new Date(match.startTime) : (match.status === 'ongoing' ? new Date() : null),
                isAiAssisted: match.isAiAssisted,
                scoreA: scoreA,
                scoreB: scoreB,
                creatorType: creatorType
              };
            }

            const pendingResponse = await managerMatchService.getMatchesByTable(table.id, 'pending', 1, 1) as Record<string, unknown>;
            if (pendingResponse.success && Array.isArray(pendingResponse.data) && pendingResponse.data.length > 0) {
              const match = pendingResponse.data[0];

              const teams = match.teams as Array<{ score: number }> || [];
              const scoreA = teams[0]?.score || 0;
              const scoreB = teams[1]?.score || 0;

              let creatorType: 'manager' | 'member' | 'guest' | null = null;
              if (match.managerId) {
                creatorType = 'manager';
              } else if (match.createdByMembershipId) {
                creatorType = 'member';
              } else if (match.creatorGuestToken) {
                creatorType = 'guest';
              }

              return {
                tableId: table.id,
                matchId: match.matchId,
                status: match.status,
                startTime: match.startTime ? new Date(match.startTime) : (match.status === 'ongoing' ? new Date() : null),
                isAiAssisted: match.isAiAssisted,
                scoreA: scoreA,
                scoreB: scoreB,
                creatorType: creatorType
              };
            }
          } catch (error) {
            console.error(`Error fetching match data for table ${table.id}:`, error);
          }
          return null;
        });

        const matchResults = await Promise.all(matchDataPromises);
        const matchMap = new Map();
        matchResults.forEach(result => {
          if (result) {
            matchMap.set(result.tableId, result);
          }
        });
        setActiveMatches(matchMap);

        const membersData = await managerMemberService.getAllMembers();
        const members = Array.isArray(membersData) ? membersData : (membersData as MembersData)?.memberships || [];

        const totalTables = transformedTables.length;
        const inUse = transformedTables.filter((table: TableData) => table.status === 'inuse').length;
        const available = transformedTables.filter((table: TableData) => table.status === 'empty').length;
        const totalMembers = members.length;

        setDashboardStats({
          totalTables,
          inUse,
          available,
          members: totalMembers
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoadingStats(false);
        setLoadingTables(false);
      }
    };

    if (!isChecking) {
      fetchDashboardData();
    }
  }, [isChecking]);

  useEffect(() => {
    const interval = setInterval(() => {
    }, 1000);

    return () => clearInterval(interval);
  }, []);



  const handleXemThem = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
    }, 1000);
  };

  const filteredTables = tables.map(table => {
    const matchData = activeMatches.get(table.id);
    let elapsedTime = '0 phút';

    if (matchData && matchData.status === 'ongoing' && matchData.startTime) {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - matchData.startTime.getTime()) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);

      if (hours === 0) {
        elapsedTime = `${minutes} phút`;
      } else {
        elapsedTime = `${hours} giờ ${minutes} phút`;
      }
    }

    const result = {
      ...table,
      matchId: matchData?.matchId,
      matchStatus: matchData?.status as 'pending' | 'ongoing' | 'completed',
      elapsedTime,
      isAiAssisted: matchData?.isAiAssisted,
      scoreA: matchData?.scoreA || 0,
      scoreB: matchData?.scoreB || 0,
      creatorType: matchData?.creatorType || null
    };

    return result;
  }).filter(table => {
    const matchSearch = table.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !type || table.type.toLowerCase() === type.toLowerCase();

    let displayStatus = table.status;
    if (table.status === 'inuse') displayStatus = 'using';
    if (table.status === 'empty') displayStatus = 'available';

    const matchStatus = !status || displayStatus === status;
    return matchSearch && matchType && matchStatus;
  });

  if (isChecking) return null;

  return (
    <>
      {(loadingStats || loadingTables) && <ScoreLensLoading text="Đang tải..." />}
      <div className="flex min-h-screen bg-gray-50">
        <SidebarManager />
        <main className="flex-1 bg-[#FFFFFF] min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderManager />
          </div>
          <div className="px-10 pb-10">
            <div className="w-full mx-auto">
              {loadingStats ? (
                <div className="">
                  <LoadingSkeleton type="card" />
                </div>
              ) : (
                <DashboardSummary
                  totalTables={dashboardStats.totalTables}
                  inUse={dashboardStats.inUse}
                  available={dashboardStats.available}
                  members={dashboardStats.members}
                />
              )}
              <div className="bg-white rounded-lg p-6">
                <TableFilterBar
                  search={search}
                  onSearchChange={setSearch}
                  type={type}
                  onTypeChange={setType}
                  status={status}
                  onStatusChange={setStatus}
                />
                {loadingTables ? (
                  <div className="py-8">
                    <LoadingSkeleton type="card" lines={3} className="w-full max-w-2xl mx-auto" />
                  </div>
                ) : filteredTables.length === 0 ? (
                  <EmptyState
                    icon={
                      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5v4m8-4v4M8 11h8M8 15h8" />
                      </svg>
                    }
                    title={search ? 'Không tìm thấy bàn phù hợp' : 'Chưa có bàn nào'}
                    description={'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy bàn phù hợp'}
                    secondaryAction={search ? {
                      label: 'Xem tất cả',
                      onClick: () => {
                        setSearch('');
                        setType('');
                        setStatus('');
                      },
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 12h16M4 20h16" />
                        </svg>
                      )
                    } : undefined}
                    showAdditionalInfo={!search}
                  />
                ) : (
                  <TableCardList
                    tables={filteredTables}
                    onDetail={async (id) => {
                      try {
                        await managerMatchService.getMatchesByTable(id, 'ongoing', 1, 1);
                      } catch (error) {
                        console.error('Error prefetching match by table:', error);
                      } finally {
                        router.push(`/manager/matches/${id}`);
                      }
                    }}
                  />
                )}
                {filteredTables.length > 9 && (
                  <div className="flex justify-center mt-6">
                    <ButtonViewMore onClick={handleXemThem}>
                      {actionLoading ? <LoadingSpinner size="sm" /> : 'Xem thêm'}
                    </ButtonViewMore>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 