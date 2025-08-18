'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ScoreEditor from '@/components/user/ScoreEditor';
import MatchEnd from '@/components/user/MatchEnd';
import EditOption from '@/components/user/EditOption';
import TeamMembers from '@/components/user/TeamMembers';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import socketService from '@/lib/socketService';
import { useMatchRole } from '@/lib/hooks/useMatchRole';
import RoleBadge from '@/components/ui/RoleBadge';
import PermissionGuard from '@/components/ui/PermissionGuard';
import Image from 'next/image';
import SessionTokenSync from '@/components/user/SessionTokenSync';


function ScoreboardPage() {
  console.log('🎯 ScoreboardPage: Component initialized');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [showEditChoicePopup, setShowEditChoicePopup] = useState(false);
  const [showEditMembersPopup, setShowEditMembersPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [matchId, setMatchId] = useState<string>('');
  const [matchCode, setMatchCode] = useState<string | null>(null);
  const [actorGuestToken, setActorGuestToken] = useState<string | null>(null);
  const [actorMembershipId, setActorMembershipId] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string>('');

  const [matchInfo, setMatchInfo] = useState<{
    status?: 'pending' | 'ongoing' | 'completed';
    tableId?: string;
    isAiAssisted?: boolean;
    createdByMembershipId?: string;
    creatorGuestToken?: string;
    teams?: Array<{
      score?: number;
      members?: Array<{
        guestName?: string;
        membershipName?: string;
        fullName?: string;
        role?: 'host' | 'participant';
        sessionToken?: string;
      }>;
    }>;
  } | null>(null);
  const [tableInfo, setTableInfo] = useState<{
    name?: string;
    category?: string;
    clubId?: string;
  } | null>(null);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);

  const [aiResults] = useState<string[]>([]);
  const [matchStartTime, setMatchStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

  // Sử dụng useMatchRole hook để quản lý role và authentication
  const { 
    role: matchRole, 
    isHost, 
    isManager, 
    canEdit, 
    authenticateMatch, 
    isLoading: authLoading, 
    error: authError 
  } = useMatchRole(matchId);

  const { isConnected } = useWebSocket({
    matchId,
    matchStatus: matchInfo?.status || 'pending',
    onTimeUpdate: (elapsedTime: string) => {
      setElapsedTime(elapsedTime);
    },
    onMatchUpdate: (updatedMatch: unknown) => {
      const matchData = updatedMatch as {
        createdByMembershipId?: string;
        creatorGuestToken?: string;
        teams?: Array<{
          score?: number;
          members?: Array<{
            guestName?: string;
            membershipName?: string;
            fullName?: string;
            role?: 'host' | 'participant';
            sessionToken?: string;
          }>;
        }>;
      };

      if (matchData?.teams) {
        const newScoreA = matchData.teams[0]?.score ?? scoreA;
        const newScoreB = matchData.teams[1]?.score ?? scoreB;

        if (newScoreA !== scoreA) {
          setScoreA(newScoreA);
        }
        if (newScoreB !== scoreB) {
          setScoreB(newScoreB);
        }

        if (matchData.teams[0]?.members) {
          const teamAMembers = matchData.teams[0].members.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
            member.guestName || member.membershipName || member.fullName || ''
          );
          setTeamA(teamAMembers);
        }

        if (matchData.teams[1]?.members) {
          const teamBMembers = matchData.teams[1].members.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
            member.guestName || member.membershipName || member.fullName || ''
          );
          setTeamB(teamBMembers);
        }

        setMatchInfo(matchData);
      }
    },
    onMatchEnded: (matchData: unknown) => {
      const matchInfo = matchData as {
        matchId?: string;
        tableName?: string;
        matchCode?: string;
        scoreA?: number;
        scoreB?: number;
        teamA?: string[];
        teamB?: string[];
        tableId?: string;
      };
      if (matchInfo && matchInfo.matchId === matchId) {
        toast.success('Trận đấu đã kết thúc!');
        const params = new URLSearchParams();
        if (matchInfo.matchId) params.set('matchId', matchInfo.matchId);
        if (matchInfo.tableName) params.set('tableName', matchInfo.tableName);
        if (matchInfo.matchCode) params.set('matchCode', matchInfo.matchCode);
        if (matchInfo.scoreA !== undefined) params.set('scoreA', matchInfo.scoreA.toString());
        if (matchInfo.scoreB !== undefined) params.set('scoreB', matchInfo.scoreB.toString());
        if (matchInfo.teamA) params.set('teamA', matchInfo.teamA.join(','));
        if (matchInfo.teamB) params.set('teamB', matchInfo.teamB.join(','));
        if (matchInfo.tableId) params.set('tableId', matchInfo.tableId);

        router.push(`/user/match/end?${params.toString()}`);
      }
    }
  });

  // Authenticate với match khi có matchId và sessionToken
  useEffect(() => {
    if (matchId && matchId.trim() !== '' && sessionToken && sessionToken.trim() !== '') {
      authenticateMatch(matchId, sessionToken);
    }
  }, [matchId, sessionToken, authenticateMatch]);

  // Hiển thị lỗi authentication nếu có
  useEffect(() => {
    if (authError) {
      toast.error(`Lỗi xác thực: ${authError}`);
    }
  }, [authError]);

  useEffect(() => {
    if (matchInfo?.teams) {
      const teamAMembers = matchInfo.teams[0]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
        member.guestName || member.membershipName || member.fullName || ''
      ) || [''];
      const teamBMembers = matchInfo.teams[1]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
        member.guestName || member.membershipName || member.fullName || ''
      ) || [''];

      setTeamA(teamAMembers);
      setTeamB(teamBMembers);
    }
  }, [matchInfo]);

  useEffect(() => {
    if (matchId && matchId.trim() !== '' && isConnected) {
      socketService.joinMatchRoom(matchId);
    }
  }, [matchId, isConnected]);

  useEffect(() => {
    if (matchId && matchId.trim() !== '' && socketService.isSocketConnected()) {
      const handleMatchEnded = (data: unknown) => {
        const matchData = data as {
          matchId?: string;
          tableName?: string;
          matchCode?: string;
          scoreA?: number;
          scoreB?: number;
          teamA?: string[];
          teamB?: string[];
          tableId?: string;
        };
        if (matchData && matchData.matchId === matchId) {
          const params = new URLSearchParams();
          if (matchData.matchId) params.set('matchId', matchData.matchId);
          if (matchData.tableName) params.set('tableName', matchData.tableName);
          if (matchData.matchCode) params.set('matchCode', matchData.matchCode);
          if (matchData.scoreA !== undefined) params.set('scoreA', matchData.scoreA.toString());
          if (matchData.scoreB !== undefined) params.set('scoreB', matchData.scoreB.toString());
          if (matchData.teamA) params.set('teamA', matchData.teamA.join(','));
          if (matchData.teamB) params.set('teamB', matchData.teamB.join(','));
          if (matchData.tableId) params.set('tableId', matchData.tableId);

          router.push(`/user/match/end?${params.toString()}`);
        }
      };

      socketService.onMatchEnded(handleMatchEnded);

      return () => {
        if (socketService.isSocketConnected()) {
          socketService.removeAllListeners();
        }
      };
    }
  }, [matchId, router, searchParams]);

  const exampleResults = [
    'Team A - Bi số 5 vào đúng lỗ giữa.',
    'Team B - Lỗi, đánh bi trắng vào lỗ.',
    'Không xác định được tình huống – vui lòng kiểm tra lại video.',
  ];

  useEffect(() => {
    const mId = searchParams?.get('matchId');
    const code = searchParams?.get('room');
    const guestToken = searchParams?.get('guestToken');
    const creatorGuestToken = searchParams?.get('creatorGuestToken');
    const tId = searchParams?.get('tableId');
    const sessionToken = searchParams?.get('sessionToken') || '';

    setMatchId(mId || '');
    if (code) setMatchCode(code);
    if (creatorGuestToken) {
      setActorGuestToken(creatorGuestToken);
    } else if (guestToken) {
      setActorGuestToken(guestToken);
    }
    if (tId) setTableId(tId);
    setSessionToken(sessionToken);



    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const init = async () => {
      try {
        if (mId) {
          const matchData = await userMatchService.getMatchById(mId);
          const responseData = (matchData as { data?: { teams?: Array<{ score?: number; members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }>; tableId?: string; startTime?: string; createdByMembershipId?: string; creatorGuestToken?: string } })?.data || matchData;
          const matchInfoData = responseData as { teams?: Array<{ score?: number; members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }>; tableId?: string; startTime?: string; createdByMembershipId?: string; creatorGuestToken?: string };

          setMatchInfo(matchInfoData);

          if (matchInfoData?.creatorGuestToken && !actorGuestToken) {
            setActorGuestToken(matchInfoData.creatorGuestToken);
          }

          const sA = matchInfoData?.teams?.[0]?.score ?? 0;
          const sB = matchInfoData?.teams?.[1]?.score ?? 0;
          setScoreA(sA);
          setScoreB(sB);

          const teamAMembers = matchInfoData?.teams?.[0]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
            member.guestName || member.membershipName || member.fullName || 'Unknown'
          ) || [];
          const teamBMembers = matchInfoData?.teams?.[1]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
            member.guestName || member.membershipName || member.fullName || 'Unknown'
          ) || [];

          setTeamA(teamAMembers);
          setTeamB(teamBMembers);

          if (!tId && matchInfoData?.tableId) {
            setTableId(matchInfoData.tableId);
          }

          if (matchInfoData?.startTime) {
            setMatchStartTime(new Date(matchInfoData.startTime));
          }
        } else if (code) {
          console.log('🚀 Scoreboard: Getting match by code', { code });
          const matchData = await userMatchService.getMatchByCode(code);
          console.log('🚀 Scoreboard: Match data by code received', { matchData });
          const responseData = (matchData as { data?: { matchId?: string; id?: string; teams?: Array<{ score?: number }> } })?.data || matchData;
          const matchInfoData = responseData as { matchId?: string; id?: string; teams?: Array<{ score?: number }> };
          const id = matchInfoData?.matchId || matchInfoData?.id;
          setMatchId(id || '');

          const sA = matchInfoData?.teams?.[0]?.score ?? 0;
          const sB = matchInfoData?.teams?.[1]?.score ?? 0;
          setScoreA(sA);
          setScoreB(sB);
        }
      } catch (error) {
        toast.error('Không thể tải thông tin trận đấu');
      } finally {
        timer = setTimeout(() => setLoading(false), 800);
      }
    };
    void init();

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [searchParams, actorGuestToken]);

  useEffect(() => {
    const verifyTableInfo = async () => {
      if (tableId || matchInfo?.tableId) {
        const currentTableId = tableId || matchInfo?.tableId || '';
        try {
          const tableData = await userMatchService.verifyTable({ tableId: currentTableId });
          const tableResponseData = (tableData as { data?: { name?: string; category?: string; clubId?: string } })?.data || tableData;
          const tableInfoData = tableResponseData as { name?: string; category?: string; clubId?: string };
          setTableInfo(tableInfoData);
        } catch {
          toast.error('Không thể tải thông tin bàn');
        }
      }
    };

    verifyTableInfo();
  }, [tableId, matchInfo?.tableId]);

  useEffect(() => {
    if (!matchStartTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - matchStartTime.getTime();

      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setElapsedTime(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, [matchStartTime]);

  const handleEditScore = () => {
    setShowEditChoicePopup(true);
  };
  const handleEndMatch = () => {
    setShowEndPopup(true);
  };

  // Helper function để kiểm tra quyền và sessionToken
  const validatePermissions = () => {
    if (!matchId || matchId.trim() === '') {
      toast.error('Không tìm thấy thông tin trận đấu');
      return false;
    }

    if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
      toast.error('Bạn không có quyền chỉnh sửa');
      return false;
    }
    
    if (!sessionToken || sessionToken.trim() === '') {
      toast.error('Vui lòng cung cấp sessionToken hợp lệ');
      return false;
    }

    return true;
  };

  const persistScores = async (newA: number, newB: number) => {
    console.log('📊 Scoreboard: persistScores called', { newA, newB, matchId, sessionToken });
    if (!matchId || matchId.trim() === '' || !sessionToken || sessionToken.trim() === '') {
      return;
    }
    setUpdating(true);
    
    try {
      await userMatchService.updateScore(matchId, {
        teamIndex: 0,
        score: newA,
        actorGuestToken: actorGuestToken || undefined,
        actorMembershipId: matchInfo?.createdByMembershipId || undefined,
        sessionToken: sessionToken,
      });
      
      await userMatchService.updateScore(matchId, {
        teamIndex: 1,
        score: newB,
        actorGuestToken: actorGuestToken || undefined,
        actorMembershipId: matchInfo?.createdByMembershipId || undefined,
        sessionToken: sessionToken,
      });
      return true;
      
    } catch (error) {
      // Nếu lỗi SessionToken → tự động sync và retry
      if ((error as Error).message?.includes('SessionToken không hợp lệ')) {
        try {
          // Sync token với backend
          await syncSessionTokenWithBackend();
          
          // Retry với token mới
          return await persistScores(newA, newB);
          
        } catch (syncError) {
          // Silent fail for sync errors
        }
      }
      
      toast.error('Cập nhật điểm thất bại.');
      throw new Error('Cập nhật điểm thất bại');
    } finally {
      setUpdating(false);
    }
  };

  // Auto-sync sessionToken when component mounts
  useEffect(() => {
    if (matchId && matchInfo?.createdByMembershipId) {
      syncSessionTokenWithBackend();
    }
  }, [matchId, matchInfo?.createdByMembershipId]);



  // Auto-sync sessionToken with backend - SỬ DỤNG API MỚI
  const syncSessionTokenWithBackend = async () => {
    if (matchId) {
      try {
        
        // ← MỚI: Sử dụng dedicated session-token API
        let sessionTokenPayload: { membershipId?: string; guestName?: string } = {};
        
        // Nếu có membershipId thì dùng membershipId
        if (matchInfo?.createdByMembershipId) {
          sessionTokenPayload.membershipId = matchInfo.createdByMembershipId;
        } 
        // Nếu không có membershipId thì dùng guestName từ actorGuestToken
        else if (actorGuestToken) {
          // Tìm guestName từ teams data
          const currentTeams = matchInfo?.teams || [];
          const allMembers = currentTeams.flatMap((t: any) => t.members);
          const currentMember = allMembers.find((m: any) => 
            m.guestName && m.guestName.includes(actorGuestToken.slice(-6))
          );
          if (currentMember?.guestName) {
            sessionTokenPayload.guestName = currentMember.guestName;
          }
        }
        
        if (Object.keys(sessionTokenPayload).length > 0) {
          // Gọi API để lấy sessionToken mới nhất
          const sessionResponse = await userMatchService.getSessionToken(matchId, sessionTokenPayload);
          
          const responseData = sessionResponse as any;
          if (responseData.success && responseData.data?.sessionToken) {
            const newSessionToken = responseData.data.sessionToken;
            
            // So sánh token cũ vs mới
            if (newSessionToken !== sessionToken) {
              // Cập nhật token mới
              setSessionToken(newSessionToken);
              toast.success('Đã cập nhật phiên làm việc mới!');
            } else {
              toast.success('Phiên làm việc đã đồng bộ');
            }
          } else {
            toast.error('Không thể lấy phiên làm việc mới');
          }
        } else {
          toast.error('Không thể xác định người dùng để lấy phiên làm việc');
        }
        
      } catch (error) {
        toast.error('Không thể đồng bộ phiên làm việc');
      }
    } else {
      toast.error('Không có matchId để sync');
    }
  };



  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      {!loading && (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
          <HeaderUser showBack={false}>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">
                {(tableInfo?.name || 'BÀN').toUpperCase()} - {tableInfo?.category ? (tableInfo.category === 'pool-8' ? 'POOL 8' : ` ${tableInfo.category.toUpperCase()}`) : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-sm sm:text-base text-[#000000] font-medium">BẢNG ĐIỂM</p>
                {matchRole && (
                  <RoleBadge role={matchRole.role} size="sm" showIcon />
                )}
              </div>
            </div>

            <div className="bg-lime-400 text-white rounded-2xl px-8 py-8 space-y-2 shadow-md w-full">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-white mb-2">Mã Tham Gia</p>
                <div className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 mx-auto inline-block">
                  <div className="flex items-center justify-center gap-2 select-all">
                    {(matchCode || '000000').split('').map((ch, idx) => (
                      <span
                        key={idx}
                        className="w-5 sm:w-6 text-center font-mono tabular-nums font-extrabold text-xl sm:text-2xl text-white leading-none"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>



              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex flex-col items-center w-20 flex-shrink-0">
                  <p className="text-sm font-semibold">Đội A</p>
                  <div className="w-10 h-10 mt-1 flex items-center justify-center">
                    <Image
                      src="/images/numberBalls/ball_8.png"
                      alt="Team A Ball"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="min-h-[60px] mt-1 text-center space-y-1">
                    {teamA.length > 0 ? (
                      teamA.map((member, index) => (
                        <p key={index} className="text-xs">{member || `Người Chơi ${index + 1}`}</p>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Chưa có thành viên</p>
                    )}
                  </div>
                </div>

                <div className="text-center flex flex-col items-center mt-10 flex-shrink-0">
                  <div className="min-h-[40px] flex items-center justify-center">
                    <div className="text-3xl font-bold">{updating ? '...' : `${scoreA} : ${scoreB}`}</div>
                  </div>
                  <div className="min-h-[30px] flex items-center justify-center mt-2">
                    {matchStartTime ? (
                      <div className="text-[#FFFFFF] font-bold text-[#8ADB10]">{elapsedTime}</div>
                    ) : (
                      <div className="text-[#FFFFFF] font-bold text-[#8ADB10]">Đang tải...</div>
                    )}
                  </div>
                </div>

                <div className="text-center flex flex-col items-center w-20 flex-shrink-0">
                  <p className="text-sm font-semibold">Đội B</p>
                  <div className="w-10 h-10 mt-1 flex items-center justify-center">
                    <Image
                      src="/images/numberBalls/ball_8.png"
                      alt="Team B Ball"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="min-h-[60px] mt-1 text-center space-y-1">
                    {teamB.length > 0 ? (
                      teamB.map((member, index) => (
                        <p key={index} className="text-xs">{member || `Người Chơi ${index + 1}`}</p>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Chưa có thành viên</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

                          <div className="text-left w-full space-y-4">
                {/* SessionToken Synchronization Component */}
                <SessionTokenSync
                  matchId={matchId}
                  currentSessionToken={sessionToken}
                  onTokenUpdate={setSessionToken}
                  matchInfo={matchInfo}
                  actorGuestToken={actorGuestToken}
                />
                
                {matchInfo?.isAiAssisted && (
                  <>
                    <p className="text-sm font-semibold text-[#000000] mb-1">Kết Quả AI</p>
                    <div className="border border-gray-300 rounded-md p-3 text-sm text-[#000000] bg-white shadow-sm space-y-1">
                      {(aiResults.length > 0 ? aiResults : exampleResults).map((item: string, index: number) => (
                        <p key={index}>[AI]: {item}</p>
                      ))}
                    </div>
                  </>
                )}

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#000000] mb-2">Thao tác nhanh</p>
                <PermissionGuard 
                  canAccess={canEdit}
                  requiredRole="host"
                  currentRole={matchRole?.role}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        console.log('🔘 Scoreboard: +1 Team A button clicked');
                        if (!validatePermissions()) return;

                        const newScore = scoreA + 1;
                        console.log('🔘 Scoreboard: Updating Team A score', { currentScore: scoreA, newScore });
                        setScoreA(newScore);
                        try {
                          console.log('🔘 Scoreboard: Calling updateScore for Team A', { matchId, teamIndex: 0, score: newScore, actorGuestToken, sessionToken });
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 0,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                            sessionToken: sessionToken,
                          });

                          console.log('🔘 Scoreboard: Team A score updated successfully, emitting socket event');
                          socketService.emitScoreUpdate(matchId, 0, newScore);
                        } catch (error) {
                          console.log('❌ Scoreboard: Team A score update failed', { error });
                          
                          // Auto-retry với token mới nếu SessionToken invalid
                          if ((error as Error).message?.includes('SessionToken không hợp lệ')) {
                            console.log('🔄 Scoreboard: Auto-retrying Team A score update...');
                            try {
                              await syncSessionTokenWithBackend();
                              // Retry với token mới
                              await userMatchService.updateScore(matchId, {
                                teamIndex: 0,
                                score: newScore,
                                actorGuestToken: actorGuestToken || undefined,
                                actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                                sessionToken: sessionToken, // sessionToken đã được cập nhật
                              });
                              console.log('✅ Scoreboard: Team A score update retry successful');
                              socketService.emitScoreUpdate(matchId, 0, newScore);
                              return; // Thành công, không cần rollback
                            } catch (retryError) {
                              console.log('❌ Scoreboard: Team A score update retry failed', { retryError });
                            }
                          }
                          
                          toast.error('Cập nhật điểm Team A thất bại');
                          setScoreA(scoreA);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      +1 Team A
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        console.log('🔘 Scoreboard: +1 Team B button clicked');
                        if (!validatePermissions()) return;

                        const newScore = scoreB + 1;
                        console.log('🔘 Scoreboard: Updating Team B score', { currentScore: scoreB, newScore });
                        setScoreB(newScore);
                        try {
                          console.log('🔘 Scoreboard: Calling updateScore for Team B', { matchId, teamIndex: 1, score: newScore, actorGuestToken, sessionToken });
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 1,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                            sessionToken: sessionToken,
                          });
                          console.log('🔘 Scoreboard: Team B score updated successfully, emitting socket event');
                          socketService.emitScoreUpdate(matchId, 1, newScore);
                        } catch (error) {
                          console.log('❌ Scoreboard: Team B score update failed', { error });
                          toast.error('Cập nhật điểm Team B thất bại');
                          setScoreB(scoreB);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      +1 Team B
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        console.log('🔘 Scoreboard: -1 Team A button clicked');
                        if (!validatePermissions()) return;

                        const newScore = Math.max(0, scoreA - 1);
                        console.log('🔘 Scoreboard: Updating Team A score', { currentScore: scoreA, newScore });
                        setScoreA(newScore);
                        try {
                          console.log('🔘 Scoreboard: Calling updateScore for Team A', { matchId, teamIndex: 0, score: newScore, actorGuestToken, sessionToken });
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 0,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                            sessionToken: sessionToken,
                          });

                          console.log('🔘 Scoreboard: Team A score updated successfully, emitting socket event');
                          socketService.emitScoreUpdate(matchId, 0, newScore);
                        } catch (error) {
                          console.log('❌ Scoreboard: Team A score update failed', { error });
                          toast.error('Cập nhật điểm Team A thất bại');
                          setScoreA(scoreA);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      -1 Team A
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        console.log('🔘 Scoreboard: -1 Team B button clicked');
                        if (!validatePermissions()) return;

                        const newScore = Math.max(0, scoreB - 1);
                        console.log('🔘 Scoreboard: Updating Team B score', { currentScore: scoreB, newScore });
                        setScoreB(newScore);
                        try {
                          console.log('🔘 Scoreboard: Calling updateScore for Team B', { matchId, teamIndex: 1, score: newScore, actorGuestToken, sessionToken });
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 1,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                            sessionToken: sessionToken,
                          });

                          console.log('🔘 Scoreboard: Team B score updated successfully, emitting socket event');
                          socketService.emitScoreUpdate(matchId, 1, newScore);
                        } catch (error) {
                          console.log('❌ Scoreboard: Team B score update failed', { error });
                          toast.error('Cập nhật điểm Team B thất bại');
                          setScoreB(scoreB);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      -1 Team B
                    </Button>
                  </div>
                </PermissionGuard>
              </div>
            </div>
          </HeaderUser>

          {/* Debug info for developers */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-xs text-yellow-800 max-w-xs z-50">
              <div className="font-semibold mb-1">🔧 Debug Info:</div>
              <div>• Check debug bar above for auth status</div>
              <div>• Click "🧪 Test API" to test connection</div>
              <div>• Click "🔄 Sync Token" to force sync</div>
              <div>• Green ✅ = Valid, Red ❌ = Invalid</div>
              <div>• Only host can edit scores/members</div>
              <div>• Auto-retry enabled for token mismatch</div>
            </div>
          )}

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
            <div className="flex flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
              <PermissionGuard 
                canAccess={canEdit}
                requiredRole="host"
                currentRole={matchRole?.role}
              >
                <Button
                  onClick={handleEditScore}
                  style={{ backgroundColor: '#8ADB10' }}
                  className="w-1/2 hover:bg-red-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
                >
                  Chỉnh sửa
                </Button>
              </PermissionGuard>
              
              <PermissionGuard 
                canAccess={canEdit}
                requiredRole="host"
                currentRole={matchRole?.role}
              >
                <Button
                  onClick={handleEndMatch}
                  style={{ backgroundColor: '#FF0000' }}
                  className="w-1/2 hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
                >
                  Kết thúc
                </Button>
              </PermissionGuard>
            </div>
          </div>

          {showEditPopup && (
            <ScoreEditor
              onClose={() => setShowEditPopup(false)}
              onSave={async (newScoreA, newScoreB) => {
                setScoreA(newScoreA);
                setScoreB(newScoreB);
                try {
                  await persistScores(newScoreA, newScoreB);
                } catch {
                  toast.error('Cập nhật điểm thất bại');
                }
                setShowEditPopup(false);
              }}
              initialScoreA={scoreA}
              initialScoreB={scoreB}
              canEdit={canEdit}
              userRole={matchRole?.role}
            />
          )}

          {showEditChoicePopup && (
            <EditOption
              onClose={() => setShowEditChoicePopup(false)}
              onEditScore={() => {
                console.log('🔘 Scoreboard: EditOption - Edit score clicked');
                if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                  console.log('❌ Scoreboard: EditOption - No permissions for edit score');
                  toast.error('Bạn không có quyền chỉnh sửa');
                  setShowEditChoicePopup(false);
                  return;
                }
                console.log('✅ Scoreboard: EditOption - Opening score editor');
                setShowEditChoicePopup(false);
                setShowEditPopup(true);
              }}
              onEditMembers={() => {
                console.log('🔘 Scoreboard: EditOption - Edit members clicked');
                if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                  console.log('❌ Scoreboard: EditOption - No permissions for edit members');
                  toast.error('Bạn không có quyền chỉnh sửa');
                  setShowEditChoicePopup(false);
                  return;
                }
                if (!tableInfo?.clubId) {
                  console.log('❌ Scoreboard: EditOption - No clubId for edit members');
                  toast.error('Không thể xác định club để chỉnh sửa thành viên');
                  return;
                }
                console.log('✅ Scoreboard: EditOption - Opening team members editor');
                setShowEditChoicePopup(false);
                setShowEditMembersPopup(true);
              }}
            />
          )}

          {showEditMembersPopup && (
            <TeamMembers
              onClose={() => setShowEditMembersPopup(false)}
              onSave={async (newTeamA, newTeamB) => {
                console.log('🔘 Scoreboard: TeamMembers - Save clicked', { newTeamA, newTeamB });
                setTeamA(newTeamA);
                setTeamB(newTeamB);
                setShowEditMembersPopup(false);

                if (matchId && matchId.trim() !== '') {
                  try {
                    console.log('🔘 Scoreboard: TeamMembers - Re-fetching match info', { matchId });
                    const updatedMatchInfo = await userMatchService.getMatchById(matchId);
                    console.log('🔘 Scoreboard: TeamMembers - Updated match info received', { updatedMatchInfo });
                    const responseData = (updatedMatchInfo as { data?: { teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }> } })?.data || updatedMatchInfo;
                    const matchInfoData = responseData as { teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }> };
                    setMatchInfo(matchInfoData);

                    if (matchInfoData?.teams) {
                      const teamAMembers = matchInfoData.teams[0]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
                        member.guestName || member.membershipName || member.fullName || ''
                      ) || [''];
                      const teamBMembers = matchInfoData.teams[1]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
                        member.guestName || member.membershipName || member.fullName || ''
                      ) || [''];

                      console.log('🔘 Scoreboard: TeamMembers - Updated team members', { teamAMembers, teamBMembers });
                      setTeamA(teamAMembers);
                      setTeamB(teamBMembers);
                    }
                  } catch (error) {
                    console.log('❌ Scoreboard: TeamMembers - Error re-fetching match info', { error });
                    console.error('Error re-fetching match info');
                  }
                }
              }}
              initialTeamA={teamA}
              initialTeamB={teamB}
              matchId={matchId}
              actorGuestToken={actorGuestToken}
              actorMembershipId={matchInfo?.createdByMembershipId || null}
              clubId={tableInfo?.clubId || null}
              sessionToken={sessionToken || ''}
            />
          )}

          {showEndPopup && (
            <MatchEnd
              onClose={() => setShowEndPopup(false)}
              onConfirm={async () => {
                console.log('🔘 Scoreboard: MatchEnd - Confirm clicked');
                if (!matchId || matchId.trim() === '') {
                  console.log('❌ Scoreboard: MatchEnd - No matchId');
                  toast.error('Không tìm thấy thông tin trận đấu');
                  setShowEndPopup(false);
                  return;
                }

                if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                  console.log('❌ Scoreboard: MatchEnd - No user authentication');
                  toast.error('Không thể xác thực người dùng để kết thúc trận đấu');
                  setShowEndPopup(false);
                  return;
                }

                try {
                  console.log('🔘 Scoreboard: MatchEnd - Creating end match payload', { actorGuestToken, createdByMembershipId: matchInfo?.createdByMembershipId, sessionToken });
                  const endMatchPayload: { actorGuestToken?: string; actorMembershipId?: string; sessionToken: string } = { sessionToken: sessionToken || '' };

                  if (actorGuestToken) {
                    endMatchPayload.actorGuestToken = actorGuestToken;
                  } else if (matchInfo?.createdByMembershipId) {
                    endMatchPayload.actorMembershipId = matchInfo.createdByMembershipId;
                  }

                  console.log('🔘 Scoreboard: MatchEnd - Calling endMatch', { matchId, endMatchPayload });
                  await userMatchService.endMatch(matchId, endMatchPayload);

                  if (socketService.isSocketConnected()) {
                    socketService.emitMatchEnd(matchId, {
                      matchId,
                      tableName: tableInfo?.name || undefined,
                      matchCode: matchCode || undefined,
                      scoreA,
                      scoreB,
                      teamA,
                      teamB,
                      tableId: tableId || undefined,
                      endTime: new Date().toISOString()
                    });
                  }

                  const params = new URLSearchParams();

                  if (matchId && matchId.trim() !== '') params.set('matchId', matchId);
                  if (matchCode) params.set('matchCode', matchCode);
                  if (scoreA !== undefined) params.set('scoreA', scoreA.toString());
                  if (scoreB !== undefined) params.set('scoreB', scoreB.toString());
                  if (teamA.length > 0) params.set('teamA', teamA.join(','));
                  if (teamB.length > 0) params.set('teamB', teamB.join(','));
                  if (tableId) params.set('tableId', tableId);

                  const targetUrl = `/user/match/end?${params.toString()}`;

                  setShowEndPopup(false);

                  if (router && typeof router.push === 'function') {
                    try {
                      router.push(targetUrl);

                      setTimeout(() => {
                        if (window.location.pathname !== '/user/match/end') {
                          window.location.href = targetUrl;
                        }
                      }, 500);

                    } catch {
                      window.location.href = targetUrl;
                    }
                  } else {
                    window.location.href = targetUrl;
                  }

                } catch (e) {
                  let errorMessage = 'Kết thúc trận đấu thất bại';

                  const error = e as { message?: string };
                  if (error.message?.includes('actor identifier')) {
                    errorMessage = 'Không thể xác thực người dùng để kết thúc trận đấu';
                  } else if (error.message?.includes('not found')) {
                    errorMessage = 'Không tìm thấy trận đấu';
                  } else if (error.message?.includes('unauthorized')) {
                    errorMessage = 'Bạn không có quyền kết thúc trận đấu này';
                  } else if (error.message) {
                    errorMessage += ': ' + error.message;
                  }

                  toast.error(errorMessage);

                  setShowEndPopup(false);
                }
              }}
            />
          )}
        </div>
      )}
    </>
  );
}

export default function ScoreboardPageWrapper() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải..." />}>
      <ScoreboardPage />
    </Suspense>
  );
}


