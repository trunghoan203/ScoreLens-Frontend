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
  const [verifiedMembershipId, setVerifiedMembershipId] = useState<string>('');
  const [, setIsMember] = useState<boolean>(false);
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [isAiAssisted, setIsAiAssisted] = useState(false);
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableName, setTableName] = useState<string | null>(null);
  const [tableCategory, setTableCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function để format category của bàn
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
    const initializePageFromUrl = async () => {
      const idFromUrl = searchParams.get('tableId');
      const nameFromUrl = searchParams.get('tableName');

      if (!idFromUrl) {
        console.error("Không tìm thấy tableId trên URL.");
        toast.error("URL không hợp lệ, vui lòng quét lại mã QR.");
        setLoading(false);
        return;
      }

      setTableId(idFromUrl);
      if (nameFromUrl) {
        setTableName(decodeURIComponent(nameFromUrl));
      }

      try {
        const result = await userMatchService.verifyTable({ tableId: idFromUrl });
        const responseData = (result as any)?.data || result;

        if (responseData && responseData.name) {
          setTableName(responseData.name);
          setTableCategory(responseData.category || 'Không rõ');
          toast.success(`Chào mừng bạn đến ${responseData.name}`);
        } else {
          throw new Error("Dữ liệu bàn nhận về không hợp lệ");
        }
      } catch (error: any) {
        console.error('Xác thực bàn thất bại:', error);
        const message = error?.response?.data?.message || 'Không thể xác thực bàn. Vui lòng thử lại.';
        toast.error(message);
        setTableId(null);
      } finally {
        setLoading(false);
      }
    };

    initializePageFromUrl();

  }, [searchParams]);

  const handleJoin = () => {
    const safeName = fullName.trim() || 'Khách';
    router.push(`/user/guestlogin?table=${tableName}&tableId=${tableId}&name=${encodeURIComponent(safeName)}`);
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
      const displayTableName = tableName || '??';

      // Sử dụng tableCategory thực tế, fallback về pool-8 nếu không có
      const gameType = (tableCategory === 'carom' ? 'carom' : 'pool-8') as 'carom' | 'pool-8';

      const payload = {
        tableId: mockTableId,
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
      const data = (await userMatchService.createMatch(payload)) as Record<string, any>;
      const responseData = data?.data || data;
      let matchId = (responseData?.matchId || responseData?.id || '') as string;
      const code = (responseData?.matchCode || responseData?.code || '') as string;

      if (!matchId && code) {
        try {
          const byCode = (await userMatchService.getMatchByCode(code)) as Record<string, any>;
          const byCodeData = byCode?.data || byCode;
          matchId = (byCodeData?.matchId || byCodeData?.id || '') as string;
        } catch { }
      }
      toast.success('Tạo trận đấu thành công');
      const params = new URLSearchParams({ table: displayTableName, tableId: mockTableId });
      if (matchId) params.set('matchId', String(matchId));
      if (code) params.set('code', String(code));
      if (fullName.trim()) params.set('name', fullName.trim());
      if (tableCategory) params.set('category', tableCategory);
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

      if (!res || typeof res !== 'object') {
        throw new Error('Response không hợp lệ');
      }

      if (res.success === false) {
        throw new Error(res.message || 'Xác thực thất bại');
      }

      if (res.isMember === false) {
        setVerifyMemberStatus('error');
        toast.error('Bạn chưa đăng ký hội viên');
        return;
      }

      const responseData = res?.data || res;
      const info = responseData ?? {};

      if (info?.status === 'inactive') {
        setVerifyMemberStatus('error');
        setVerifyMemberMessage('Tài khoản của bạn đang bị cấm');
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
      setVerifyMemberStatus('success');

      const display = returnedFullName
        ? `Chào mừng ${returnedFullName}`
        : 'Chào mừng bạn';

      toast.success(display);

    } catch (e: any) {
      console.error('Error verifying membership:', e);
      setVerifyMemberStatus('error');
      const errorMessage = e?.message || 'Bạn chưa đăng ký hội viên';
      setVerifyMemberMessage(errorMessage);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">
            Chào mừng bạn đến với ScoreLens
          </h1>
          <p className="text-sm sm:text-base text-[#000000] font-medium">
            {tableName ? `${tableName}` : `'??'`} - {tableCategory ? formatTableCategory(tableCategory) : 'Đang tải...'}
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
                Mã Hội Viên
              </label>
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
                <p
                  className={`mt-2 text-center text-sm ${verifyMemberStatus === 'success' ? 'text-green-600' : 'text-red-600'
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
