'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import { userMatchService } from '@/lib/userMatchService';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { config } from '@/lib/config';

function GuestJoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableNumber = searchParams!.get('table') || '??';
  const tableId = searchParams!.get('tableId') || '';
  const existingCode = searchParams!.get('code') || '';
  const existingMatchId = searchParams!.get('matchId') || '';
  const guestName = searchParams!.get('name') || searchParams!.get('guestName') || '';
  const membershipId = searchParams!.get('membershipId') || '';
  const membershipName = searchParams!.get('membershipName') || '';

  const [roomCode, setRoomCode] = useState(existingCode);
  const [loading, setLoading] = useState(true);
  const [matchId, setMatchId] = useState(existingMatchId);
  const [tableInfo, setTableInfo] = useState<{
    name?: string;
    category?: string;
    clubId?: string;
  } | null>(null);

  const [teamA, setTeamA] = useState(['']);
  const [teamB, setTeamB] = useState(['']);

  const [connectedGuests, setConnectedGuests] = useState<Array<{ id: string, name: string, team: 'A' | 'B', joinedAt: Date }>>([]);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const handleChange = (team: 'A' | 'B', index: number, value: string) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  useEffect(() => {
    if (!matchId) return;

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;
    let isConnecting = false;

    const connectSocket = () => {
      if (isConnecting || socketRef.current?.connected) return;

      isConnecting = true;
      const socketUrl = config.socketUrl;

      try {
        const socket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          isConnecting = false;
          setIsWebSocketConnected(true);
          socket.emit('join_match_room', matchId);
        });

        socket.on('disconnect', () => {
          isConnecting = false;
          setIsWebSocketConnected(false);

          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(connectSocket, retryDelay);
          }
        });

        socket.on('connect_error', () => {
          isConnecting = false;
          setIsWebSocketConnected(false);

          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(connectSocket, retryDelay);
          }
        });

        socket.on('guest_joined', () => {
          toast.success('Người chơi mới đã tham gia phòng!');
        });

        socket.on('guest_left', () => {
          toast('Người chơi đã rời khỏi phòng');
        });

        socket.on('match_updated', (data) => {
          if (data.status === 'ongoing') {
            const redirectUrl = `/user/match/scoreboard?table=${tableNumber}&room=${roomCode}&matchId=${matchId}&tableId=${tableId}`;
            router.push(redirectUrl);
            return;
          }

          if (data.teams && Array.isArray(data.teams)) {
            const guests: Array<{ id: string, name: string, team: 'A' | 'B', joinedAt: Date }> = [];

            if (data.teams[0]?.members && Array.isArray(data.teams[0].members)) {
              const teamAMembers: string[] = [];
              data.teams[0].members.forEach((member: { guestName?: string; membershipName?: string; fullName?: string; name?: string; userName?: string; displayName?: string }, index: number) => {
                const memberName =
                  member.guestName ||
                  member.membershipName ||
                  member.fullName ||
                  member.name ||
                  member.userName ||
                  member.displayName ||
                  '';

                if (memberName) {
                  teamAMembers.push(memberName);
                  guests.push({
                    id: `teamA-${index}`,
                    name: memberName,
                    team: 'A' as const,
                    joinedAt: new Date()
                  });
                }
              });

              setTeamA(teamAMembers);
            }

            if (data.teams[1]?.members && Array.isArray(data.teams[1].members)) {
              const teamBMembers: string[] = [];
              data.teams[1].members.forEach((member: { guestName?: string; membershipName?: string; fullName?: string; name?: string; userName?: string; displayName?: string }, index: number) => {
                const memberName =
                  member.guestName ||
                  member.membershipName ||
                  member.fullName ||
                  member.name ||
                  member.userName ||
                  member.displayName ||
                  '';

                if (memberName) {
                  teamBMembers.push(memberName);
                  guests.push({
                    id: `teamB-${index}`,
                    name: memberName,
                    team: 'B' as const,
                    joinedAt: new Date()
                  });
                }
              });

              setTeamB(teamBMembers);
            }

            setConnectedGuests(guests);

            const currentTotalMembers = (data.teams[0]?.members?.length || 0) + (data.teams[1]?.members?.length || 0);
            if (currentTotalMembers > (connectedGuests?.length || 0)) {
              toast.success('Có người chơi mới tham gia phòng!');
            }
          }
        });

        socket.on('match_deleted', () => {
          toast('Trận đấu đã bị hủy');
        });

        socket.on('match_ended', (data) => {
          toast.success('Trận đấu đã kết thúc!');

          const params = new URLSearchParams();
          if (data.matchId) params.set('matchId', data.matchId);
          if (data.tableName) params.set('tableName', data.tableName);
          if (data.matchCode) params.set('matchCode', data.matchCode);
          if (data.scoreA !== undefined) params.set('scoreA', data.scoreA.toString());
          if (data.scoreB !== undefined) params.set('scoreB', data.scoreB.toString());
          if (data.teamA) params.set('teamA', data.teamA.join(','));
          if (data.teamB) params.set('teamB', data.teamB.join(','));
          if (data.tableId) params.set('tableId', data.tableId);

          router.push(`/user/match/end?${params.toString()}`);
        });

        socket.on('error', () => {
          setIsWebSocketConnected(false);
        });

      } catch {
        isConnecting = false;
        setIsWebSocketConnected(false);
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [matchId, tableNumber, roomCode, tableId, connectedGuests?.length, router]);

  useEffect(() => {
    if (!matchId) return;

    const fetchConnectedGuests = async () => {
      try {
        const matchData = await userMatchService.getMatchById(matchId) as { data?: { teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string; name?: string; userName?: string; displayName?: string }> }> }; teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string; name?: string; userName?: string; displayName?: string }> }> };

        const teams = matchData?.data?.teams || matchData?.teams || [];

        if (teams && Array.isArray(teams)) {
          const guests: Array<{ id: string, name: string, team: 'A' | 'B', joinedAt: Date }> = [];

          if (teams[0]?.members && Array.isArray(teams[0].members)) {
            const teamAMembers: string[] = [];
            teams[0].members.forEach((member: { guestName?: string; membershipName?: string; fullName?: string; name?: string; userName?: string; displayName?: string }, index: number) => {
              const memberName =
                member.guestName ||
                member.membershipName ||
                member.fullName ||
                member.name ||
                member.userName ||
                member.displayName ||
                '';

              if (memberName) {
                teamAMembers.push(memberName);
                guests.push({
                  id: `teamA-${index}`,
                  name: memberName,
                  team: 'A' as const,
                  joinedAt: new Date()
                });
              }
            });

            if (teamAMembers.length > 0) {
              if (teamAMembers.length > 0) {
                setTeamA(teamAMembers);
              }
            }
          }

          if (teams[1]?.members && Array.isArray(teams[1].members)) {
            const teamBMembers: string[] = [];
            teams[1].members.forEach((member: { guestName?: string; membershipName?: string; fullName?: string; name?: string; userName?: string; displayName?: string }, index: number) => {
              const memberName =
                member.guestName ||
                member.membershipName ||
                member.fullName ||
                member.name ||
                member.userName ||
                member.displayName ||
                '';

              if (memberName) {
                teamBMembers.push(memberName);
                guests.push({
                  id: `teamB-${index}`,
                  name: memberName,
                  team: 'B' as const,
                  joinedAt: new Date()
                });
              }
            });

            if (teamBMembers.length > 0) {
              if (teamBMembers.length > 0) {
                setTeamB(teamBMembers);
              }
            }
          }

          setConnectedGuests(guests);
        }
      } catch {
      }
    };

    fetchConnectedGuests();

    let pollingInterval: NodeJS.Timeout;

    const startPolling = () => {
      pollingInterval = setInterval(() => {
        fetchConnectedGuests();
      }, 5000);
    };

    const stopPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };

    startPolling();

    const checkSocketHealth = () => {
      if (isWebSocketConnected && connectedGuests.length > 0) {
        stopPolling();
        setTimeout(() => {
          if (isWebSocketConnected) {
            startPolling();
          }
        }, 10000);
      }
    };

    const healthCheckInterval = setInterval(checkSocketHealth, 10000);

    return () => {
      stopPolling();
      clearInterval(healthCheckInterval);
    };
  }, [matchId, connectedGuests.length, isWebSocketConnected]);

  useEffect(() => {
    if (tableId) {
      const loadTableInfo = async () => {
        try {
          const tableData = await userMatchService.verifyTable({ tableId });
          const responseData = (tableData as { data?: { name?: string; category?: string; clubId?: string } })?.data || tableData;
          const tableInfoData = responseData as { name?: string; category?: string; clubId?: string };
          setTableInfo(tableInfoData);
        } catch {
          console.error('Error loading table info');
        }
      };
      loadTableInfo();
    }
  }, [tableId]);

  useEffect(() => {
    if (matchId && !tableId) {
      const getTableIdFromMatch = async () => {
        try {
          const matchData = await userMatchService.getMatchById(matchId);
          const responseData = (matchData as { data?: { tableId?: string; table?: { id?: string } } })?.data || matchData;
          const matchInfo = responseData as { tableId?: string; table?: { id?: string } };
          const tableIdFromMatch = matchInfo?.tableId || matchInfo?.table?.id;

          if (tableIdFromMatch) {
            const url = new URL(window.location.href);
            url.searchParams.set('tableId', tableIdFromMatch);
            window.history.replaceState({}, '', url.toString());
          }
        } catch {
          console.error('Error getting tableId from match');
        }
      };

      getTableIdFromMatch();
    }
  }, [matchId, tableId]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const init = async () => {
      try {

        if (existingMatchId) {
          setMatchId(existingMatchId);

          if (existingCode) {
            setRoomCode(existingCode);
          } else {
            try {
              const data = (await userMatchService.getMatchById(existingMatchId)) as { data?: { matchCode?: string; code?: string; joinCode?: string; roomCode?: string } };
              const responseData = data?.data || data;
              const matchInfo = responseData as { matchCode?: string; code?: string; joinCode?: string; roomCode?: string };
              const codeCandidate =
                matchInfo?.matchCode ||
                matchInfo?.code ||
                matchInfo?.joinCode ||
                matchInfo?.roomCode ||
                '';
              if (codeCandidate) {
                setRoomCode(String(codeCandidate));
              }
            } catch {
              console.error('Error getting match by ID');
            }
          }
        } else if (existingCode) {
          setRoomCode(existingCode);
          try {
            const data = await userMatchService.getMatchByCode(existingCode);
            const responseData = (data as { data?: { matchId?: string; id?: string } })?.data || data;
            const matchInfo = responseData as { matchId?: string; id?: string };
            const matchIdFromCode = matchInfo?.matchId || matchInfo?.id;
            if (matchIdFromCode) {
              setMatchId(matchIdFromCode);
            }
          } catch {
            console.error('Error getting match by code');
          }
        }
      } finally {
        timer = setTimeout(() => setLoading(false), 800);
      }
    };
    init();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [tableId, existingCode, existingMatchId]);

  const handleLeaveRoom = () => {
    setShowLeaveConfirm(true);
  };

  const handleConfirmLeave = async () => {
    if (isLeaving) return;
    try {
      setIsLeaving(true);

      if (roomCode && guestName) {
        try {
          const leaverInfo = membershipId && membershipName 
            ? { membershipId, membershipName }
            : { guestName: guestName };
            
          await userMatchService.leaveMatch({
            matchCode: roomCode,
            leaverInfo
          });
          toast.success('Đã rời khỏi phòng');
        } catch {
          console.error('Error leaving match');
        }
      }

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('leave_match', { matchId, guestName });
      }

      const loginParams = new URLSearchParams();
      if (tableId) loginParams.set('tableId', tableId);
      if (tableNumber) loginParams.set('table', tableNumber);

      router.push(`/user/match/create?${loginParams.toString()}`);

    } catch {
      toast.error('Có lỗi xảy ra khi rời phòng');
    } finally {
      setIsLeaving(false);
    }
  };

  if (loading) return <ScoreLensLoading text="Đang tham gia phòng..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20 overflow-hidden">
      <HeaderUser />

      <main className="flex-1 flex flex-col px-4 py-8 overflow-y-auto scroll-smooth">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#000000]">
            {tableNumber.toUpperCase()} - {tableInfo?.category ? (tableInfo.category === 'pool-8' ? 'POOL 8' : `- ${tableInfo.category.toUpperCase()}`) : (tableId ? 'ĐANG TẢI...' : 'POOL 8')}
          </h2>
          <p className="text-sm sm:text-base text-[#000000] font-medium">Bạn đã tham gia phòng với tên: {guestName}</p>
        </div>

        <div className="flex-1 flex justify-center overflow-y-auto scroll-smooth">
          <div className="w-full max-w-sm space-y-6 pb-8">
            <div className="space-y-3 flex flex-col items-center justify-center w-full">
              <p className="text-base font-medium text-[#000000]">Mã Tham Gia</p>
              <div className="px-6 py-4 rounded-2xl bg-white border border-[#000000]/80 shadow-sm mx-auto">
                <div className="flex items-center justify-center gap-3 select-all">
                  {roomCode.split('').map((ch, idx) => (
                    <span
                      key={idx}
                      className="w-6 sm:w-7 text-center font-mono tabular-nums font-extrabold text-3xl sm:text-4xl text-[#000000] leading-none"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#000000]/70">Chia sẻ mã này cho người chơi để tham gia phòng</p>
            </div>

            <div className="space-y-4 w-full">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="font-bold text-[#000000] mb-3">Đội A</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto scroll-smooth">
                  {teamA.map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Người Chơi ${index + 1}`}
                        value={player}
                        onChange={(e) => handleChange('A', index, e.target.value)}
                        disabled={true}
                        className="flex w-full border border-gray-300 rounded-md bg-gray-100 px-4 py-3 text-sm text-[#000000] placeholder:text-gray-500 cursor-not-allowed opacity-75"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="font-bold text-[#000000] mb-3">Đội B</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto scroll-smooth">
                  {teamB.map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Người Chơi ${index + 1}`}
                        value={player}
                        onChange={(e) => handleChange('B', index, e.target.value)}
                        disabled={true}
                        className="flex w-full border border-gray-300 rounded-md bg-gray-100 px-4 py-3 text-sm text-[#000000] placeholder:text-gray-500 cursor-not-allowed opacity-75"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterButton>
        <button
          onClick={handleLeaveRoom}
          disabled={isLeaving}
          className={`w-full font-semibold py-3 rounded-xl text-base sm:text-base transition ${isLeaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#FF0000] hover:bg-red-600 text-[#FFFFFF]'
            }`}
        >
          {isLeaving ? 'Đang rời phòng...' : 'Rời phòng'}
        </button>
      </FooterButton>

      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg text-center">
            <h2 className="text-xl font-bold text-[#000000] mb-4">
              Xác nhận rời phòng
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn rời khỏi phòng này không?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="w-full bg-[#FF0000] hover:bg-gray-400 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmLeave}
                disabled={isLeaving}
                className="w-full bg-[#8ADB10] hover:bg-red-600 disabled:bg-gray-400 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base transition disabled:cursor-not-allowed"
              >
                {isLeaving ? 'Đang rời phòng...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuestJoinPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải..." />}>
      <GuestJoinContent />
    </Suspense>
  );
}
