'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import AiSelection from '@/components/user/AiSelection';
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
  const [verifiedMembershipId, setVerifiedMembershipId] = useState<string>('');
  const [, setIsMember] = useState<boolean>(false);
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [isAiAssisted, setIsAiAssisted] = useState(false);
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableName, setTableName] = useState<string | null>(null);
  const [tableCategory, setTableCategory] = useState<string | null>(null);

  const [tableInfo, setTableInfo] = useState<{
    name?: string;
    category?: string;
    tableId?: string;
    clubId?: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const formatTableCategory = (category: string): string => {
    switch (category) {
      case 'pool-8':
        return 'Pool 8';
      case 'carom':
        return 'Carom';
      default:
        return category;
    }
  };

  useEffect(() => {
    const table = searchParams!.get('table');
    const tId = searchParams!.get('tableId');
    if (table) setTableName(table);
    if (tId) setTableId(tId);

    if (!table) setTableName('??');
    if (!tId) setTableId('TB-1755160186911');
  }, [searchParams]);

  useEffect(() => {
    const initializePageFromUrl = async () => {
      if (!searchParams) return;

      const idFromUrl = searchParams.get('tableId');
      const nameFromUrl = searchParams.get('tableName');
      const categoryFromUrl = searchParams.get('category');

      if (!idFromUrl) {
        console.error('Không tìm thấy tableId trên URL.');
        toast.error('URL không hợp lệ, vui lòng quét lại mã QR.');
        setLoading(false);
        return;
      }

      setTableId(idFromUrl);

      if (nameFromUrl) {
        setTableName(decodeURIComponent(nameFromUrl));
      }

      if (categoryFromUrl) {
        setTableCategory(categoryFromUrl);
      }

      try {
        const result = await userMatchService.verifyTable({ tableId: idFromUrl });
        const responseData = (result as { data?: { name?: string; category?: string; clubId?: string } })?.data || result;
        const tableData = responseData as { name?: string; category?: string; clubId?: string };

        if (tableData && tableData.name) {
          setTableName(tableData.name);
          setTableCategory(tableData.category || categoryFromUrl || 'pool-8');

          setTableInfo(tableData);

        } else {
          if (!tableName) {
            setTableName('Bàn chơi');
          }
          if (!tableCategory) {
            setTableCategory('pool-8');
          }
        }
      } catch (error) {
        console.error('Xác thực bàn thất bại:', error);

        if (!tableName) {
          setTableName('Bàn chơi');
        }
        if (!tableCategory) {
          setTableCategory('pool-8');
        }

        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xác thực bàn. Vui lòng thử lại.';
        toast.error(message);

      } finally {
        setLoading(false);
      }
    };

    initializePageFromUrl();

  }, [searchParams, tableCategory, tableName]);

  const handleJoin = () => {
    const safeName = fullName.trim() || 'Khách';
    router.push(`/user/match/entry?table=${tableName}&tableId=${tableId}&name=${encodeURIComponent(safeName)}`);
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

      if (!tableId) {
        toast.error('Không tìm thấy thông tin bàn. Vui lòng quét lại mã QR.');
        return;
      }

      const displayTableName = tableName || 'Bàn chơi';
      const gameType = (tableCategory === 'carom' ? 'carom' : 'pool-8') as 'carom' | 'pool-8';

      const payload = {
        tableId: tableId,
        gameType,
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

      const data = (await userMatchService.createMatch(payload)) as { data?: { matchId?: string; id?: string; matchCode?: string; code?: string } };
      const responseData = data?.data || data;
      const matchData = responseData as { matchId?: string; id?: string; matchCode?: string; code?: string };
      let matchId = (matchData?.matchId || matchData?.id || '') as string;
      const code = (matchData?.matchCode || matchData?.code || '') as string;

      if (!matchId && code) {
        try {
          const byCode = (await userMatchService.getMatchByCode(code)) as { data?: { matchId?: string; id?: string } };
          const byCodeData = byCode?.data || byCode;
          const byCodeMatchData = byCodeData as { matchId?: string; id?: string };
          matchId = (byCodeMatchData?.matchId || byCodeMatchData?.id || '') as string;
        } catch { }
      }

      toast.success('Tạo trận đấu thành công');

      const params = new URLSearchParams({
        table: displayTableName,
        tableId: tableId
      });

      if (matchId) params.set('matchId', String(matchId));
      if (code) params.set('code', String(code));
      if (fullName.trim()) params.set('name', fullName.trim());
      if (tableCategory) params.set('category', tableCategory);

      router.push(`/user/match/lobby?${params.toString()}`);
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
      return;
    }
    try {
      setVerifyingMember(true);
      setVerifyMemberStatus('idle');
      setVerifyMemberMessage('');

      if (!tableInfo?.clubId) {
        throw new Error('Không tìm thấy thông tin club');
      }

      const res = await userMatchService.verifyMembership({
        phoneNumber: phone,
        clubId: tableInfo.clubId
      });

      if (!res || typeof res !== 'object') {
        throw new Error('Response không hợp lệ');
      }

      if (res.success === false) {
        throw new Error(res.message || 'Xác thực thất bại');
      }

      if (res.isMember === false) {
        toast.error('Bạn chưa đăng ký hội viên');
        return;
      }

      if (!res.isBrandCompatible) {
        toast.error(res.message || 'Bạn chưa đăng ký hội viên.');
        return;
      }

      const responseData = res?.data || res;
      const info = responseData as {
        fullName?: string;
        membershipId?: string;
        status?: string;
      } ?? {};

      if (info?.status === 'inactive') {
        toast.error('Tài khoản của bạn đang bị cấm');
        return;
      }

      const returnedFullName = typeof info.fullName === 'string' ? info.fullName : '';
      const returnedMembershipId = typeof info.membershipId === 'string' ? info.membershipId : '';

      if (returnedFullName) {
        setFullName(returnedFullName);
      }
      if (returnedMembershipId) {
        setVerifiedMembershipId(returnedMembershipId);
      }

      setIsMember(true);

      const display = returnedFullName ? `Chào mừng ${returnedFullName}` : 'Chào mừng bạn';

      toast.success(display);

    } catch (e) {
      console.error('Error verifying membership:', e);
      const errorMessage = (e as { message?: string })?.message || 'Bạn chưa đăng ký hội viên';
      toast.error(errorMessage);
    } finally {
      setVerifyingMember(false);
    }
  };

  if (loading || verifying) return <ScoreLensLoading text={verifying ? 'Đang kiểm tra bàn...' : 'Đang tải...'} />;

  if (!tableId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-red-600">Lỗi: Không tìm thấy thông tin bàn</h1>
        <p>Vui lòng quét lại mã QR trên bàn để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser showBack={true} />

      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">Chào mừng bạn đến với ScoreLens</h1>
          <p className="text-sm sm:text-base text-[#000000] font-medium">
            {tableName ? `${tableName}` : 'Bàn chơi'} - {tableCategory ? formatTableCategory(tableCategory) : 'Pool 8 Ball'}
          </p>
        </div>

        <div className="flex-1 flex justify-center mt-25">
          <div className="w-full max-w-sm space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-1 text-center">Họ và Tên</label>
              <input
                type="text"
                placeholder="Nhập họ và tên ..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-[#000000] rounded-xl px-5 py-3 text-base w-full text-[#000000] text-center font-medium placeholder-[#000000]/60 focus:outline-none focus:border-[#8ADB10] hover:border-lime-400 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-1 text-center">Mã Hội Viên</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nhập mã hội viên ..."
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="border border-[#000000] rounded-xl px-5 py-3 text-base w-full text-[#000000] text-center font-medium placeholder-[#000000]/60 focus:outline-none focus:border-[#8ADB10] hover:border-lime-400 transition-all duration-200"
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
                <p className={`mt-2 text-center text-sm ${verifyMemberStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {verifyMemberMessage}
                </p>
              )}
            </div>

            <p className="text-sm text-[#FF0000] font-medium text-center">* Nếu chưa có mã hội viên, hãy liên hệ nhân viên để đăng ký!</p>
          </div>
        </div>
      </main>

      <FooterButton>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <button
            onClick={handleJoin}
            className="w-full flex items-center justify-center bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            Tham gia
          </button>
          <button
            onClick={handleCreateMatchClick}
            className="w-full flex items-center justify-center bg-[#8ADB10] hover:bg-[#8ADB10] text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            Tạo trận đấu
          </button>
        </div>
      </FooterButton>

      {showAiPopup && (
        <AiSelection
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
