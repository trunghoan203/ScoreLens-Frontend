'use client';
import React, { useState, useEffect } from 'react';
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import DashboardSummary from '@/components/manager/DashboardSummary';
import TableFilterBar from '@/components/manager/TableFilterBar';
import TableCardList from '@/components/manager/TableCardList';
import ButtonXemThem from '@/components/manager/ButtonXemThem';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';
import { managerTableService } from '@/lib/managerTableService';
import { managerMemberService } from '@/lib/managerMemberService';
import toast from 'react-hot-toast';

const mockTables = [
  { id: '1', name: 'Bàn 01 - Bida Pool', type: 'pool', status: 'using' as const, teamA: 'Team A', teamB: 'Team B', time: '01:23:45' },
  { id: '2', name: 'Bàn 02 - Bida Pool', type: 'pool', status: 'available' as const },
  { id: '3', name: 'Bàn 03 - Bida Carom', type: 'carom', status: 'available' as const },
  { id: '4', name: 'Bàn 04 - Bida Pool', type: 'pool', status: 'using' as const, teamA: 'Team A', teamB: 'Team B', time: '01:23:45' },
  { id: '5', name: 'Bàn 05 - Bida Pool', type: 'pool', status: 'using' as const, teamA: 'Team A', teamB: 'Team B', time: '01:23:45' },
  { id: '6', name: 'Bàn 06 - Bida Pool', type: 'pool', status: 'using' as const, teamA: 'Team A', teamB: 'Team B', time: '01:23:45' },
  { id: '7', name: 'Bàn 07 - Bida Pool', type: 'pool', status: 'using' as const, teamA: 'Team A', teamB: 'Team B', time: '01:23:45' },
  { id: '8', name: 'Bàn 08 - Bida Pool', type: 'pool', status: 'using' as const, teamA: 'Team A', teamB: 'Team B', time: '01:23:45' },
  { id: '9', name: 'Bàn 09 - Bida Pool', type: 'pool', status: 'using' as const, teamA: 'Team A', teamB: 'Team B', time: '01:23:45' },
];

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

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoadingStats(true);

        // Fetch tables data
        const tablesData = await managerTableService.getAllTables();
        const tables = Array.isArray(tablesData) ? tablesData : (tablesData as any)?.tables || [];

        // Fetch members data
        const membersData = await managerMemberService.getAllMembers();
        const members = Array.isArray(membersData) ? membersData : (membersData as any)?.memberships || [];

        // Calculate stats
        const totalTables = tables.length;
        const inUse = tables.filter((table: any) => table.status === 'inuse').length;
        const maintenance = tables.filter((table: any) => table.status === 'maintenance').length;
        const available = tables.filter((table: any) => table.status === 'empty').length;
        const totalMembers = members.length;
                
        setDashboardStats({
          totalTables,
          inUse,
          available,
          members: totalMembers
        });
      } catch (error) {
        toast.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoadingStats(false);
      }
    };

    if (!isChecking) {
      fetchDashboardStats();
    }
  }, [isChecking]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleXemThem = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
    }, 1000);
  };

  const filteredTables = mockTables.filter(table => {
    const matchSearch = table.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !type || table.type === type;
    const matchStatus = !status || table.status === status;
    return matchSearch && matchType && matchStatus;
  }) as typeof mockTables;

  if (isChecking) return null;

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <SidebarManager />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderManager />
          <div className="w-full mx-auto">
            {loadingStats ? (
              <div className="my-6">
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
            <div className="bg-white rounded-lg shadow p-6">
              <TableFilterBar
                search={search}
                onSearchChange={setSearch}
                type={type}
                onTypeChange={setType}
                status={status}
                onStatusChange={setStatus}
              />
              {filteredTables.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <LoadingSkeleton type="text" lines={2} />
                  <div>Không có dữ liệu</div>
                </div>
              ) : (
                <TableCardList
                  tables={filteredTables}
                  onDetail={(id) => router.push(`/manager/matches/${id}`)}
                />
              )}
              <div className="flex justify-center mt-6">
                <ButtonXemThem onClick={handleXemThem}>
                  {actionLoading ? <LoadingSpinner size="sm" /> : 'Xem thêm'}
                </ButtonXemThem>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 