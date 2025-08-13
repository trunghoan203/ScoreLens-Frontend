'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import { userMatchService } from '@/lib/userMatchService';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

function GuestJoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableNumber = searchParams!.get('table') || '??';
  const tableId = searchParams!.get('tableId') || '';
  const existingCode = searchParams!.get('code') || '';
  const existingMatchId = searchParams!.get('matchId') || '';
  const guestName = searchParams!.get('name') || searchParams!.get('guestName') || '';

  const [roomCode, setRoomCode] = useState(existingCode);
  const [loading, setLoading] = useState(true);
  const [matchId, setMatchId] = useState(existingMatchId);
  const [tableInfo, setTableInfo] = useState<any>(null);

  const [teamA, setTeamA] = useState(['']);
  const [teamB, setTeamB] = useState(['']);

  const [connectedGuests, setConnectedGuests] = useState<Array<{ id: string, name: string, team: 'A' | 'B', joinedAt: Date }>>([]);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isLeaving, setIsLeaving] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const handleChange = (team: 'A' | 'B', index: number, value: string) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  const handleAddPlayer = (team: 'A' | 'B') => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    if (current.length >= 4) {
      toast.error('Không thể thêm quá 4 người chơi!', {
        style: {
          background: '#FF0000',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '1rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        },
        iconTheme: {
          primary: '#FFFFFF',
          secondary: '#FF0000'
        }
      });
      return;
    }
    setter([...current, '']);
  };

  const handleRemovePlayer = (team: 'A' | 'B', index: number) => {
    if (index === 0) return;
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    const updated = [...current];
    updated.splice(index, 1);
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
      const socketUrl = 'http://localhost:8000';

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

        socket.on('connect_error', (error) => {
          isConnecting = false;
          setIsWebSocketConnected(false);
          
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(connectSocket, retryDelay);
          }
        });

        socket.on('guest_joined', (data) => {
          toast.success(`${data.guestName || 'Người chơi mới'} đã tham gia phòng!`);
        });

        socket.on('guest_left', (data) => {
          toast(`${data.guestName || 'Người chơi'} đã rời khỏi phòng`);
        });

        socket.on('match_updated', (data) => {
          if (data.status === 'ongoing') {
            toast.success('Trận đấu đã bắt đầu!');
            const redirectUrl = `/user/screencontrol?table=${tableNumber}&room=${roomCode}&matchId=${matchId}&tableId=${tableId}`;
            router.push(redirectUrl);
            return;
          }

          if (data.teams && Array.isArray(data.teams)) {
            const guests: Array<{ id: string, name: string, team: 'A' | 'B', joinedAt: Date }> = [];

            if (data.teams[0]?.members && Array.isArray(data.teams[0].members)) {
              const teamAMembers: string[] = [];
              data.teams[0].members.forEach((member: any, index: number) => {
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
              data.teams[1].members.forEach((member: any, index: number) => {
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

        socket.on('match_deleted', (data) => {
          toast('Trận đấu đã bị hủy');
        });

        socket.on('match_ended', (data) => {
          toast.success('Trận đấu đã kết thúc!');
          
          // Navigate to endmatch page with match data
          const params = new URLSearchParams();
          if (data.matchId) params.set('matchId', data.matchId);
          if (data.tableName) params.set('tableName', data.tableName);
          if (data.matchCode) params.set('matchCode', data.matchCode);
          if (data.scoreA !== undefined) params.set('scoreA', data.scoreA.toString());
          if (data.scoreB !== undefined) params.set('scoreB', data.scoreB.toString());
          if (data.teamA) params.set('teamA', data.teamA.join(','));
          if (data.teamB) params.set('teamB', data.teamB.join(','));
          if (data.tableId) params.set('tableId', data.tableId);
          
          // Use router.push for navigation
          router.push(`/user/endmatch?${params.toString()}`);
        });

        socket.on('error', (error) => {
          setIsWebSocketConnected(false);
        });

      } catch (error) {
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
  }, [matchId, tableNumber, roomCode, tableId]);

  useEffect(() => {
    if (!matchId) return;

    const fetchConnectedGuests = async () => {
      try {
        const matchData = await userMatchService.getMatchById(matchId) as Record<string, any>;
        
        const teams = matchData?.data?.teams || matchData?.teams || [];

        if (teams && Array.isArray(teams)) {
          const guests: Array<{ id: string, name: string, team: 'A' | 'B', joinedAt: Date }> = [];

          // Process Team A (index 0) - only update if we have data
          if (teams[0]?.members && Array.isArray(teams[0].members)) {
            const teamAMembers: string[] = [];
            teams[0].members.forEach((member: any, index: number) => {
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
            
            // Only update Team A if we have members from API
            if (teamAMembers.length > 0) {
              // Only update Team A if we have members from API
              if (teamAMembers.length > 0) {
                setTeamA(teamAMembers);
              }
            }
          }

          // Process Team B (index 1) - only update if we have data
          if (teams[1]?.members && Array.isArray(teams[1].members)) {
            const teamBMembers: string[] = [];
            teams[1].members.forEach((member: any, index: number) => {
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
            
            // Only update Team B if we have members from API
            if (teamBMembers.length > 0) {
              // Only update Team B if we have members from API
              if (teamBMembers.length > 0) {
                setTeamB(teamBMembers);
              }
            }
          }

          setConnectedGuests(guests);
          setLastUpdateTime(new Date());
          setIsPolling(false);
        }
      } catch (error) {
        // Silent error handling
      }
    };

    fetchConnectedGuests();

    let pollingInterval: NodeJS.Timeout;

    const startPolling = () => {
      setIsPolling(true);
      pollingInterval = setInterval(() => {
        setIsPolling(true);
        fetchConnectedGuests();
      }, 5000); 
    };

    const stopPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setIsPolling(false);
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
  }, [matchId]);

  useEffect(() => {
    if (tableId) {
      const loadTableInfo = async () => {
        try {
          const tableData = await userMatchService.verifyTable({ tableId });
          const responseData = (tableData as any)?.data || tableData;
          setTableInfo(responseData);
        } catch (error) {
          console.error('Error loading table info:', error);
        }
      };
      loadTableInfo();
    }
  }, [tableId]);

  // Try to get tableId from match data if not available
  useEffect(() => {
    if (matchId && !tableId) {
      const getTableIdFromMatch = async () => {
        try {
          const matchData = await userMatchService.getMatchById(matchId);
          const responseData = (matchData as any)?.data || matchData;
          const tableIdFromMatch = responseData?.tableId || responseData?.table?.id;
          
          if (tableIdFromMatch) {
            const url = new URL(window.location.href);
            url.searchParams.set('tableId', tableIdFromMatch);
            window.history.replaceState({}, '', url.toString());
          }
        } catch (error) {
          console.error('Error getting tableId from match:', error);
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
              const data = (await userMatchService.getMatchById(existingMatchId)) as Record<string, any>;
              const responseData = data?.data || data;
              const codeCandidate =
                responseData?.matchCode ||
                responseData?.code ||
                responseData?.joinCode ||
                responseData?.roomCode ||
                '';
              if (codeCandidate) {
                setRoomCode(String(codeCandidate));
              }
            } catch (error) {
              console.error('Error getting match by ID:', error);
            }
          }
        } else if (existingCode) {
          setRoomCode(existingCode);
          
          // Nếu chỉ có code, thử lấy matchId từ API
          try {
            const data = await userMatchService.getMatchByCode(existingCode);
            const responseData = (data as any)?.data || data;
            const matchIdFromCode = responseData?.matchId || responseData?.id;
            if (matchIdFromCode) {
              setMatchId(matchIdFromCode);
            }
          } catch (error) {
            console.error('Error getting match by code:', error);
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

  const handleLeaveRoom = async () => {
    if (isLeaving) return; // Prevent multiple clicks
    
    try {
      setIsLeaving(true);
      
      // Gọi API leaveMatch trước
      if (roomCode && guestName) {
        try {
          await userMatchService.leaveMatch({
            matchCode: roomCode,
            leaverInfo: { guestName: guestName }
          });
          toast.success('Đã rời khỏi phòng thành công');
        } catch (error: any) {
          console.error('Error leaving match:', error);
          // Vẫn tiếp tục rời phòng ngay cả khi API fail
          toast.error('Có lỗi khi rời phòng, nhưng vẫn sẽ chuyển trang');
        }
      }
      
      // Emit socket event nếu có kết nối
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('leave_match', { matchId, guestName });
      }
      
      // Chuyển trang sau khi xử lý xong
      router.push('/user/guest');
      
    } catch (error) {
      console.error('Error in handleLeaveRoom:', error);
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
            {tableNumber} - {tableInfo?.category ? tableInfo.category.toUpperCase() : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
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
                        className="flex w-full border border-gray-300 rounded-md bg-white px-4 py-3 text-sm text-[#000000] placeholder:text-gray-500 focus:outline-none focus:border-[#8ADB10] hover:border-lime-400 transition-all"
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
                        className="flex w-full border border-gray-300 rounded-md bg-white px-4 py-3 text-sm text-[#000000] placeholder:text-gray-500 focus:outline-none focus:border-[#8ADB10] hover:border-lime-400 transition-all"
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
          className={`w-full font-semibold py-3 rounded-xl text-base sm:text-base transition ${
            isLeaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#FF0000] hover:bg-red-600 text-[#FFFFFF]'
          }`}
        >
          {isLeaving ? 'Đang rời phòng...' : 'Rời phòng'}
        </button>
      </FooterButton>
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
