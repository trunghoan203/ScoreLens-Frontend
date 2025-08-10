'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarManager from '@/components/manager/SidebarManager';
import HeaderManager from '@/components/manager/HeaderManager';
import DashboardSummary from '@/components/manager/DashboardSummary';
import TableAvailableView from '@/components/manager/TableAvailableView';
import TableUsingView from '@/components/manager/TableUsingView';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
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



export default function TableDetailPage() {
  const { isChecking } = useManagerAuthGuard();
  const params = useParams();
  const router = useRouter();
  const tableId = params?.tableId as string;

  const [loading, setLoading] = useState(true);
  const [creatingMatch, setCreatingMatch] = useState(false);
  const [table, setTable] = useState<TableData | null>(null);
  const [tableStatus, setTableStatus] = useState<'available' | 'using'>('available');
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    totalTables: 0,
    inUse: 0,
    available: 0,
    members: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingStats(true);

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

        const foundTable = transformedTables.find(t => t.id === tableId || t.tableId === tableId);
        if (foundTable) {
          setTable(foundTable);
          setTableStatus(foundTable.status === 'inuse' ? 'using' : 'available');
          setTeamA(foundTable.teamA ? [foundTable.teamA] : []);
          setTeamB(foundTable.teamB ? [foundTable.teamB] : []);
        } else {
          toast.error('Không tìm thấy bàn');
          router.push('/manager/dashboard');
        }

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
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
        setLoadingStats(false);
      }
    };

    if (!isChecking) {
      fetchData();
    }
  }, [isChecking, tableId, router]);

  const handleCreateMatch = async (teamA: string[], teamB: string[]) => {
    setCreatingMatch(true);
    try {
      const createdByMembershipId = localStorage.getItem('membershipId') || 'MB-1752246596272';
      
      const matchData = {
        tableId,
        gameType: table?.type === 'carom' ? 'carom' : 'pool-8',
        createdByMembershipId,
        isAiAssisted: false,
        teams: [
          {
            teamName: 'Team A',
            members: teamA.map(name => ({ guestName: name }))
          },
          {
            teamName: 'Team B',
            members: teamB.map(name => ({ guestName: name }))
          }
        ]
      };

      await managerMatchService.createMatch(matchData);
      
      toast.success('Tạo trận đấu thành công!');
      setTeamA(teamA);
      setTeamB(teamB);
      setTableStatus('using');
      setIsEditing(false);
      
      if (table) {
        await managerTableService.updateTable(tableId, {
          name: table.name,
          category: table.type,
          status: 'inuse'
        });
      }
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error('Tạo trận đấu thất bại!');
    } finally {
      setCreatingMatch(false);
    }
  };

  if (isChecking) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarManager />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderManager />
          <div className="w-full mx-auto">
            <div className="my-6">
              <LoadingSkeleton type="card" />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="py-8">
                <LoadingSkeleton type="card" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarManager />
        <main className="flex-1 bg-white p-10 min-h-screen">
          <HeaderManager />
          <div className="w-full mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="py-8 text-center text-gray-400">
                <div>Không tìm thấy bàn</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                             {tableStatus === 'available' || isEditing ? (
                 <TableAvailableView
                   table={{ id: table.id, name: table.name }}
                   onReady={handleCreateMatch}
                   loading={creatingMatch}
                   {...(isEditing ? { teamA, teamB } : {})}
                 />
               ) : (
                <TableUsingView
                  table={{ 
                    id: table.id, 
                    name: table.name, 
                    teamA, 
                    teamB, 
                    time: table.time || '00:00:00' 
                  }}
                  onBack={() => setTableStatus('available')}
                  onEndMatch={() => toast.success('Kết thúc trận đấu thành công!')}
                  onEdit={() => setIsEditing(true)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 