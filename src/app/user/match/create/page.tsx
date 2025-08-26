'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import AiSelection from '@/components/user/AiSelection';
import toast from 'react-hot-toast';
import { userMatchService } from '@/lib/userMatchService';
import { setIdentity, setSession } from '@/lib/session';
import { useI18n } from '@/lib/i18n/provider';

interface CameraInfo {
  cameraId?: string;
  IPAddress?: string;
  username?: string;
  password?: string;
  port?: string;
  isConnect?: boolean;
  hasCamera?: boolean;
  rtspUrl?: string;
}

interface TableData {
  name?: string;
  category?: string;
  clubId?: string;
  camera?: CameraInfo;
}

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
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const [tableInfo, setTableInfo] = useState<TableData & { tableId?: string } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

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
    const sessionToken = searchParams!.get('sessionToken');
    if (table) setTableName(table);
    if (tId) setTableId(tId);
    if (sessionToken) setSessionToken(sessionToken);

    if (!table) setTableName('??');
    if (!tId) setTableId('TB-1755160186911');
  }, [searchParams]);

  useEffect(() => {
    const initializePageFromUrl = async () => {
      if (!searchParams) return;

      const idFromUrl = searchParams.get('tableId');
      const nameFromUrl = searchParams.get('tableName');
      const categoryFromUrl = searchParams.get('category');
      const sessionToken = searchParams.get('sessionToken');

      if (!idFromUrl) {
        console.error(t('userMatch.create.error.noTableId'));
        toast.error(t('userMatch.create.error.invalidUrl'));
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

      if (sessionToken) {
        setSessionToken(sessionToken);
      }

      try {
        const result = await userMatchService.verifyTable({ tableId: idFromUrl });
        const responseData = (result as { data?: TableData })?.data || result;
        const tableData = responseData as TableData;

        if (tableData && tableData.name) {
          setTableName(tableData.name);
          setTableCategory(tableData.category || categoryFromUrl || 'pool-8');

          setTableInfo(tableData);

        } else {
          if (!tableName) {
            setTableName(t('userMatch.create.tableInfo'));
          }
          if (!tableCategory) {
            setTableCategory('pool-8');
          }
        }
      } catch (e) {
        console.error('Error verifying table:', e);
        toast.error(t('userMatch.create.error.cannotVerifyTable'));
      } finally {
        setLoading(false);
      }
    };

    initializePageFromUrl();

  }, [searchParams, tableCategory, tableName]);

  const handleJoin = () => {
    const safeName = fullName.trim() || t('common.guest');
    const params = new URLSearchParams({
      table: tableName || t('userMatch.create.tableInfo'),
      tableId: tableId || '',
      name: encodeURIComponent(safeName)
    });

    if (sessionToken) {
      params.set('sessionToken', sessionToken);
    }

    router.push(`/user/match/entry?${params.toString()}`);
  };

  const handleCreateMatchClick = () => {
    if (!fullName.trim()) {
      toast.error(t('userMatch.create.error.noFullName'));
      return;
    }
    setShowAiPopup(true);
  };

  const handleCreateMatch = async (aiAssisted: boolean) => {
    try {
      setVerifying(true);

      if (!tableId) {
        toast.error(t('userMatch.create.error.noTableInfo'));
        return;
      }

      const displayTableName = tableName || t('userMatch.create.tableInfo');
      const gameType = (tableCategory === 'carom' ? 'carom' : 'pool-8') as 'carom' | 'pool-8';

      const payload = {
        tableId: tableId,
        gameType,
        createdByMembershipId: verifiedMembershipId || undefined,
        isAiAssisted: aiAssisted,
        teams: [
          {
            teamName: t('userMatch.create.teamNames.teamA'),
            members: verifiedMembershipId ? [] : [{ guestName: fullName.trim() }],
          },
          { teamName: t('userMatch.create.teamNames.teamB'), members: [] },
        ],
      };

      const response = await userMatchService.createMatch(payload);

      const responseData = response as any;

      let matchId = '';
      let code = '';
      let newSessionToken = '';

      if (responseData?.success && responseData?.data) {
        matchId = responseData.data.matchId || responseData.data.id || '';
        code = responseData.data.matchCode || responseData.data.code || '';

        newSessionToken = responseData.hostSessionToken || '';

        if (matchId && newSessionToken) {
          setIdentity(matchId, {
            membershipId: verifiedMembershipId || undefined,
            guestName: verifiedMembershipId ? undefined : fullName.trim(),
            fullName: fullName.trim(),
            actorGuestToken: responseData.creatorGuestToken || undefined
          });

          setSession(matchId, {
            sessionToken: newSessionToken,
            role: 'host'
          });

        }
      }

      if (!newSessionToken) {
        newSessionToken = `ST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      if (!matchId && code) {
        try {
          const byCode = (await userMatchService.getMatchByCode(code)) as { data?: { matchId?: string; id?: string } };
          const byCodeData = byCode?.data || byCode;
          const byCodeMatchData = byCodeData as { matchId?: string; id?: string };
          matchId = (byCodeMatchData?.matchId || byCodeMatchData?.id || '') as string;
        } catch { }
      }

      toast.success(t('userMatch.create.success.matchCreated'));

      const params = new URLSearchParams({
        table: displayTableName,
        tableId: tableId
      });

      if (matchId) params.set('matchId', String(matchId));
      if (code) params.set('code', String(code));
      if (fullName.trim()) params.set('name', fullName.trim());
      if (tableCategory) params.set('category', tableCategory);

      if (newSessionToken) {
        params.set('sessionToken', newSessionToken);
      }

      router.push(`/user/match/lobby?${params.toString()}`);
    } catch (e) {
      console.error(e);
      toast.error(t('userMatch.create.error.tableInUse'));
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
        throw new Error(t('userMatch.create.error.noClubInfo'));
      }

      const res = await userMatchService.verifyMembership({
        phoneNumber: phone,
        clubId: tableInfo.clubId
      });

      if (!res || typeof res !== 'object') {
        throw new Error(t('userMatch.create.error.invalidResponse'));
      }

      if (res.success === false) {
        throw new Error(res.message || t('userMatch.create.error.verificationFailed'));
      }

      if (res.isMember === false) {
        toast.error(t('userMatch.create.error.notMember'));
        return;
      }

      if (!res.isBrandCompatible) {
        toast.error(res.message || t('userMatch.create.error.notBrandCompatible'));
        return;
      }

      const responseData = res?.data || res;
      const info = responseData as {
        fullName?: string;
        membershipId?: string;
        status?: string;
      } ?? {};

      if (info?.status === 'inactive') {
        toast.error(t('userMatch.create.error.accountBanned'));
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

      const display = returnedFullName ? t('userMatch.create.success.welcomeWithName').replace('{name}', returnedFullName) : t('userMatch.create.success.welcome');

      toast.success(display);

    } catch (e) {
      console.error('Error verifying membership:', e);
      const errorMessage = (e as { message?: string })?.message || t('userMatch.create.error.notMember');
      toast.error(errorMessage);
    } finally {
      setVerifyingMember(false);
    }
  };

  if (loading || verifying) return <ScoreLensLoading text={verifying ? t('userMatch.create.checkingTable') : t('common.loading')} />;

  if (!tableId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-red-600">{t('userMatch.create.error.noTableId')}</h1>
        <p>{t('userMatch.create.error.noTableIdDescription')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser showBack={true} />

      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">{t('userMatch.create.title')}</h1>
          <p className="text-sm sm:text-base text-[#000000] font-medium">
            {tableName ? `${tableName}` : t('userMatch.create.tableInfo')} - {tableCategory ? formatTableCategory(tableCategory) : t('userMatch.create.pool8Ball')}
          </p>
        </div>

        <div className="flex-1 flex justify-center mt-25">
          <div className="w-full max-w-sm space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-1 text-center">{t('userMatch.create.fullNameLabel')}</label>
              <input
                type="text"
                placeholder={t('userMatch.create.fullNamePlaceholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-[#000000] rounded-xl px-5 py-3 text-base w-full text-[#000000] text-center font-medium placeholder-[#000000]/60 focus:outline-none focus:border-[#8ADB10] hover:border-lime-400 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-1 text-center">{t('userMatch.create.memberIdLabel')}</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={t('userMatch.create.memberIdPlaceholder')}
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
                  {verifyingMember ? t('userMatch.create.verifying') : t('userMatch.create.verifyButton')}
                </button>
              </div>
              {verifyMemberStatus !== 'idle' && (
                <p className={`mt-2 text-center text-sm ${verifyMemberStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {verifyMemberMessage}
                </p>
              )}
            </div>

            <p className="text-sm text-[#FF0000] font-medium text-center">{t('userMatch.create.memberNote')}</p>
          </div>
        </div>
      </main>

      <FooterButton>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <button
            onClick={handleJoin}
            className="w-full flex items-center justify-center bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            {t('userMatch.create.joinButton')}
          </button>
          <button
            onClick={handleCreateMatchClick}
            className="w-full flex items-center justify-center bg-[#8ADB10] hover:bg-[#8ADB10] text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base transition"
          >
            {t('userMatch.create.createMatchButton')}
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
