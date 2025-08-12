'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import PopupAiSelection from '@/app/user/popup/popupAiSelection';
import toast from 'react-hot-toast';
import { userMatchService } from '@/lib/userMatchService';

function StartSessionContent() {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifyingMember, setVerifyingMember] = useState(false);
  const [verifyMemberStatus, setVerifyMemberStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verifyMemberMessage, setVerifyMemberMessage] = useState<string>('');
  const [memberId, setMemberId] = useState('');
  const [fullName, setFullName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [tableId, setTableId] = useState('');
  const [tableName, setTableName] = useState('');
  const [verifiedMembershipId, setVerifiedMembershipId] = useState<string>('');
  const [isMember, setIsMember] = useState<boolean>(false);
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [isAiAssisted, setIsAiAssisted] = useState(false);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
 
  useEffect(() => {
    const table = searchParams!.get('table');
    const tId = searchParams!.get('tableId');
    if (table) setTableNumber(table);
    if (tId) setTableId(tId);

    if (!table) setTableNumber('??');
    if (!tId) setTableId('TB-1754380493077');

    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (tableNumber) {
      setTableName(tableNumber);
    }
  }, [tableNumber]);

  useEffect(() => {
    const autoVerifyTable = async () => {
      if (tableId) {
        try {
          const result = await userMatchService.verifyTable({ tableId });
          
          const resultData = result as Record<string, any>;
          
          // Handle both old and new API response structures
          const responseData = resultData?.data || resultData;
          setTableInfo(responseData); // Set tableInfo state
          if (responseData?.tableName) {
            setTableName(responseData.tableName);
          } else if (responseData?.name) {
            setTableName(responseData.name);
          }
          
          toast.success('Chào mừng bạn đến với ScoreLens');
        } catch (error) {
          console.warn('Table verification failed:', error);
        }
      }
    };

    if (tableId) {
      autoVerifyTable();
    }
  }, [tableId]);

  const handleJoin = () => {
    const safeName = fullName.trim() || 'Khách';
    router.push(`/user/guestlogin?table=${tableNumber}&tableId=${tableId}&name=${encodeURIComponent(safeName)}`);
  };

  const handleCreateMatchClick = () => {
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên.');
      return;
    }
    setShowAiPopup(true);
  };

  const handleCreateMatch = async (aiAssisted: boolean) => {
    try {
      setVerifying(true);
      const mockTableId = tableId || 'TB-1754380493077';
      const displayTableName = tableName || tableNumber || '??';
      const payload = {
        tableId: mockTableId,
        gameType: 'pool-8' as const,
        createdByMembershipId: verifiedMembershipId || undefined,
        isAiAssisted: aiAssisted,
        teams: [
          {
            teamName: 'Team A',
            members: verifiedMembershipId ? [] : [{ guestName: fullName.trim() }],
          },
          { teamName: 'Team B', members: [] },
        ],
      };
      const data = (await userMatchService.createMatch(payload)) as Record<string, any>;
      const responseData = data?.data || data;
      let matchId = (responseData?.matchId || responseData?.id || '') as string;
      const code = (responseData?.matchCode || responseData?.code || '') as string;
      
      if (!matchId && code) {
        try {
          const byCode = (await userMatchService.getMatchByCode(code)) as Record<string, any>;
          const byCodeData = byCode?.data || byCode;
          matchId = (byCodeData?.matchId || byCodeData?.id || '') as string;
        } catch {}
      }
      toast.success('Tạo trận đấu thành công');
      const params = new URLSearchParams({ table: displayTableName, tableId: mockTableId });
      if (matchId) params.set('matchId', String(matchId));
      if (code) params.set('code', String(code));
      if (fullName.trim()) params.set('name', fullName.trim());
      router.push(`/user/homerandom?${params.toString()}`);
    } catch (e) {
      console.error(e);
      toast.error('Bàn đang được sử dụng, không thể tạo trận đấu');
    } finally {
      setVerifying(false);
      setShowAiPopup(false);
    }
  };

  const handleVerifyMembership = async () => {
    const phone = memberId.trim();
    if (!phone) {
      setVerifyMemberStatus('error');
      setVerifyMemberMessage('Vui lòng nhập số điện thoại hội viên.');
      return;
    }
    try {
      setVerifyingMember(true);
      setVerifyMemberStatus('idle');
      setVerifyMemberMessage('');
      const res = (await userMatchService.verifyMembership({ phoneNumber: phone })) as Record<string, any>;
      // Handle both old and new API response structures
      const responseData = res?.data || res;
      const info = responseData ?? {};
      const returnedFullName = typeof info.fullName === 'string' ? info.fullName : '';
      if (returnedFullName) setFullName(returnedFullName);
      const returnedMembershipId = typeof info.membershipId === 'string' ? info.membershipId : '';
      const returnedIsMember = typeof res.isMember === 'boolean' ? res.isMember : true;
      if (returnedMembershipId) setVerifiedMembershipId(returnedMembershipId);
      setIsMember(returnedIsMember);
      const display = returnedFullName
        ? `Chào mừng ${returnedFullName}`
        : 'Chào mừng bạn';
      setVerifyMemberStatus('success');
      if (typeof display === 'string') {
        toast.success(`${display}`);
      } else {
        toast.success('Xác thực hội viên thành công');
      }
    } catch (e) {
      setVerifyMemberStatus('error');
      setVerifyMemberMessage('Bạn chưa đăng ký hội viên');
      toast.error('Bạn chưa đăng ký hội viên');
    } finally {
      setVerifyingMember(false);
    }
  };

  if (loading || verifying) return <ScoreLensLoading text={verifying ? 'Đang kiểm tra bàn...' : 'Đang tải...'} />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser showBack={true} />
      
      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Chào mừng bạn đến với ScoreLens
          </h1>
          <p className="text-sm sm:text-base text-black font-medium">
            {tableName ? `${tableName}` : `${tableNumber || '??'}`} - {tableInfo?.category ? tableInfo.category.toUpperCase() : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
          </p>
        </div>

        <div className="flex-1 flex justify-center mt-25">
          <div className="w-full max-w-sm space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold text-black mb-1 text-center">
                Họ và Tên
              </label>
              <input
                type="text"
                placeholder="Nhập họ và tên ..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-black rounded-xl px-5 py-3 text-base w-full text-black text-center font-medium placeholder-black/60 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1 text-center">
                Mã Hội Viên
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nhập mã hội viên ..."
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="border border-black rounded-xl px-5 py-3 text-base w-full text-black text-center font-medium placeholder-black/60 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleVerifyMembership}
                  disabled={verifyingMember}
                  className="w-full py-3 px-4 rounded-xl bg-lime-500 hover:bg-lime-600 disabled:bg-gray-300 text-white font-semibold text-sm"
                >
                  {verifyingMember ? 'Đang xác thực...' : 'Xác thực'}
                </button>
              </div>
              {verifyMemberStatus !== 'idle' && (
                <p
                  className={`mt-2 text-center text-sm ${
                    verifyMemberStatus === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {verifyMemberMessage}
                </p>
              )}
            </div>

            <p className="text-sm text-red-500 font-medium text-center">
              * Nếu chưa có mã hội viên, hãy liên hệ nhân viên để đăng ký!
            </p>
          </div>
        </div>
      </main>
      
      <FooterButton>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <button
            onClick={handleJoin}
            className="w-full flex items-center justify-center bg-[#8ADB10] hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            Tham gia
          </button>
          <button
            onClick={handleCreateMatchClick}
            className="w-full flex items-center justify-center bg-[#8ADB10] hover:bg-[#8ADB10] text-white font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            Tạo trận đấu
          </button>
        </div>
      </FooterButton>

      {showAiPopup && (
        <PopupAiSelection
          onClose={() => setShowAiPopup(false)}
          onConfirm={handleCreateMatch}
          isAiAssisted={isAiAssisted}
          setIsAiAssisted={setIsAiAssisted}
          isCreating={verifying}
        />
      )}
    </div>
  );
}

export default function StartSessionPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải..." />}>
      <StartSessionContent />
    </Suspense>
  );
}
