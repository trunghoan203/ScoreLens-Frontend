'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import { userMatchService } from '@/lib/userMatchService';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

function HomeRandomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableNumber = searchParams!.get('table') || '??';
  const tableId = searchParams!.get('tableId') || '';
  const existingCode = searchParams!.get('code') || '';
  const existingMatchId = searchParams!.get('matchId') || '';
  const creatorName = searchParams!.get('name') || searchParams!.get('fullName') || '';

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
    if (!roomCode || !matchId) return;

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; 

    const connectSocket = () => {
       const socketUrl = 'http://localhost:8000';

      try {
        const socket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          timeout: 10000
        });

        socketRef.current = socket;

                 socket.on('connect', () => {
          setIsWebSocketConnected(true);
          socket.emit('join_match_room', matchId);
        });

                         socket.on('disconnect', () => {
          setIsWebSocketConnected(false);
        });

                         socket.on('connect_error', (error) => {
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
             if (currentTotalMembers > connectedGuests.length) {
             }
          }
        });

                 socket.on('match_deleted', (data) => {
           toast('Trận đấu đã bị hủy');
         });

                 socket.on('error', (error) => {
          setIsWebSocketConnected(false);
        });

             } catch (error) {
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
  }, [roomCode, matchId, creatorName]);

  useEffect(() => {
    if (!matchId) return;

    const fetchConnectedGuests = async () => {
             try {
         const matchData = await userMatchService.getMatchById(matchId) as Record<string, any>;
         
         const teams = matchData?.data?.teams || matchData?.teams || [];

        if (teams && Array.isArray(teams)) {
          const guests: Array<{ id: string, name: string, team: 'A' | 'B', joinedAt: Date }> = [];

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
             
             setTeamA(teamAMembers);
           }

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
             
             setTeamB(teamBMembers);
           }

                     setConnectedGuests(guests);
           setLastUpdateTime(new Date());
           setIsPolling(false);

        }
             } catch (error) {
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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const init = async () => {
      try {
        if (creatorName) {
          setTeamA([creatorName]);
        }

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
              if (codeCandidate) setRoomCode(String(codeCandidate));

              if (!creatorName) {
                const matchCreatorName =
                  responseData?.createdBy?.fullName ||
                  responseData?.createdBy?.name ||
                  '';
                if (matchCreatorName) {
                  setTeamA([matchCreatorName]);
                }
              }
            } catch (error) {
              console.error('Error loading match info:', error);
            }
          }
        }
        
        if (existingCode) {
          setRoomCode(existingCode);
        }
        
        if (!tableId) {
          const digits = '123456789';
          let code = '';
          for (let i = 0; i < 6; i++) code += digits[Math.floor(Math.random() * digits.length)];
          setRoomCode(code);
        }
      } finally {
        timer = setTimeout(() => setLoading(false), 800);
      }
    };
    init();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [tableId, existingCode, existingMatchId, creatorName]);

  const handleStart = async () => {
    try {
      if (!matchId) {
        toast.error('Không có matchId. Vui lòng kiểm tra lại.');
        return;
      }

      const startMatchPayload: any = {};
      
      const guestToken = searchParams?.get('guestToken');
      const membershipId = searchParams?.get('membershipId');
      
      if (guestToken && guestToken.trim() !== '') {
        startMatchPayload.actorGuestToken = guestToken;
      }
      
      if (membershipId && membershipId.trim() !== '') {
        startMatchPayload.actorMembershipId = membershipId;
      }

        if (Object.keys(startMatchPayload).length === 0) {
          try {
            const matchData = await userMatchService.getMatchById(matchId);
            const responseData = (matchData as any)?.data || matchData;
            
            if (responseData?.creatorGuestToken) {
              startMatchPayload.actorGuestToken = responseData.creatorGuestToken;
            } else if (responseData?.createdByMembershipId) {
              startMatchPayload.actorMembershipId = responseData.createdByMembershipId;
            } else {
              toast.error('Không thể xác thực quyền start match. Vui lòng liên hệ admin.');
              return;
            }
          } catch (matchError) {
            console.error('Không thể lấy thông tin match:', matchError);
            toast.error('Không thể xác thực quyền start match. Vui lòng thử lại.');
            return;
          }
        }

      const response = await userMatchService.startMatch(matchId, startMatchPayload);
      
      if (response && typeof response === 'object' && 'success' in response && response.success) {
        toast.success('Trận đấu đã bắt đầu!');
        router.push(`/user/screencontrol?table=${tableNumber}&room=${roomCode}&matchId=${matchId}&tableId=${tableId}`);
      } else {
        toast.error('Không thể bắt đầu trận đấu. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error starting match:', error);
      
      // Log từng thông tin riêng biệt
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Error type:', typeof error);
        console.error('Error value:', error);
      }
      
      toast.error('Có lỗi xảy ra khi bắt đầu trận đấu.');
    }
  };

  if (loading) return <ScoreLensLoading text="Đang tạo mã phòng..." />;

     return (
     <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20 overflow-hidden">
       <HeaderUser />
 
       <main className="flex-1 flex flex-col px-4 py-8 overflow-y-auto scroll-smooth">
         <div className="text-center mb-8">
           <h2 className="text-2xl sm:text-3xl font-bold text-[#000000]">
             {tableNumber} - {tableInfo?.category ? tableInfo.category.toUpperCase() : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
           </h2>
           <p className="text-sm sm:text-base text-[#000000] font-medium">Nhập mã bên dưới để tham gia phòng</p>
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
                        placeholder={index === 0 ? "Tên chủ phòng" : `Tên người chơi ${index + 1}`}
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
                        placeholder={index === 0 ? "Tên người chơi chính" : `Tên người chơi ${index + 1}`}
                        value={player}
                        onChange={(e) => handleChange('B', index, e.target.value)}
                        disabled={true}
                        className="flex w-full border border-gray-500 rounded-md bg-gray-100 px-4 py-3 text-sm text-[#000000] placeholder:text-gray-500 cursor-not-allowed opacity-75"
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
          onClick={() => {
            handleStart();
          }}
          disabled={!matchId || loading}
          className={`w-full font-semibold py-3 rounded-xl text-base sm:text-base transition ${
            !matchId || loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF]'
          }`}
        >
          {loading ? 'Đang tải...' : !matchId ? 'Chưa sẵn sàng' : 'Bắt đầu'}
        </button>
      </FooterButton>
    </div>
  );
}

export default function HomeRandomPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải..." />}>
      <HomeRandomContent />
    </Suspense>
  );
}
