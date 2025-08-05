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

interface TableData {
  id: string;
  tableId?: string;
  name: string;
  type: string;
  status: 'inuse' | 'empty' | 'maintenance' | 'using' | 'available';
  teamA?: string;
  teamB?: string;
  time?: string;
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingStats(true);
        setLoadingTables(true);

        const tablesData = await managerTableService.getAllTables();
        const tablesArray = Array.isArray(tablesData) ? tablesData : (tablesData as any)?.tables || [];
        
        const transformedTables: TableData[] = tablesArray.map((table: any) => ({
          id: table.tableId || table.id || table._id,
          tableId: table.tableId,
          name: table.name,
          type: table.category || table.type,
          status: table.status,
          teamA: table.teamA,
          teamB: table.teamB,
          time: table.time
        }));

        setTables(transformedTables);

        const membersData = await managerMemberService.getAllMembers();
        const members = Array.isArray(membersData) ? membersData : (membersData as any)?.memberships || [];

        const totalTables = transformedTables.length;
        const inUse = transformedTables.filter((table: TableData) => table.status === 'inuse').length;
        const maintenance = transformedTables.filter((table: TableData) => table.status === 'maintenance').length;
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

  const filteredTables = tables.filter(table => {
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
              {loadingTables ? (
                <div className="py-8">
                  <LoadingSkeleton type="card" />
                </div>
              ) : filteredTables.length === 0 ? (
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
              {filteredTables.length > 9 && (
                <div className="flex justify-center mt-6">
                  <ButtonXemThem onClick={handleXemThem}>
                    {actionLoading ? <LoadingSpinner size="sm" /> : 'Xem thêm'}
                  </ButtonXemThem>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 