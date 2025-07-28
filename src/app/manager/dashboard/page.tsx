'use client';
import React, { useState } from 'react';
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
  // Đã xoá loading và tableLoading vì không còn sử dụng
  const [actionLoading, setActionLoading] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      // setLoading(false); // This line is removed
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleXemThem = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      // Thêm logic load thêm dữ liệu nếu cần
    }, 1000);
  };

  // Lọc dữ liệu theo filter
  const filteredTables = mockTables.filter(table => {
    const matchSearch = table.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !type || table.type === type;
    const matchStatus = !status || table.status === status;
    return matchSearch && matchType && matchStatus;
  }) as typeof mockTables;

  if (isChecking) return null;

  return (
    <>
      {/* Đã loại bỏ ScoreLensLoading toàn trang để tránh loading dư thừa */}
      <div className="flex min-h-screen bg-gray-50">
        <SidebarManager />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderManager />
          <div className="w-full mx-auto">
            <DashboardSummary totalTables={20} inUse={12} available={8} members={156} />
            <div className="bg-white rounded-lg shadow p-6">
              <TableFilterBar
                search={search}
                onSearchChange={setSearch}
                type={type}
                onTypeChange={setType}
                status={status}
                onStatusChange={setStatus}
              />
              {/* tableLoading ? ( // This line is removed
                <div className="py-8"><LoadingSkeleton type="table" lines={3} /></div>
              ) : */}
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