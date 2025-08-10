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
import EmptyState from '@/components/ui/EmptyState';
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
  const [isScrolled, setIsScrolled] = useState(false);
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

  React.useEffect(() => {
    const timer = setTimeout(() => {
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <main className="flex-1 bg-[#FFFFFF] min-h-screen">
          <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${
            isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
          }`}>
            <HeaderManager />
          </div>
          <div className="p-10">
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
                  <EmptyState
                    icon={
                      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5v4m8-4v4M8 11h8M8 15h8" />
                      </svg>
                    }
                    title={search ? 'Không tìm thấy bàn phù hợp' : 'Chưa có bàn nào'}
                    description={
                      search 
                        ? 'Thử thay đổi từ khóa tìm kiếm hoặc thêm bàn mới để mở rộng cơ sở vật chất'
                        : 'Bắt đầu thiết lập hệ thống bàn chơi chuyên nghiệp cho câu lạc bộ của bạn'
                    }
                    primaryAction={{
                      label: 'Thêm bàn mới',
                      onClick: () => router.push('/manager/tables/add'),
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )
                    }}
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
                    additionalInfo="Bàn chơi sẽ giúp bạn cung cấp dịch vụ chất lượng và thu hút hội viên"
                    showAdditionalInfo={!search}
                  />
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
          </div>
        </main>
      </div>
    </>
  );
} 