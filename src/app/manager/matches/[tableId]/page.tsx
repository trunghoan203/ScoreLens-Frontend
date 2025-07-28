"use client";
import { useState } from 'react';
import { useParams } from 'next/navigation';
import SidebarManager from '@/components/manager/SidebarManager';
import DashboardSummary from '@/components/manager/DashboardSummary';
import TableAvailableView from '@/components/manager/TableAvailableView';
import TableUsingView from '@/components/manager/TableUsingView';
import toast from 'react-hot-toast';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import React from 'react';

const mockTables = [
  { id: '1', name: 'Bàn 01 - Bida Pool', status: 'using', teamA: ['Võ Nguyễn Kim Ngân', 'Cao Trung Hoan'], teamB: ['Huỳnh Gia Bảo', 'Nguyễn Minh Tuấn'], time: '01:23:45' },
  { id: '2', name: 'Bàn 02 - Bida Pool', status: 'available', teamA: [], teamB: [], time: '' },
  // ...
];

export default function TableDetailPage() {
  const params = useParams();
  const tableId = params?.tableId as string;
  const table = mockTables.find(t => t.id === tableId) || mockTables[0];
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const [tableStatus, setTableStatus] = useState<'available' | 'using'>(table.status as 'available' | 'using');
  const [teamA, setTeamA] = useState<string[]>(table.teamA);
  const [teamB, setTeamB] = useState<string[]>(table.teamB);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="flex min-h-screen bg-gray-50">
        <SidebarManager />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <div className="text-xl font-bold mb-4">Trang chủ</div>
          <DashboardSummary totalTables={20} inUse={12} available={8} members={156} />
          <div className="mt-6">
            {tableStatus === 'available' || isEditing ? (
              <TableAvailableView
                table={{ id: table.id, name: table.name }}
                onReady={(a, b) => {
                  setTeamA(a);
                  setTeamB(b);
                  setTableStatus('using');
                  setIsEditing(false);
                }}
                {...(isEditing ? { teamA, teamB } : {})}
              />
            ) : (
              <TableUsingView
                table={{ id: table.id, name: table.name, teamA, teamB, time: table.time }}
                onBack={() => setTableStatus('available')}
                onEndMatch={() => toast.success('Kết thúc trận đấu thành công!')}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
} 