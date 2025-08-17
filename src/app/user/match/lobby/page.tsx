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
import RoleBadge from '@/components/ui/RoleBadge';
import { useMatchRole } from '@/lib/hooks/useMatchRole';

function HomeRandomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableNumber = searchParams!.get('table') || '??';
  const tableId = searchParams!.get('tableId') || '';
  const existingCode = searchParams!.get('code') || '';
  const existingMatchId = searchParams!.get('matchId') || '';
  const creatorName = searchParams!.get('name') || searchParams!.get('fullName') || '';
  const membershipId = searchParams!.get('membershipId') || '';
  const membershipName = searchParams!.get('membershipName') || '';
  const sessionToken = searchParams!.get('sessionToken') || '';

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
  const socketRef = useRef<Socket | null>(null);

  // Sử dụng useMatchRole hook để quản lý role và authentication
  const { 
    role: matchRole, 
    isHost, 
    isManager, 
    canEdit, 
    authenticateMatch, 
    isLoading: authLoading, 
    error: authError 
  } = useMatchRole(matchId || undefined, socketRef.current);

  const handleChange = (team: 'A' | 'B', index: number, value: string) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  // Load thông tin match và bàn
  useEffect(() => {
    const loadMatchData = async () => {
      try {
        setLoading(true);

        // Load thông tin bàn
        if (tableId) {
          try {
            const tableData = await userMatchService.verifyTable({ tableId });
            
            // Kiểm tra response structure
            let tableInfoData: { name?: string; category?: string; clubId?: string } | null = null;
            
            if (tableData && typeof tableData === 'object') {
              // Thử các cấu trúc response khác nhau
              if ('data' in tableData && tableData.data) {
                tableInfoData = tableData.data as { name?: string; category?: string; clubId?: string };
              } else if ('name' in tableData || 'category' in tableData || 'clubId' in tableData) {
                tableInfoData = tableData as { name?: string; category?: string; clubId?: string };
              } else {
                // Fallback: sử dụng thông tin từ URL
                tableInfoData = {
                  name: tableNumber,
                  category: 'pool-8' // Default category
                };
              }
            } else {
              // Fallback: sử dụng thông tin từ URL
              tableInfoData = {
                name: tableNumber,
                category: 'pool-8' // Default category
              };
            }
            
            setTableInfo(tableInfoData);
          } catch (error) {
            // Hiển thị lỗi cụ thể
            if (error instanceof Error) {
              toast.error(`Lỗi tải thông tin bàn: ${error.message}`);
            } else {
              toast.error('Không thể tải thông tin bàn. Sử dụng thông tin mặc định.');
            }
            
            // Fallback: sử dụng thông tin từ URL
            setTableInfo({
              name: tableNumber,
              category: 'pool-8'
            });
          }
        }

        // Load thông tin match nếu có matchId
        if (matchId) {
          try {
            const matchData = await userMatchService.getMatchById(matchId);
            
            const responseData = (matchData as { data?: { teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }> } })?.data || matchData;
            const matchInfoData = responseData as { teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }> };

            if (matchInfoData?.teams) {
              // Load team A members
              if (matchInfoData.teams[0]?.members) {
                const teamAMembers = matchInfoData.teams[0].members.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
                  member.guestName || member.membershipName || member.fullName || ''
                );
                setTeamA(teamAMembers.length > 0 ? teamAMembers : ['']);
              }

              // Load team B members
              if (matchInfoData.teams[1]?.members) {
                const teamBMembers = matchInfoData.teams[1].members.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
                  member.guestName || member.membershipName || member.fullName || ''
                );
                setTeamB(teamBMembers.length > 0 ? teamBMembers : ['']);
              }
            }
          } catch (error) {
            toast.error('Không thể tải thông tin trận đấu');
          }
        }

        // Load thông tin match nếu có code
        if (existingCode && !matchId) {
          try {
            const matchData = await userMatchService.getMatchByCode(existingCode);
            
            const responseData = (matchData as { data?: { matchId?: string; id?: string; teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }> } })?.data || matchData;
            const matchInfoData = responseData as { matchId?: string; id?: string; teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }> };
            
            const newMatchId = matchInfoData?.matchId || matchInfoData?.id;
            if (newMatchId) {
              setMatchId(newMatchId);
            }

            if (matchInfoData?.teams) {
              // Load team A members
              if (matchInfoData.teams[0]?.members) {
                const teamAMembers = matchInfoData.teams[0].members.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
                  member.guestName || member.membershipName || member.fullName || ''
                );
                setTeamA(teamAMembers.length > 0 ? teamAMembers : ['']);
              }

              // Load team B members
              if (matchInfoData.teams[1]?.members) {
                const teamBMembers = matchInfoData.teams[1].members.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
                  member.guestName || member.membershipName || member.fullName || ''
                );
                setTeamB(teamBMembers.length > 0 ? teamBMembers : ['']);
              }
            }
          } catch (error) {
            toast.error('Không thể tải thông tin match theo mã phòng');
          }
        }

        if (creatorName && (teamA.length === 0 || teamA[0] === '')) {
          setTeamA([creatorName]);
        }

      } catch (error) {
        console.error('Error in loadMatchData:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadMatchData();
  }, [tableId, matchId, existingCode, creatorName]);

  // Authenticate với match khi có matchId và sessionToken
  useEffect(() => {
    if (matchId && sessionToken) {
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
    if (!matchId) return;

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    const connectSocket = () => {
      const socketUrl = config.socketUrl;

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

        socket.on('connect_error', () => {
          setIsWebSocketConnected(false);

          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(connectSocket, retryDelay);
          }
        });

        socket.on('guest_joined', (data) => {
          toast.success('Người chơi mới đã tham gia phòng!');
        });

        socket.on('guest_left', (data) => {
          toast('Người chơi đã rời khỏi phòng');
        });

        socket.on('match_updated', (data) => {
          if (data.teams && Array.isArray(data.teams)) {
            const guests: Array<{ id: string, name: string, team: 'A' | 'B', joinedAt: Date }> = [];

            if (data.teams[0]?.members && Array.isArray(data.teams[0].members)) {
              const teamAMembers: string[] = [];
              data.teams[0].members.forEach((member: { guestName?: string; membershipName?: string; fullName?: string; name?: string; userName?: string; displayName?: string }, index: number) => {
                const memberName =
                  member.guestName || member.membershipName || member.fullName || member.name || member.userName || member.displayName || `Người chơi ${index + 1}`;
                teamAMembers.push(memberName);
                guests.push({
                  id: `teamA-${index}`,
                  name: memberName,
                  team: 'A',
                  joinedAt: new Date()
                });
              });
              setTeamA(teamAMembers.length > 0 ? teamAMembers : ['']);
            }

            if (data.teams[1]?.members && Array.isArray(data.teams[1].members)) {
              const teamBMembers: string[] = [];
              data.teams[1].members.forEach((member: { guestName?: string; membershipName?: string; fullName?: string; name?: string; userName?: string; displayName?: string }, index: number) => {
                const memberName =
                  member.guestName || member.membershipName || member.fullName || member.name || member.userName || member.displayName || `Người chơi ${index + 1}`;
                teamBMembers.push(memberName);
                guests.push({
                  id: `teamB-${index}`,
                  name: memberName,
                  team: 'B',
                  joinedAt: new Date()
                });
              });
              setTeamB(teamBMembers.length > 0 ? teamBMembers : ['']);
            }

            setConnectedGuests(guests);
          }
        });

        socket.connect();
      } catch (error) {
        console.error('Socket connection error:', error);
        setIsWebSocketConnected(false);
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [matchId]);

  const handleStart = async () => {
    try {
      if (!matchId) {
        toast.error('Không có matchId. Vui lòng kiểm tra lại.');
        return;
      }

      // Kiểm tra WebSocket authentication trước khi start match
      if (!isWebSocketConnected) {
        toast.error('Chưa kết nối WebSocket. Vui lòng đợi kết nối hoàn tất.');
        return;
      }

      // Kiểm tra role authentication
      if (authLoading) {
        toast.error('Đang xác thực quyền. Vui lòng đợi...');
        return;
      }

      if (authError) {
        toast.error(`Lỗi xác thực: ${authError}`);
        return;
      }

      // Kiểm tra xem user có phải là host không
      if (!isHost) {
        toast.error('Chỉ host mới có quyền bắt đầu trận đấu.');
        return;
      }

      // Luôn lấy thông tin creator từ match data
      let startMatchPayload: { actorGuestToken?: string; actorMembershipId?: string; sessionToken: string } = { sessionToken: '' };
      
      try {
        // Lấy thông tin match để tìm creator và sessionToken của host
        const matchData = await userMatchService.getMatchById(matchId);
        
        const responseData = (matchData as { data?: { 
          creatorGuestToken?: string; 
          createdByMembershipId?: string;
          teams?: Array<{ members?: Array<{ 
            guestName?: string; 
            membershipName?: string; 
            role?: string;
            sessionToken?: string;
          }> }>
        } })?.data || matchData;
        
        const matchInfo = responseData as { 
          creatorGuestToken?: string; 
          createdByMembershipId?: string;
          teams?: Array<{ members?: Array<{ 
            guestName?: string; 
            membershipName?: string; 
            role?: string;
            sessionToken?: string;
          }> }>
        };

        // Tìm member có role 'host' để lấy sessionToken
        let hostSessionToken = '';
        if (matchInfo?.teams) {
          for (const team of matchInfo.teams) {
            if (team.members) {
              const hostMember = team.members.find(m => m.role === 'host');
              if (hostMember?.sessionToken) {
                hostSessionToken = hostMember.sessionToken;
                break;
              }
            }
          }
        }

        if (!hostSessionToken) {
          toast.error('Không thể xác thực quyền start match. Vui lòng liên hệ admin.');
          return;
        }

        // Thêm sessionToken của host (bắt buộc cho BE)
        startMatchPayload.sessionToken = hostSessionToken;

        if (matchInfo?.creatorGuestToken) {
          startMatchPayload.actorGuestToken = matchInfo.creatorGuestToken;
        } else if (matchInfo?.createdByMembershipId) {
          startMatchPayload.actorMembershipId = matchInfo.createdByMembershipId;
        } else {
          toast.error('Không thể xác thực quyền start match. Vui lòng liên hệ admin.');
          return;
        }
      } catch (matchError) {
        toast.error('Không thể xác thực quyền start match. Vui lòng thử lại.');
        return;
      }

      const response = await userMatchService.startMatch(matchId, startMatchPayload);

      if (response && typeof response === 'object' && 'success' in response && response.success) {
        toast.success('Trận đấu đã bắt đầu!');
        
        const params = new URLSearchParams({
          table: tableNumber,
          room: roomCode,
          matchId: matchId,
          tableId: tableId
        });
        
        if (sessionToken) {
          params.set('sessionToken', sessionToken);
        }
        
        router.push(`/user/match/scoreboard?${params.toString()}`);
      } else {
        toast.error('Không thể bắt đầu trận đấu. Vui lòng thử lại.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi bắt đầu trận đấu.');
    }
  };



  if (loading || authLoading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20 overflow-hidden">
      <HeaderUser showBack={false} />

      <main className="flex-1 flex flex-col px-4 py-8 overflow-y-auto scroll-smooth">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#000000]">
            {tableNumber.toUpperCase()} - {tableInfo?.category ? (tableInfo.category === 'pool-8' ? 'POOL 8' : ` ${tableInfo.category.toUpperCase()}`) : (tableId ? 'ĐANG TẢI...' : 'POOL 8')}
          </h2>
          <p className="text-sm sm:text-base text-[#000000] font-medium">Nhập mã bên dưới để tham gia phòng</p>
          
          {/* Hiển thị role và trạng thái authentication */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {matchRole && (
              <RoleBadge role={matchRole.role} />
            )}
            {authLoading && (
              <span className="text-sm text-blue-600">Đang xác thực...</span>
            )}
            {authError && (
              <span className="text-sm text-red-600">Lỗi xác thực</span>
            )}
            {isWebSocketConnected ? (
              <span className="text-sm text-green-600">✓ Đã kết nối</span>
            ) : (
              <span className="text-sm text-yellow-600">⏳ Đang kết nối...</span>
            )}
          </div>
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
            if (!matchId || loading || authLoading) {
              return;
            }
            handleStart();
          }}
          disabled={!matchId || loading || authLoading || !isWebSocketConnected || !isHost}
          className={`w-full font-semibold py-3 rounded-xl text-base sm:text-base transition ${
            !matchId || loading || authLoading || !isWebSocketConnected || !isHost
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF]'
          }`}
        >
          {loading || authLoading ? 'Đang tải...' : 
           !matchId ? 'Chưa sẵn sàng' : 
           !isWebSocketConnected ? 'Đang kết nối...' :
           !isHost ? 'Không có quyền' : 'Bắt đầu'}
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
