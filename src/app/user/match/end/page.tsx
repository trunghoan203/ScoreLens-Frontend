'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';
import { userMatchService } from '@/lib/userMatchService';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import toast from 'react-hot-toast';
import Feedback from '@/components/user/Feedback';
import { useI18n } from '@/lib/i18n/provider';

function LoadingFallback() {
  const { t } = useI18n();
  return <ScoreLensLoading text={t('endMatch.end.loading')} />;
}

function EndMatchPageContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const matchId = searchParams?.get('matchId') || '';
  const tableName = searchParams?.get('tableName') || 'Bàn';
  const matchCode = searchParams?.get('matchCode') || '';
  const scoreA = parseInt(searchParams?.get('scoreA') || '0');
  const scoreB = parseInt(searchParams?.get('scoreB') || '0');
  const teamA = searchParams?.get('teamA')?.split(',').filter(name => name.trim()) || [];
  const teamB = searchParams?.get('teamB')?.split(',').filter(name => name.trim()) || [];
  const tableId = searchParams?.get('tableId') || '';
  const sessionToken = searchParams?.get('sessionToken') || '';
  const elapsedTimeFromURL = searchParams?.get('elapsedTime') || '';

  const [matchInfo, setMatchInfo] = useState<{
    data?: {
      teams?: Array<{
        score?: number;
        members?: Array<{
          membershipName?: string;
          guestName?: string;
        }>;
      }>;
      matchCode?: string;
      startTime?: string;
      endTime?: string;
      tableId?: string;
      gameType?: string;
      createdByMembershipId?: string;
      creatorGuestToken?: string;
    };
    teams?: Array<{
      score?: number;
      members?: Array<{
        membershipName?: string;
        guestName?: string;
      }>;
    }>;
    matchCode?: string;
    startTime?: string;
    endTime?: string;
    tableId?: string;
    gameType?: string;
    createdByMembershipId?: string;
    creatorGuestToken?: string;
  } | null>(null);
  const [tableInfo, setTableInfo] = useState<{
    name?: string;
    category?: string;
    clubId?: string;
  } | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>(elapsedTimeFromURL || '00:00:00');
  const [showFeedback, setShowFeedback] = useState(false);

  const [actualScoreA, setActualScoreA] = useState<number>(scoreA);
  const [actualScoreB, setActualScoreB] = useState<number>(scoreB);
  const [actualTeamA, setActualTeamA] = useState<string[]>(teamA);
  const [actualTeamB, setActualTeamB] = useState<string[]>(teamB);
  const [actualTableName, setActualTableName] = useState<string>(tableName);
  const [actualMatchCode, setActualMatchCode] = useState<string>(matchCode);

  const winner = actualScoreA > actualScoreB ? t('endMatch.end.teamA') : actualScoreB > actualScoreA ? t('endMatch.end.teamB') : t('endMatch.end.draw');

  useWebSocket({
    matchId: matchId || null,
    matchStatus: 'completed',
    onTimeUpdate: (elapsedTime: string) => {
      setElapsedTime(elapsedTime);
    },
    onMatchUpdate: (updatedMatch: unknown) => {
      const matchData = updatedMatch as { matchId?: string };
      if (matchData?.matchId === matchId) {
        setMatchInfo((prev) => ({ ...prev, ...matchData }));
      }
    },
    onMatchEnded: (matchData: unknown) => {
      const matchInfo = matchData as { matchId?: string };
      if (matchInfo && matchInfo.matchId === matchId) {
        toast.success(t('endMatch.end.matchEnded'));
      }
    }
  });

  useEffect(() => {
    if (elapsedTimeFromURL) {
      setElapsedTime(elapsedTimeFromURL);
    }

    const loadMatchData = async () => {
      if (matchId) {
        try {
          const matchData = await userMatchService.getMatchById(matchId);
          const responseData = (matchData as { data?: { teams?: Array<{ score?: number; members?: Array<{ membershipName?: string; guestName?: string }> }>; matchCode?: string; startTime?: string; endTime?: string; tableId?: string; gameType?: string; createdByMembershipId?: string; creatorGuestToken?: string } })?.data || matchData;
          const matchInfoData = responseData as { teams?: Array<{ score?: number; members?: Array<{ membershipName?: string; guestName?: string }> }>; matchCode?: string; startTime?: string; endTime?: string; tableId?: string; gameType?: string; createdByMembershipId?: string; creatorGuestToken?: string };

          setMatchInfo(matchInfoData);

          if (matchInfoData?.teams) {
            const teamAScore = matchInfoData.teams[0]?.score ?? actualScoreA;
            const teamBScore = matchInfoData.teams[1]?.score ?? actualScoreB;

            setActualScoreA(teamAScore);
            setActualScoreB(teamBScore);

            if (matchInfoData.teams[0]?.members) {
              const teamAMembers = matchInfoData.teams[0].members.map((member: { membershipName?: string; guestName?: string }) =>
                member.membershipName || member.guestName || ''
              );
              setActualTeamA(teamAMembers);
            }

            if (matchInfoData.teams[1]?.members) {
              const teamBMembers = matchInfoData.teams[1].members.map((member: { membershipName?: string; guestName?: string }) =>
                member.membershipName || member.guestName || ''
              );
              setActualTeamB(teamBMembers);
            }
          }

          if (matchInfoData?.matchCode) {
            setActualMatchCode(matchInfoData.matchCode);
          }

          if (matchInfoData?.tableId) {
            try {
              const tableData = await userMatchService.verifyTable({ tableId: matchInfoData.tableId });
              const tableResponseData = (tableData as { data?: { name?: string; category?: string; clubId?: string } })?.data || tableData;
              const tableInfoData = tableResponseData as { name?: string; category?: string; clubId?: string };
              setTableInfo(tableInfoData);

              if (tableInfoData?.name) {
                setActualTableName(tableInfoData.name);
              }
            } catch {
              console.error('Error loading table info');
            }
          }

          // Fallback: nếu không có elapsedTime từ URL, tính từ startTime/endTime của BE
          if (!elapsedTimeFromURL) {
            const startedAt = matchInfoData?.startTime ? new Date(matchInfoData.startTime) : null;
            const endedAt = matchInfoData?.endTime ? new Date(matchInfoData.endTime) : new Date();
            if (startedAt) {
              const ms = Math.max(0, endedAt.getTime() - startedAt.getTime());
              const hours = Math.floor(ms / 3600000);
              const minutes = Math.floor((ms % 3600000) / 60000);
              const seconds = Math.floor((ms % 60000) / 1000);
              const timeString = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
              setElapsedTime(timeString);
            }
          }
        } catch {
          console.error('Error loading match data');
        }
      }

      setLoading(false);
    };

    loadMatchData();
  }, [matchId, actualScoreA, actualScoreB]);

  const handleRate = () => {
    setShowFeedback(true);
  };

  const handleFeedbackSuccess = () => {
    setShowFeedback(false);
    toast.success(t('endMatch.end.thankYouFeedback'));

    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  if (loading) return <ScoreLensLoading text={t('endMatch.end.loading')} />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser showBack={false} />

      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">
            {actualTableName.toUpperCase()} - {tableInfo?.category ? (tableInfo.category === 'pool-8' ? 'POOL 8' : ` ${tableInfo.category.toUpperCase()}`) : (matchInfo?.gameType === 'pool-8' ? 'POOL 8' : matchInfo?.gameType || 'Pool 8 Ball')}
          </h1>
          <p className="text-sm sm:text-base text-[#000000] font-medium">{t('endMatch.end.title')}</p>

          {sessionToken && (
            <div className="mt-2">
              <span className="text-xs text-gray-500">Session: {sessionToken.substring(0, 8)}...</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-lime-400 text-white rounded-2xl px-8 py-8 space-y-2 shadow-md w-full">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-white mb-2">{t('endMatch.end.joinCode')}</p>
                <div className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 mx-auto inline-block">
                  <div className="flex items-center justify-center gap-2 select-all">
                    {(actualMatchCode || '000000').split('').map((ch, idx) => (
                      <span
                        key={idx}
                        className="w-5 sm:w-6 text-center font-mono tabular-nums font-extrabold text-xl sm:text-2xl text-white leading-none"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex flex-col items-center w-20 flex-shrink-0">
                  <div className="text-4xl font-bold mb-2">{actualScoreA}</div>
                  <p className="text-sm font-semibold">{t('endMatch.end.teamA')}</p>
                  <div className="min-h-[60px] mt-1 text-center space-y-1">
                    {actualTeamA.length > 0 ? (
                      actualTeamA.map((member, index) => (
                        <p key={index} className="text-xs">{member || t('endMatch.end.playerPlaceholder').replace('{index}', (index + 1).toString())}</p>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">{t('endMatch.end.noMembers')}</p>
                    )}
                  </div>
                </div>

                <div className="text-center flex flex-col items-center flex-shrink-0">
                  <div className="text-2xl font-bold mb-2">{t('endMatch.end.vs')}</div>
                  <div className="min-h-[30px] flex items-center justify-center">
                    <div className="text-[#FFFFFF] font-bold text-[#8ADB10]">{elapsedTime}</div>
                  </div>
                </div>

                <div className="text-center flex flex-col items-center w-20 flex-shrink-0">
                  <div className="text-4xl font-bold mb-2">{actualScoreB}</div>
                  <p className="text-sm font-semibold">{t('endMatch.end.teamB')}</p>
                  <div className="min-h-[60px] mt-1 text-center space-y-1">
                    {actualTeamB.length > 0 ? (
                      actualTeamB.map((member, index) => (
                        <p key={index} className="text-xs">{member || t('endMatch.end.playerPlaceholder').replace('{index}', (index + 1).toString())}</p>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">{t('endMatch.end.noMembers')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#000000]">{t('endMatch.end.matchInfo')}</h2>
                <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-lime-600" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('endMatch.end.playTime')}:</span>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-lime-600" />
                    <span className="text-sm font-medium text-[#000000]">{elapsedTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('endMatch.end.playerCount')}:</span>
                  <span className="text-sm font-medium text-[#000000]">
                    {actualTeamA.length + actualTeamB.length} {t('endMatch.end.people')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('endMatch.end.gameType')}:</span>
                  <span className="text-sm font-medium text-[#000000]">
                    {tableInfo?.category ? tableInfo.category.toUpperCase() : (matchInfo?.gameType === 'pool-8' ? 'Pool 8 Ball' : matchInfo?.gameType || 'Pool 8 Ball')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('endMatch.end.winningTeam')}:</span>
                  <span className="text-sm font-medium text-[#8ADB10] font-bold">
                    {winner !== t('endMatch.end.draw') ? winner : t('endMatch.end.draw')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-6 mb-20">
          <p className="text-[#000000] text-base sm:text-lg font-medium leading-relaxed">
            {t('endMatch.end.thankYou')} <br />
            <span className="font-bold text-xl text-[#8ADB10]">ScoreLens!</span>
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <div className="flex gap-3">
            <Button
              onClick={() => {
                router.push('/');
              }}
              className="flex-1 text-[#FFFFFF] bg-red-500 hover:bg-red-600 font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center hover:opacity-90"
            >
              {t('endMatch.end.exit')}
            </Button>
            <Button
              onClick={handleRate}
              className="flex-1 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center bg-lime-500 hover:bg-lime-600 hover:opacity-90"
            >
              {t('endMatch.end.feedback')}
            </Button>
          </div>
        </div>
      </div>

      {showFeedback && (
        <Feedback
          onClose={() => setShowFeedback(false)}
          onSuccess={handleFeedbackSuccess}
          matchId={matchId}
          tableId={tableId || matchInfo?.tableId}
          clubId={tableInfo?.clubId}
          membershipId={matchInfo?.createdByMembershipId}
          guestToken={matchInfo?.creatorGuestToken}
        />
      )}
    </div>
  );
}

export default function EndMatchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EndMatchPageContent />
    </Suspense>
  );
}
