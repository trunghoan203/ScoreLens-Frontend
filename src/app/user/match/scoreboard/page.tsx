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


function ScoreboardPage() {
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

  const [matchId, setMatchId] = useState<string | null>(null);
  const [matchCode, setMatchCode] = useState<string | null>(null);
  const [actorGuestToken, setActorGuestToken] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);

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
    if (matchId && isConnected) {
      socketService.joinMatchRoom(matchId);
    }
  }, [matchId, isConnected]);

  useEffect(() => {
    if (matchId && socketService.isSocketConnected()) {
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

    if (mId) setMatchId(mId);
    if (code) setMatchCode(code);
    if (creatorGuestToken) {
      setActorGuestToken(creatorGuestToken);
    } else if (guestToken) {
      setActorGuestToken(guestToken);
    }
    if (tId) setTableId(tId);

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
          const matchData = await userMatchService.getMatchByCode(code);
          const responseData = (matchData as { data?: { matchId?: string; id?: string; teams?: Array<{ score?: number }> } })?.data || matchData;
          const matchInfoData = responseData as { matchId?: string; id?: string; teams?: Array<{ score?: number }> };
          const id = matchInfoData?.matchId || matchInfoData?.id;
          if (id) setMatchId(id);

          const sA = matchInfoData?.teams?.[0]?.score ?? 0;
          const sB = matchInfoData?.teams?.[1]?.score ?? 0;
          setScoreA(sA);
          setScoreB(sB);
        }
      } catch {
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
  }, [tableId, matchInfo]);

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

  const handleEditScore = () => setShowEditChoicePopup(true);
  const handleEndMatch = () => setShowEndPopup(true);

  const persistScores = async (newA: number, newB: number) => {
    if (!matchId) return;
    setUpdating(true);
    try {
      await userMatchService.updateScore(matchId, {
        teamIndex: 0,
        score: newA,
        actorGuestToken: actorGuestToken || undefined,
      });
      await userMatchService.updateScore(matchId, {
        teamIndex: 1,
        score: newB,
        actorGuestToken: actorGuestToken || undefined,
      });
    } catch {
      toast.error('Cập nhật điểm thất bại.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      {!loading && (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
          <HeaderUser>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">
                {tableInfo?.name || 'Bàn'} - {tableInfo?.category ? tableInfo.category.toUpperCase() : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
              </h1>
              <p className="text-sm sm:text-base text-[#000000] font-medium">BẢNG ĐIỂM</p>
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
                <div className="text-center flex flex-col items-center w-20">
                  <p className="text-sm font-semibold">Team A</p>
                  <div className="w-10 h-10 bg-gray-200 rounded-full mt-1" />
                  {teamA.length > 0 && (
                    <div className="text-xs mt-1 text-center space-y-1">
                      {teamA.map((member, index) => (
                        <p key={index} className="text-xs">{member || `Người Chơi ${index + 1}`}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-center flex flex-col items-center mt-10">
                  <div className="text-3xl font-bold">{updating ? '...' : `${scoreA} : ${scoreB}`}</div>
                  <div className="text-lg font-semibold mt-2">
                    {matchStartTime ? (
                      <div className="text-[#FFFFFF] font-bold text-[#8ADB10]">{elapsedTime}</div>
                    ) : 'Đang tải...'}
                  </div>
                </div>

                <div className="text-center flex flex-col items-center w-20">
                  <p className="text-sm font-semibold">Team B</p>
                  <div className="w-10 h-10 bg-gray-200 rounded-full mt-1" />
                  {teamB.length > 0 && (
                    <div className="text-xs mt-1 text-center space-y-1">
                      {teamB.map((member, index) => (
                        <p key={index} className="text-xs">{member || `Người Chơi ${index + 1}`}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left w-full space-y-2">
              {matchInfo?.isAiAssisted ? (
                <>
                  <p className="text-sm font-semibold text-[#000000] mb-1">Kết Quả AI</p>
                  <div className="border border-gray-300 rounded-md p-3 text-sm text-[#000000] bg-white shadow-sm space-y-1">
                    {(aiResults.length > 0 ? aiResults : exampleResults).map((item: string, index: number) => (
                      <p key={index}>[AI]: {item}</p>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[#000000] mb-2">Thao tác nhanh</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!matchId) {
                          toast.error('Không tìm thấy thông tin trận đấu');
                          return;
                        }

                        if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                          console.log('Debug - Quyền chỉnh sửa điểm:', {
                            actorGuestToken,
                            createdByMembershipId: matchInfo?.createdByMembershipId,
                            matchInfo: matchInfo
                          });
                          toast.error('Không có quyền chỉnh sửa điểm');
                          return;
                        }

                        const newScore = scoreA + 1;
                        setScoreA(newScore);
                        try {
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 0,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                          });

                          socketService.emitScoreUpdate(matchId, 0, newScore);
                        } catch {
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
                        if (!matchId) {
                          toast.error('Không tìm thấy thông tin trận đấu');
                          return;
                        }

                        if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                          toast.error('Không có quyền chỉnh sửa điểm');
                          return;
                        }

                        const newScore = scoreB + 1;
                        setScoreB(newScore);
                        try {
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 1,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                          });
                          socketService.emitScoreUpdate(matchId, 1, newScore);
                        } catch {
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
                        if (!matchId) {
                          toast.error('Không tìm thấy thông tin trận đấu');
                          return;
                        }

                        if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                          toast.error('Không có quyền chỉnh sửa điểm');
                          return;
                        }

                        const newScore = Math.max(0, scoreA - 1);
                        setScoreA(newScore);
                        try {
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 0,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                          });

                          socketService.emitScoreUpdate(matchId, 0, newScore);
                        } catch {
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
                        if (!matchId) {
                          toast.error('Không tìm thấy thông tin trận đấu');
                          return;
                        }

                        if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                          toast.error('Không có quyền chỉnh sửa điểm');
                          return;
                        }

                        const newScore = Math.max(0, scoreB - 1);
                        setScoreB(newScore);
                        try {
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 1,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                          });

                          socketService.emitScoreUpdate(matchId, 1, newScore);
                        } catch {
                          toast.error('Cập nhật điểm Team B thất bại');
                          setScoreB(scoreB);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      -1 Team B
                    </Button>
                  </div>
                </>
              )}
            </div>
          </HeaderUser>

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
            <div className="flex flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
              <Button
                onClick={handleEditScore}
                style={{ backgroundColor: '#8ADB10' }}
                className="w-1/2 hover:bg-red-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
              >
                Chỉnh sửa
              </Button>
              <Button
                onClick={handleEndMatch}
                style={{ backgroundColor: '#FF0000' }}
                className="w-1/2 hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
              >
                Kết thúc
              </Button>
            </div>
          </div>

          {showEditPopup && (
            <ScoreEditor
              onClose={() => setShowEditPopup(false)}
              onSave={(newScoreA, newScoreB) => {
                setScoreA(newScoreA);
                setScoreB(newScoreB);
                void persistScores(newScoreA, newScoreB);
                setShowEditPopup(false);
              }}
            />
          )}

          {showEditChoicePopup && (
            <EditOption
              onClose={() => setShowEditChoicePopup(false)}
              onEditScore={() => {
                setShowEditChoicePopup(false);
                setShowEditPopup(true);
              }}
              onEditMembers={() => {
                if (!tableInfo?.clubId) {
                  toast.error('Không thể xác định club để chỉnh sửa thành viên');
                  return;
                }
                setShowEditChoicePopup(false);
                setShowEditMembersPopup(true);
              }}
            />
          )}

          {showEditMembersPopup && (
            <TeamMembers
              onClose={() => setShowEditMembersPopup(false)}
              onSave={async (newTeamA, newTeamB) => {
                setTeamA(newTeamA);
                setTeamB(newTeamB);
                setShowEditMembersPopup(false);

                if (matchId) {
                  try {
                    const updatedMatchInfo = await userMatchService.getMatchById(matchId);
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

                      setTeamA(teamAMembers);
                      setTeamB(teamBMembers);
                    }
                  } catch (error) {
                    console.error('Error re-fetching match info:', error);
                  }
                }
              }}
              initialTeamA={teamA}
              initialTeamB={teamB}
              matchId={matchId}
              actorGuestToken={actorGuestToken}
              actorMembershipId={matchInfo?.createdByMembershipId || null}
              clubId={tableInfo?.clubId || null}
            />
          )}

          {showEndPopup && (
            <MatchEnd
              onClose={() => setShowEndPopup(false)}
              onConfirm={async () => {
                if (!matchId) {
                  toast.error('Không tìm thấy thông tin trận đấu');
                  setShowEndPopup(false);
                  return;
                }

                if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                  toast.error('Không thể xác thực người dùng để kết thúc trận đấu');
                  setShowEndPopup(false);
                  return;
                }

                try {
                  const endMatchPayload: { actorGuestToken?: string; actorMembershipId?: string } = {};

                  if (actorGuestToken) {
                    endMatchPayload.actorGuestToken = actorGuestToken;
                  } else if (matchInfo?.createdByMembershipId) {
                    endMatchPayload.actorMembershipId = matchInfo.createdByMembershipId;
                  }

                  await userMatchService.endMatch(matchId, endMatchPayload);

                  toast.success('Trận đấu đã kết thúc thành công!');

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

                  if (!matchId) {
                    toast.error('Thiếu thông tin trận đấu');
                    return;
                  }

                  const params = new URLSearchParams();

                  if (matchId) params.set('matchId', matchId);
                  if (tableInfo?.name) params.set('tableName', tableInfo.name);
                  if (matchCode) params.set('matchCode', matchCode);
                  if (scoreA !== undefined) params.set('scoreA', scoreA.toString());
                  if (scoreB !== undefined) params.set('scoreB', scoreB.toString());
                  if (teamA.length > 0) params.set('teamA', teamA.join(','));
                  if (teamB.length > 0) params.set('teamB', teamB.join(','));
                  if (tableId) params.set('tableId', tableId);

                  const targetUrl = `/user/match/end?${params.toString()}`;

                  setShowEndPopup(false);

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


