'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import toast from 'react-hot-toast';
import { userMatchService } from '@/lib/userMatchService';

function GuestJoinContent() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [tableId, setTableId] = useState('');
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [roomCode, setRoomCode] = useState('');
  const [matchId, setMatchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifyingMember, setVerifyingMember] = useState(false);
  const [verifyMemberStatus, setVerifyMemberStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verifyMemberMessage, setVerifyMemberMessage] = useState('');
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<0 | 1>(0);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [verifiedMembershipId, setVerifiedMembershipId] = useState('');
  const [isMember, setIsMember] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams!.get('table');
    const room = searchParams!.get('room');
    const mId = searchParams!.get('matchId');
    const tId = searchParams!.get('tableId');
    if (table) setTableNumber(table);
    if (room) setRoomCode(room);
    if (mId) setMatchId(mId);
    if (tId) setTableId(tId);

    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (tableId) {
      const loadTableInfo = async () => {
        try {
          const tableData = await userMatchService.verifyTable({ tableId });
          const responseData = (tableData as any)?.data || tableData;
          setTableInfo(responseData);
        } catch (error) {
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
      setVerifyMemberStatus('error');
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
        setVerifyMemberStatus('error');
        toast.error('Bạn chưa đăng ký hội viên');
        return;
      }

      if (!result.isBrandCompatible) {
        setVerifyMemberStatus('error');
        toast.error(result.message || 'Bạn không phải là hội viên của thương hiệu này.');
        return;
      }

      const responseData = result.data;
      if (!responseData) {
        throw new Error('Không có thông tin membership');
      }
      
      if (responseData.status === 'inactive') {
        setVerifyMemberStatus('error');
        toast.error('Tài khoản của bạn đang bị cấm');
        return;
      }
      
      const membershipFullName = responseData.fullName || '';
      const membershipId = responseData.membershipId || '';
      setFullName(membershipFullName);
      setVerifiedMembershipId(membershipId);
      setIsMember(true);
      setVerifyMemberStatus('success');
      toast.success(`Chào mừng ${membershipFullName} đến với ScoreLens`);
    } catch (error: any) {
      setVerifyMemberStatus('error');
      const errorMessage = error?.message || 'Bạn chưa đăng ký hội viên';
      setVerifyMemberMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setVerifyingMember(false);
    }
  };

  const handleContinue = () => {
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên.');
      return;
    }
    setShowTeamPopup(true);
  };

  const handleTeamSelection = async () => {
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên.');
      return;
    }

    setIsCreatingMatch(true);

    try {
      if (roomCode) {
        try {
          const joinRes = await userMatchService.joinMatch({
            matchCode: roomCode,
            teamIndex: selectedTeam,
            joinerInfo: { guestName: fullName.trim() },
          }) as Record<string, any>;

          const guestToken = 
            (joinRes as any)?.guestToken || 
            (joinRes as any)?.token || 
            (joinRes as any)?.data?.guestToken || 
            (joinRes as any)?.data?.token || '';

          const matchInfo = await userMatchService.getMatchByCode(roomCode) as Record<string, any>;
          const responseData = matchInfo?.data || matchInfo;
          const matchId = 
            responseData?.matchId || responseData?.id || '';

          toast.success('Tham gia phòng thành công!');
          
          const params = new URLSearchParams({
            table: tableNumber || '??',
            room: roomCode,
            name: fullName.trim(),
            matchId: matchId
          });
          
          router.push(`/user/guestjoin?${params.toString()}`);
          return; 
                 } catch (joinError) {
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
            members: selectedTeam === 0 ? [{ guestName: fullName.trim() }] : [],
          },
          {
            teamName: 'Team B',
            members: selectedTeam === 1 ? [{ guestName: fullName.trim() }] : [],
          },
        ],
      };

      const data = await userMatchService.createMatch(payload) as Record<string, any>;
      
      const responseData = data?.data || data;
      let newMatchId = 
        responseData?.matchId || responseData?.id || '';
      
      const code = 
        responseData?.matchCode || responseData?.code || '';

      if (!newMatchId && code) {
        try {
          const byCode = await userMatchService.getMatchByCode(code) as Record<string, any>;
          newMatchId = 
            byCode?.id || byCode?.matchId || byCode?.data?.id || 
            byCode?.data?.matchId || byCode?.match?.id || byCode?.match?.matchId || '';
        } catch {}
      }

      toast.success('Tạo phòng thành công!');
      
      const params = new URLSearchParams({
        table: tableNumber || '??',
        code: code,
        matchId: newMatchId,
        name: fullName.trim(),
        tableId: tableId || mockTableId  
      });
      
      router.push(`/user/guestjoin?${params.toString()}`);
         } catch (error) {
       toast.error('Có lỗi xảy ra, vui lòng thử lại.');
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
                  className={`mt-2 text-center text-sm ${
                    verifyMemberStatus === 'success' ? 'text-green-600' : 'text-[#FF0000]'
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
          onClick={handleContinue}
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
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedTeam === 0 
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
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedTeam === 1 
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
                onClick={handleTeamSelection}
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
