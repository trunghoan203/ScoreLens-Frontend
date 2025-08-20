'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import toast from 'react-hot-toast';
import { userMatchService } from '@/lib/userMatchService';
import RoleBadge from '@/components/ui/RoleBadge';
import { setIdentity, setSession } from '@/lib/session';

function GuestJoinContent() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [tableId, setTableId] = useState('');
  const [tableInfo, setTableInfo] = useState<{
    clubId?: string;
    name?: string;
    category?: string;
  } | null>(null);
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifyingMember, setVerifyingMember] = useState(false);
  const [verifyMemberStatus, setVerifyMemberStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verifyMemberMessage, setVerifyMemberMessage] = useState('');
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<0 | 1>(0);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [verifiedMembershipId, setVerifiedMembershipId] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams!.get('table');
    const room = searchParams!.get('room');
    const tId = searchParams!.get('tableId');
    const sessionToken = searchParams!.get('sessionToken');
    if (table) setTableNumber(table);
    if (room) setRoomCode(room);
    if (tId) setTableId(tId);
    if (sessionToken) setSessionToken(sessionToken);

    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (tableId) {
      const loadTableInfo = async () => {
        try {
          const tableData = await userMatchService.verifyTable({ tableId });
          const responseData = (tableData as { data?: { clubId?: string; name?: string; category?: string } })?.data || tableData;
          const tableInfoData = responseData as { clubId?: string; name?: string; category?: string };
          setTableInfo(tableInfoData);
        } catch {
        }
      };
      loadTableInfo();
    }
  }, [tableId]);

  const handleVerifyMembership = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Vui lòng nhập số điện thoại.');
      return;
    }

    if (!tableInfo?.clubId) {
      setVerifyMemberMessage('Không thể xác định club. Vui lòng thử lại.');
      return;
    }

    setVerifyingMember(true);
    setVerifyMemberStatus('idle');

    try {
      const result = await userMatchService.verifyMembership({
        phoneNumber: phoneNumber.trim(),
        clubId: tableInfo.clubId
      });

      if (!result.success) {
        throw new Error(result.message || 'Xác thực thất bại');
      }

      if (!result.isMember) {
        toast.error('Bạn chưa đăng ký hội viên');
        return;
      }

      if (!result.isBrandCompatible) {
        toast.error(result.message || 'Bạn không phải là hội viên của thương hiệu này.');
        return;
      }

      const responseData = result.data;
      if (!responseData) {
        throw new Error('Không có thông tin membership');
      }

      if (responseData.status === 'inactive') {
        toast.error('Tài khoản của bạn đang bị cấm');
        return;
      }

      setVerifiedMembershipId(responseData.membershipId);
      setFullName(responseData.fullName);
      setIsMember(true);
      setVerifyMemberMessage('Xác thực thành công!');
      toast.success(`Chào mừng ${responseData.fullName}!`);

    } catch (e) {
      console.error('Error verifying membership:', e);
      const errorMessage = (e as { message?: string })?.message || 'Xác thực thất bại';
      setVerifyMemberStatus('error');
      setVerifyMemberMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setVerifyingMember(false);
    }
  };

  const handleJoinMatch = async () => {
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên.');
      return;
    }

    setIsCreatingMatch(true);

    try {
      if (roomCode) {
        try {
          const joinResult = await userMatchService.joinMatch({
            matchCode: roomCode,
            teamIndex: selectedTeam,
            joinerInfo: { 
              guestName: fullName.trim(),
              membershipId: isMember ? verifiedMembershipId : undefined,
              membershipName: isMember ? fullName.trim() : undefined,
            },
          });
          
          const joinData = joinResult as any;
          
          let newSessionToken = '';
          
          if (joinData?.success) {
            newSessionToken = joinData.userSessionToken || '';
            

          }
          
          if (!newSessionToken) {
            newSessionToken = sessionToken || '';
          }

          const matchInfo = await userMatchService.getMatchByCode(roomCode) as { data?: { matchId?: string; id?: string } };
          const responseData = matchInfo?.data || matchInfo;
          const matchData = responseData as { matchId?: string; id?: string };
          const matchId =
            matchData?.matchId || matchData?.id || '';

          if (matchId && newSessionToken) {
            setIdentity(matchId, {
              membershipId: isMember ? verifiedMembershipId : undefined,
              guestName: isMember ? undefined : fullName.trim(),
              fullName: fullName.trim(),
            });
            
            setSession(matchId, {
              sessionToken: newSessionToken,
              role: 'participant'
            });
            
          }

          toast.success('Tham gia phòng thành công!');

          const params = new URLSearchParams({
            table: tableNumber || '??',
            room: roomCode,
            name: fullName.trim(),
            matchId: matchId,
            membershipId: isMember ? verifiedMembershipId : '',
            membershipName: isMember ? fullName.trim() : ''
          });

          if (newSessionToken) {
            params.set('sessionToken', newSessionToken);
          }

          router.push(`/user/match/lounge?${params.toString()}`);
          return;
        } catch {
        }
      }

      const mockTableId = tableId || 'TB-1755160186911';
      const payload = {
        tableId: mockTableId,
        gameType: 'pool-8' as const,
        createdByMembershipId: isMember ? verifiedMembershipId : undefined,
        isAiAssisted: false,
        teams: [
          {
            teamName: 'Team A',
            members: selectedTeam === 0 ? [{
              guestName: fullName.trim(),
              membershipId: isMember ? verifiedMembershipId : undefined,
              membershipName: isMember ? fullName.trim() : undefined,
            }] : [],
          },
          {
            teamName: 'Team B',
            members: selectedTeam === 1 ? [{
              guestName: fullName.trim(),
              membershipId: isMember ? verifiedMembershipId : undefined,
              membershipName: isMember ? fullName.trim() : undefined,
            }] : [],
          },
        ],
      };

      const data = await userMatchService.createMatch(payload) as { data?: { matchId?: string; id?: string; matchCode?: string; code?: string; sessionToken?: string } };

      const responseData = data?.data || data;
      const matchData = responseData as { matchId?: string; id?: string; matchCode?: string; code?: string; sessionToken?: string };
      let newMatchId =
        matchData?.matchId || matchData?.id || '';

      const code =
        matchData?.matchCode || matchData?.code || '';

      const newSessionToken = matchData?.sessionToken || null;

      if (!newMatchId && code) {
        try {
          const byCode = await userMatchService.getMatchByCode(code) as { data?: { id?: string; matchId?: string } };
          newMatchId =
            byCode?.data?.id || byCode?.data?.matchId || '';
        } catch { }
      }

      if (newMatchId && newSessionToken) {
        setIdentity(newMatchId, {
          membershipId: isMember ? verifiedMembershipId : undefined,
          guestName: isMember ? undefined : fullName.trim(),
          fullName: fullName.trim(),
        });
        
        setSession(newMatchId, {
          sessionToken: newSessionToken,
          role: 'participant'
        });
        
      }

      toast.success('Tạo phòng thành công!');

      const params = new URLSearchParams({
        table: tableNumber || '??',
        code: code,
        matchId: newMatchId,
        name: fullName.trim(),
        tableId: tableId || mockTableId,
        membershipId: isMember ? verifiedMembershipId : '',
        membershipName: isMember ? fullName.trim() : ''
      });

      if (newSessionToken) {
        params.set('sessionToken', newSessionToken);
      }

      router.push(`/user/match/lobby?${params.toString()}`);
    } catch {
      toast.error('Bạn đã tham gia trận đấu này rồi.');
    } finally {
      setIsCreatingMatch(false);
      setShowTeamPopup(false);
    }
  };

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser showBack={true} />

      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">
            {tableNumber || '...'} - {tableInfo?.category ? tableInfo.category.toUpperCase() : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
          </h1>
          <p className="text-sm sm:text-base text-[#000000] font-medium">
            Nhập tên để tham gia phòng {roomCode || '...'}
          </p>
        </div>

        <div className="flex-1 flex justify-center mt-25">
          <div className="w-full max-w-sm space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-1 text-center">
                Họ và Tên
              </label>
              <input
                type="text"
                placeholder="Nhập họ và tên ..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-[#000000] rounded-xl px-5 py-3 text-base w-full text-[#000000] text-center font-medium placeholder-[#000000]/60 focus:outline-none focus:border-[#8ADB10] hover:border-lime-400 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-1 text-center">
                Số Điện Thoại
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nhập số điện thoại ..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border border-[#000000] rounded-xl px-5 py-3 text-base w-full text-black text-center font-medium placeholder-[#000000]/60 focus:outline-none focus:border-[#8ADB10] hover:border-lime-400 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleVerifyMembership}
                  disabled={verifyingMember}
                  className="w-full py-3 px-4 rounded-xl bg-[#8ADB10] hover:bg-lime-600 disabled:bg-gray-300 text-[#FFFFFF] font-semibold text-sm"
                >
                  {verifyingMember ? 'Đang xác thực...' : 'Xác thực'}
                </button>
              </div>
              {verifyMemberStatus !== 'idle' && (
                <p
                  className={`mt-2 text-center text-sm ${verifyMemberStatus === 'success' ? 'text-green-600' : 'text-[#FF0000]'
                    }`}
                >
                  {verifyMemberMessage}
                </p>
              )}
            </div>

            <p className="text-sm text-[#FF0000] font-medium text-center">
              * Nếu chưa có mã hội viên, hãy liên hệ nhân viên để đăng ký!
            </p>
          </div>
        </div>
      </main>

      <FooterButton>
        <button
          onClick={() => setShowTeamPopup(true)}
          className="w-full bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-base sm:text-lg transition"
        >
          Tiếp tục
        </button>
      </FooterButton>

      {showTeamPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg text-center">
            <h2 className="text-xl font-bold text-[#000000] mb-6">
              Chọn đội để tham gia
            </h2>

            <div className="space-y-4 mb-6">
              <button
                onClick={() => setSelectedTeam(0)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${selectedTeam === 0
                    ? 'border-[#8ADB10] bg-lime-50 text-lime-700'
                    : 'border-gray-200 hover:border-[#8ADB10]'
                  }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-[#000000]">Đội A</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedTeam(1)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${selectedTeam === 1
                    ? 'border-[#8ADB10] bg-lime-50 text-lime-700'
                    : 'border-gray-200 hover:border-[#8ADB10]'
                  }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-[#000000]">Đội B</div>
                </div>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowTeamPopup(false)}
                className="w-full bg-[#FF0000] hover:bg-red-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
              >
                Hủy
              </button>
              <button
                onClick={handleJoinMatch}
                disabled={isCreatingMatch}
                className="w-full bg-[#8ADB10] hover:bg-lime-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base disabled:bg-gray-300"
              >
                {isCreatingMatch ? 'Đang xử lý...' : 'Xác nhận'}
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
