'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PopupEditScore from '@/app/user/popup/popupEditScore';
import PopupEndMatch from '@/app/user/popup/popupEndMatch';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import socketService from '@/lib/socketService';


export default function ScoreboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [matchId, setMatchId] = useState<string | null>(null);
  const [matchCode, setMatchCode] = useState<string | null>(null);
  const [actorGuestToken, setActorGuestToken] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);

  const [aiResults, setAiResults] = useState<string[]>([]);
  const [matchStartTime, setMatchStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

  // WebSocket hook
  const { isConnected } = useWebSocket({
    matchId,
    matchStatus: matchInfo?.status || 'pending',
    onTimeUpdate: (elapsedTime: string) => {
      setElapsedTime(elapsedTime);
    },
    onMatchUpdate: (updatedMatch: any) => {
      // Cập nhật điểm số realtime từ WebSocket
      const matchData = updatedMatch as any;
      if (matchData?.teams) {
        const newScoreA = matchData.teams[0]?.score ?? scoreA;
        const newScoreB = matchData.teams[1]?.score ?? scoreB;
        
        if (newScoreA !== scoreA) {
          setScoreA(newScoreA);
        }
        if (newScoreB !== scoreB) {
          setScoreB(newScoreB);
        }
      }
    }
  });

  const exampleResults = [
    'Team A - Bi số 5 vào đúng lỗ giữa.',
    'Team B - Lỗi, đánh bi trắng vào lỗ.',
    'Không xác định được tình huống – vui lòng kiểm tra lại video.',
  ];

  useEffect(() => {
    const mId = searchParams?.get('matchId');
    const code = searchParams?.get('room');
    const guestToken = searchParams?.get('guestToken');
    const tId = searchParams?.get('tableId');
    
    if (mId) setMatchId(mId);
    if (code) setMatchCode(code);
    if (guestToken) setActorGuestToken(guestToken);
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
          const responseData = (matchData as any)?.data || matchData;
          
          setMatchInfo(responseData);
          
          const sA = responseData?.teams?.[0]?.score ?? 0;
          const sB = responseData?.teams?.[1]?.score ?? 0;
          setScoreA(sA);
          setScoreB(sB);
          
          const teamAMembers = responseData?.teams?.[0]?.members?.map((member: any) => 
            member.guestName || member.membershipName || member.fullName || 'Unknown'
          ) || [];
          const teamBMembers = responseData?.teams?.[1]?.members?.map((member: any) => 
            member.guestName || member.membershipName || member.fullName || 'Unknown'
          ) || [];
          
          setTeamA(teamAMembers);
          setTeamB(teamBMembers);
          
          if (!tId && responseData?.tableId) {
            setTableId(responseData.tableId);
          }
          
          if (responseData?.startTime) {
            setMatchStartTime(new Date(responseData.startTime));
          }
        } else if (code) {
          const matchData = await userMatchService.getMatchByCode(code);
          const responseData = (matchData as any)?.data || matchData;
          const id = responseData?.matchId || responseData?.id;
          if (id) setMatchId(id);
          
          const sA = responseData?.teams?.[0]?.score ?? 0;
          const sB = responseData?.teams?.[1]?.score ?? 0;
          setScoreA(sA);
          setScoreB(sB);
        }
      } catch (e) {
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
  }, []);

  useEffect(() => {
    const verifyTableInfo = async () => {
      if (tableId || matchInfo?.tableId) {
        const currentTableId = tableId || matchInfo?.tableId;
        try {
          const tableData = await userMatchService.verifyTable({ tableId: currentTableId });
          const tableResponseData = (tableData as any)?.data || tableData;
          setTableInfo(tableResponseData);
        } catch (tableError) {
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

  const handleEditScore = () => setShowEditPopup(true);
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
    } catch (e) {
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
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                {tableInfo?.name || 'Bàn'} - {tableInfo?.category ? tableInfo.category.toUpperCase() : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
              </h1>
              <p className="text-sm sm:text-base text-black font-medium">BẢNG ĐIỂM</p>
            </div>

            <div className="bg-lime-400 text-white rounded-2xl px-8 py-8 space-y-2 shadow-md w-full">
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex flex-col items-center w-20">
                  <p className="text-sm font-semibold">Team A</p>
                  <div className="w-10 h-10 bg-gray-200 rounded-full mt-1" />
                  {teamA.length > 0 && (
                    <div className="text-xs mt-1 text-center space-y-1">
                      {teamA.map((member, index) => (
                        <p key={index} className="text-xs">{member}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-center flex flex-col items-center mt-10">
                  <div className="text-3xl font-bold">{updating ? '...' : `${scoreA} : ${scoreB}`}</div>
                  <div className="text-lg font-semibold mt-2">
                    {matchStartTime ? (
                      <div className="text-base font-bold text-lime-600">{elapsedTime}</div>
                    ) : 'Đang tải...'}
                  </div>
                </div>

                <div className="text-center flex flex-col items-center w-20">
                  <p className="text-sm font-semibold">Team B</p>
                  <div className="w-10 h-10 bg-gray-200 rounded-full mt-1" />
                  {teamB.length > 0 && (
                    <div className="text-xs mt-1 text-center space-y-1">
                      {teamB.map((member, index) => (
                        <p key={index} className="text-xs">{member}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left w-full space-y-2">
              {matchInfo?.isAiAssisted ? (
                <>
                  <p className="text-sm font-semibold text-black mb-1">Kết Quả AI</p>
                  <div className="border border-gray-300 rounded-md p-3 text-sm text-black bg-white shadow-sm space-y-1">
                    {(aiResults.length > 0 ? aiResults : exampleResults).map((item, index) => (
                      <p key={index}>[AI]: {item}</p>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-black mb-2">Thao tác nhanh</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={async () => {
                        if (!matchId) {
                          toast.error('Không tìm thấy thông tin trận đấu');
                          return;
                        }
                        
                        // Kiểm tra có actor identifier không
                        if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
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
                          
                          // Emit WebSocket event để cập nhật realtime
                          socketService.emitScoreUpdate(matchId, 0, newScore);
                        } catch (error) {
                          toast.error('Cập nhật điểm Team A thất bại');
                          setScoreA(scoreA); // Revert score
                        }
                      }}
                      className="text-black"
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
                        
                        // Kiểm tra có actor identifier không
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
                        } catch (error) {
                          toast.error('Cập nhật điểm Team B thất bại');
                          setScoreB(scoreB); // Revert score
                        }
                      }}
                      className="text-black"
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
                        
                        // Kiểm tra có actor identifier không
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
                          
                          // Emit WebSocket event để cập nhật realtime
                          socketService.emitScoreUpdate(matchId, 0, newScore);
                        } catch (error) {
                          toast.error('Cập nhật điểm Team A thất bại');
                          setScoreA(scoreA); // Revert score
                        }
                      }}
                      className="text-black"
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
                        
                        // Kiểm tra có actor identifier không
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
                          
                          // Emit WebSocket event để cập nhật realtime
                          socketService.emitScoreUpdate(matchId, 1, newScore);
                        } catch (error) {
                          toast.error('Cập nhật điểm Team B thất bại');
                          setScoreB(scoreB); // Revert score
                        }
                      }}
                      className="text-black"
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
                className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
              >
                Chỉnh sửa
              </Button>
              <Button
                onClick={handleEndMatch}
                className="w-1/2 bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
              >
                Kết thúc
              </Button>
            </div>
          </div>

          {showEditPopup && (
            <PopupEditScore
              onClose={() => setShowEditPopup(false)}
              onSave={(newScoreA, newScoreB, note) => {
                setScoreA(newScoreA);
                setScoreB(newScoreB);
                void persistScores(newScoreA, newScoreB);
                setShowEditPopup(false);
              }}
            />
          )}

          {showEndPopup && (
            <PopupEndMatch
              onClose={() => setShowEndPopup(false)}
              onConfirm={() => {
                const end = async () => {
                  if (matchId) {
                    try {
                      await userMatchService.endMatch(matchId, {
                        actorGuestToken: actorGuestToken || undefined,
                      });
                    } catch (e) {
                      toast.error('Kết thúc trận đấu thất bại');
                    }
                  }
                  setShowEndPopup(false);
                  router.push('/user/endmatch');
                };
                void end();
              }}
            />
          )}
        </div>
      )}
    </>
  );
}


