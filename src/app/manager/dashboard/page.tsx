'use client';
import React, { useState } from 'react';
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import DashboardSummary from '@/components/manager/DashboardSummary';
import TableFilterBar from '@/components/manager/TableFilterBar';
import TableCardList from '@/components/manager/TableCardList';
import ButtonXemThem from '@/components/manager/ButtonXemThem';
import { useRouter } from 'next/navigation';

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
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  // Lọc dữ liệu theo filter
  const filteredTables = mockTables.filter(table => {
    const matchSearch = table.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !type || table.type === type;
    const matchStatus = !status || table.status === status;
    return matchSearch && matchType && matchStatus;
  }) as typeof mockTables;

  return (
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
            <TableCardList
              tables={filteredTables}
              onDetail={(id) => router.push(`/manager/matches/${id}`)}
            />
            <ButtonXemThem />
          </div>
        </div>
      </main>
    </div>
  );
} 