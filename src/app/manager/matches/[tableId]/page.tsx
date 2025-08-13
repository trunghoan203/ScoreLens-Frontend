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
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { managerTableService } from '@/lib/managerTableService';
import { managerMemberService } from '@/lib/managerMemberService';
import { managerMatchService } from '@/lib/managerMatchService';
import { MatchSummaryModal } from '@/components/manager/MatchSummaryModal';
import { EditMatchModal } from '@/components/manager/EditMatchModal';
import { EditScoreModal } from '@/components/manager/EditScoreModal';
import { AISelectionModal } from '@/components/manager/AISelectionModal';
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

interface MatchData {
  matchId: string;
  tableName: string;
  gameType: string;
  startTime?: Date;
  endTime?: Date;
  teams: Array<{
    teamName: string;
    score: number;
    isWinner: boolean;
    members: Array<{
      guestName?: string;
      membershipName?: string;
    }>;
  }>;
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
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [matchStatus, setMatchStatus] = useState<'pending' | 'ongoing' | 'completed'>('pending');
  const [isEditing, setIsEditing] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditScoreModal, setShowEditScoreModal] = useState(false);
  const [showAISelectionModal, setShowAISelectionModal] = useState(false);
  const [pendingTeams, setPendingTeams] = useState<{
    teamA: Array<{ guestName?: string; phoneNumber?: string }>;
    teamB: Array<{ guestName?: string; phoneNumber?: string }>;
  } | null>(null);
  const [isAiAssisted, setIsAiAssisted] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [matchStartTime, setMatchStartTime] = useState<Date | null>(null);

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

          try {
            const matchResponse = await managerMatchService.getMatchesByTable(tableId, 'ongoing', 1, 1) as Record<string, unknown>;
            if (matchResponse.success && Array.isArray(matchResponse.data) && matchResponse.data.length > 0) {
              const activeMatch = matchResponse.data[0];
              if (activeMatch.teams && activeMatch.teams.length >= 2) {
                const teamAMembers = activeMatch.teams[0]?.members?.map((m: Record<string, unknown>) => m.guestName || m.membershipName || 'Unknown') || [];
                const teamBMembers = activeMatch.teams[1]?.members?.map((m: Record<string, unknown>) => m.guestName || m.membershipName || 'Unknown') || [];
                setTeamA(teamAMembers);
                setTeamB(teamBMembers);
                setTeamAScore(activeMatch.teams[0]?.score || 0);
                setTeamBScore(activeMatch.teams[1]?.score || 0);
                setTableStatus('using');
                setActiveMatchId(activeMatch.matchId);
                setMatchStatus(activeMatch.status || 'pending');
                if (activeMatch.isAiAssisted !== undefined) {
                  setIsAiAssisted(activeMatch.isAiAssisted as boolean);
                }
                if (activeMatch.startTime) {
                  const startTime = new Date(activeMatch.startTime);
                  setMatchStartTime(startTime);

                  if (activeMatch.status === 'ongoing') {
                    const now = new Date();
                    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                    const hours = Math.floor(elapsed / 3600);
                    const minutes = Math.floor((elapsed % 3600) / 60);
                    const seconds = elapsed % 60;
                    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    setElapsedTime(timeString);
                  }
                }
              }
            } else {
              const pendingResponse = await managerMatchService.getMatchesByTable(tableId, 'pending', 1, 1) as Record<string, unknown>;
              if (pendingResponse.success && Array.isArray(pendingResponse.data) && pendingResponse.data.length > 0) {
                const pendingMatch = pendingResponse.data[0];
                if (pendingMatch.teams && pendingMatch.teams.length >= 2) {
                  const teamAMembers = pendingMatch.teams[0]?.members?.map((m: Record<string, unknown>) => m.guestName || m.membershipName || 'Unknown') || [];
                  const teamBMembers = pendingMatch.teams[1]?.members?.map((m: Record<string, unknown>) => m.guestName || m.membershipName || 'Unknown') || [];
                  setTeamA(teamAMembers);
                  setTeamB(teamBMembers);
                  setTeamAScore(pendingMatch.teams[0]?.score || 0);
                  setTeamBScore(pendingMatch.teams[1]?.score || 0);
                  setTableStatus('using');
                  setActiveMatchId(pendingMatch.matchId);
                  setMatchStatus(pendingMatch.status || 'pending');
                  if (pendingMatch.isAiAssisted !== undefined) {
                    setIsAiAssisted(pendingMatch.isAiAssisted as boolean);
                  }
                  if (pendingMatch.startTime) {
                    const startTime = new Date(pendingMatch.startTime);
                    setMatchStartTime(startTime);

                    if (pendingMatch.status === 'ongoing') {
                      const now = new Date();
                      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                      const hours = Math.floor(elapsed / 3600);
                      const minutes = Math.floor((elapsed % 3600) / 60);
                      const seconds = elapsed % 60;
                      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                      setElapsedTime(timeString);
                    }
                  }
                }
              } else {
                setTeamA(foundTable.teamA ? [foundTable.teamA] : []);
                setTeamB(foundTable.teamB ? [foundTable.teamB] : []);
                setActiveMatchId(null);
              }
            }
          } catch (matchError) {
            console.error('Error fetching match data:', matchError);
            setTeamA(foundTable.teamA ? [foundTable.teamA] : []);
            setTeamB(foundTable.teamB ? [foundTable.teamB] : []);
            setActiveMatchId(null);
          }
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

  const { } = useWebSocket({
    matchId: activeMatchId,
    matchStatus,
    onTimeUpdate: (elapsedTime) => {
      setElapsedTime(elapsedTime);
    },
    onMatchUpdate: (updatedMatch) => {
      const match = updatedMatch as Record<string, unknown>;
      setMatchStatus(match.status as 'pending' | 'ongoing' | 'completed');
      if (match.status === 'completed') {
        setElapsedTime('00:00:00');
      }
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (matchStatus === 'ongoing' && matchStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - matchStartTime.getTime()) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setElapsedTime(timeString);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [matchStatus, matchStartTime]);


  const handleCreateMatch = async (teamA: Array<{ guestName?: string; phoneNumber?: string }>, teamB: Array<{ guestName?: string; phoneNumber?: string }>) => {
    setPendingTeams({ teamA, teamB });
    setShowAISelectionModal(true);
  };

  const handleConfirmAISelection = async (isAiAssisted: boolean) => {
    if (!pendingTeams) return;

    setCreatingMatch(true);
    try {
      const createdByMembershipId = localStorage.getItem('membershipId') || undefined;

      const matchData = {
        tableId,
        gameType: (table?.type === 'carom' ? 'carom' : 'pool-8') as 'carom' | 'pool-8',
        createdByMembershipId,
        isAiAssisted,
        teams: [
          {
            teamName: 'Team A',
            members: pendingTeams.teamA
          },
          {
            teamName: 'Team B',
            members: pendingTeams.teamB
          }
        ]
      };

      const response = await managerMatchService.createMatch(matchData) as Record<string, unknown>;

      if (response.success) {
        toast.success('Tạo trận đấu thành công!');

        const responseData = response.data as Record<string, unknown>;
        if (responseData?.teams && Array.isArray(responseData.teams)) {
          const teamA = responseData.teams[0] as Record<string, unknown>;
          const teamB = responseData.teams[1] as Record<string, unknown>;

          if (teamA?.members && Array.isArray(teamA.members)) {
            const teamAMembers = teamA.members.map((m: Record<string, unknown>) =>
              (m.membershipName as string) || (m.guestName as string) || 'Unknown'
            );
            setTeamA(teamAMembers);
          }

          if (teamB?.members && Array.isArray(teamB.members)) {
            const teamBMembers = teamB.members.map((m: Record<string, unknown>) =>
              (m.membershipName as string) || (m.guestName as string) || 'Unknown'
            );
            setTeamB(teamBMembers);
          }
        }

        setTableStatus('using');
        setIsEditing(false);

        if (responseData?.matchId) {
          setActiveMatchId(responseData.matchId as string);
        }

        if (responseData?.isAiAssisted !== undefined) {
          setIsAiAssisted(responseData.isAiAssisted as boolean);
        }

      } else {
        toast.error((response.message as string) || 'Tạo trận đấu thất bại!');
      }
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error('Tạo trận đấu thất bại!');
    } finally {
      setCreatingMatch(false);
      setShowAISelectionModal(false);
      setPendingTeams(null);
    }
  };

  const handleStartMatch = async () => {
    try {
      if (!activeMatchId) {
        toast.error('Không xác định được trận đấu để bắt đầu');
        return;
      }
      const res = (await managerMatchService.startMatch(activeMatchId)) as Record<string, unknown>;
      if (res?.success) {
        toast.success('Bắt đầu trận đấu thành công!');
        setMatchStatus('ongoing');
        setMatchStartTime(new Date());
      } else {
        toast.error((res?.message as string) || 'Bắt đầu trận đấu thất bại!');
      }
    } catch (error) {
      console.error('Error starting match:', error);
      toast.error('Bắt đầu trận đấu thất bại!');
    }
  };

  const handleEditMembers = () => {
    setShowEditModal(false);
    setIsEditing(true);
  };

  const handleEditScores = () => {
    setShowEditModal(false);
    setShowEditScoreModal(true);
  };

  const handleSaveScores = async (newTeamAScore: number, newTeamBScore: number) => {
    try {
      if (!activeMatchId) {
        toast.error('Không xác định được trận đấu để cập nhật');
        return;
      }

      await Promise.all([
        managerMatchService.updateScore(activeMatchId, { teamIndex: 0, score: newTeamAScore }),
        managerMatchService.updateScore(activeMatchId, { teamIndex: 1, score: newTeamBScore }),
      ]);

      setTeamAScore(newTeamAScore);
      setTeamBScore(newTeamBScore);
      setShowEditScoreModal(false);
      toast.success('Cập nhật điểm số thành công!');
    } catch (error) {
      console.error('Error updating scores:', error);
      toast.error('Cập nhật điểm số thất bại!');
    }
  };

  const handleUpdateTeams = async (updatedTeamA: Array<{ guestName?: string; phoneNumber?: string }>, updatedTeamB: Array<{ guestName?: string; phoneNumber?: string }>) => {
    try {
      if (!activeMatchId) {
        toast.error('Không xác định được trận đấu để cập nhật');
        return;
      }

      await managerMatchService.updateTeamMembers(activeMatchId, {
        teams: [
          updatedTeamA,
          updatedTeamB
        ]
      });

      const matchResponse = await managerMatchService.getMatchById(activeMatchId) as Record<string, unknown>;
      if (matchResponse?.success) {
        const currentMatch = matchResponse.data as Record<string, unknown>;
        if (currentMatch?.teams && Array.isArray(currentMatch.teams)) {
          const teamA = currentMatch.teams[0] as Record<string, unknown>;
          const teamB = currentMatch.teams[1] as Record<string, unknown>;

          if (teamA?.members && Array.isArray(teamA.members)) {
            const teamAMembers = teamA.members.map((m: Record<string, unknown>) =>
              (m.membershipName as string) || (m.guestName as string) || 'Unknown'
            );
            setTeamA(teamAMembers);
          }

          if (teamB?.members && Array.isArray(teamB.members)) {
            const teamBMembers = teamB.members.map((m: Record<string, unknown>) =>
              (m.membershipName as string) || (m.guestName as string) || 'Unknown'
            );
            setTeamB(teamBMembers);
          }
        }
      }

      setIsEditing(false);
      toast.success('Cập nhật thành viên thành công!');
    } catch (error) {
      console.error('Error updating team members:', error);
      toast.error('Cập nhật thành viên thất bại!');
    }
  };

  const handleCancelMatch = async () => {
    try {
      if (!activeMatchId) {
        toast.error('Không xác định được trận đấu để hủy');
        return;
      }

      const res = await managerMatchService.deleteMatch(activeMatchId) as Record<string, unknown>;
      if (res?.success) {
        toast.success('Hủy trận đấu thành công!');
        router.push('/manager/dashboard');
      } else {
        toast.error((res?.message as string) || 'Hủy trận đấu thất bại!');
      }
    } catch (error) {
      console.error('Error canceling match:', error);
      toast.error('Hủy trận đấu thất bại!');
    }
  };

  const handleEndMatch = async () => {
    try {
      if (!activeMatchId) {
        toast.error('Không xác định được trận đấu để kết thúc');
        return;
      }

      const matchResponse = await managerMatchService.getMatchById(activeMatchId) as Record<string, unknown>;
      if (matchResponse?.success) {
        const currentMatch = matchResponse.data as Record<string, unknown>;

        const teams = (currentMatch?.teams as Array<Record<string, unknown>>) || [];

        const scores = teams.map((team: Record<string, unknown>) => team.score as number);
        const maxScore = Math.max(...scores);
        const teamsWithMaxScore = teams.filter((team: Record<string, unknown>) => team.score === maxScore);

        const teamsWithWinner = teams.map((team: Record<string, unknown>) => ({
          teamName: team.teamName as string || 'Team',
          score: team.score as number || 0,
          isWinner: team.score === maxScore && maxScore > 0 && teamsWithMaxScore.length === 1,
          members: (team.members as Array<Record<string, unknown>>) || []
        }));

        setMatchData({
          matchId: currentMatch?.matchId as string,
          tableName: table?.name || 'Unknown',
          gameType: currentMatch?.gameType as string,
          startTime: currentMatch?.startTime ? new Date(currentMatch.startTime as string) : undefined,
          endTime: new Date(),
          teams: teamsWithWinner
        });
        setShowSummaryModal(true);
      } else {
        toast.error('Không thể lấy thông tin trận đấu');
      }
    } catch (error) {
      console.error('Error getting match data:', error);
      toast.error('Không thể lấy thông tin trận đấu');
    }
  };

  const handleConfirmEndMatch = async () => {
    try {
      if (!activeMatchId) {
        toast.error('Không xác định được trận đấu để kết thúc');
        return;
      }
      const res = (await managerMatchService.endMatch(activeMatchId)) as Record<string, unknown>;
      if (res?.success) {
        toast.success('Kết thúc trận đấu thành công!');
        router.push('/manager/dashboard');
      } else {
        toast.error((res?.message as string) || 'Kết thúc trận đấu thất bại!');
      }
    } catch (error) {
      console.error('Error ending match:', error);
      toast.error('Kết thúc trận đấu thất bại!');
    }
  };

  if (isChecking) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarManager />
        <main className="flex-1 bg-[#FFFFFF] min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderManager />
          </div>
          <div className="p-10">
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
          </div>
        </main>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarManager />
        <main className="flex-1 bg-[#FFFFFF] min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
            <HeaderManager />
          </div>
          <div className="p-10">
            <div className="w-full mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="py-8 text-center text-gray-400">
                  <div>Không tìm thấy bàn</div>
                </div>
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
        <main className="flex-1 bg-[#FFFFFF] min-h-screen">
          <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
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
                {tableStatus === 'available' || isEditing ? (
                  <TableAvailableView
                    table={{
                      id: table.id,
                      name: table.name,
                      category: table.type === 'pool-8' ? 'Pool 8' : table.type === 'carom' ? 'Carom' : table.type
                    }}
                    onReady={isEditing ? handleUpdateTeams : handleCreateMatch}
                    loading={creatingMatch}
                    isEditing={isEditing}
                    onBack={() => setIsEditing(false)}
                    elapsedTime={elapsedTime}
                    {...(isEditing ? { teamA, teamB } : {})}
                  />
                ) : (
                  <TableUsingView
                    table={{
                      id: table.id,
                      name: table.name,
                      teamA,
                      teamB,
                      teamAScore,
                      teamBScore,
                      time: table.time || '00:00:00',
                      category: table.type === 'pool-8' ? 'Pool 8' : table.type === 'carom' ? 'Carom' : table.type
                    }}
                    onBack={() => router.push('/manager/dashboard')}
                    onEndMatch={handleEndMatch}
                    onCancelMatch={handleCancelMatch}
                    onEdit={() => setShowEditModal(true)}
                    onStartMatch={handleStartMatch}
                    matchStatus={matchStatus}
                    elapsedTime={elapsedTime}
                    isAiAssisted={isAiAssisted}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <MatchSummaryModal
        open={showSummaryModal}
        matchData={matchData}
        onConfirm={handleConfirmEndMatch}
        onCancel={() => {
          setShowSummaryModal(false);
          setMatchData(null);
        }}
      />

      <EditMatchModal
        open={showEditModal}
        onEditMembers={handleEditMembers}
        onEditScores={handleEditScores}
        onCancel={() => setShowEditModal(false)}
      />

      <EditScoreModal
        open={showEditScoreModal}
        teamAScore={teamAScore}
        teamBScore={teamBScore}
        onSave={handleSaveScores}
        onCancel={() => setShowEditScoreModal(false)}
      />

      <AISelectionModal
        open={showAISelectionModal}
        onConfirm={handleConfirmAISelection}
        onCancel={() => setShowAISelectionModal(false)}
      />
    </>
  );
} 