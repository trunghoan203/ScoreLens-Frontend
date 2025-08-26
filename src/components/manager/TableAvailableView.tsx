import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TableStatusBadge from './TableStatusBadge';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from '@/lib/axios';
import { useI18n } from '@/lib/i18n/provider';

interface TableAvailableViewProps {
  table: { id: string; name: string; category?: string };
  onReady: (teamA: Array<{ guestName?: string; phoneNumber?: string; membershipId?: string; membershipName?: string }>, teamB: Array<{ guestName?: string; phoneNumber?: string; membershipId?: string; membershipName?: string }>) => void;
  loading?: boolean;
  teamA?: string[];
  teamB?: string[];
  isEditing?: boolean;
  onBack?: () => void;
  elapsedTime?: string;
  activeMatchId?: string | null;
}

export default function TableAvailableView({ table, onReady, loading = false, teamA: initialTeamA, teamB: initialTeamB, isEditing = false, onBack, elapsedTime, activeMatchId }: TableAvailableViewProps) {
  const { t } = useI18n();
  const [teamA, setTeamA] = useState<string[]>(initialTeamA && initialTeamA.length > 0 ? initialTeamA : ['']);
  const [teamB, setTeamB] = useState<string[]>(initialTeamB && initialTeamB.length > 0 ? initialTeamB : ['']);
  const [teamAMembershipInfo, setTeamAMembershipInfo] = useState<Map<string, { membershipId: string; membershipName: string }>>(new Map());
  const [teamBMembershipInfo, setTeamBMembershipInfo] = useState<Map<string, { membershipId: string; membershipName: string }>>(new Map());
  const router = useRouter();

  useEffect(() => {
    if (initialTeamA && initialTeamA.length > 0) {
      setTeamA(initialTeamA);
    }
    if (initialTeamB && initialTeamB.length > 0) {
      setTeamB(initialTeamB);
    }
  }, [initialTeamA, initialTeamB]);

  const loadMembershipInfo = useMemo(() => {
    return async () => {
      if (isEditing && activeMatchId) {
        try {
          const matchResponse = await axios.get(`/manager/matches/${activeMatchId}`);
          const matchData = matchResponse.data as any;

          if (matchData.success && matchData.data?.teams) {
            const newTeamAMembershipInfo = new Map();
            const newTeamBMembershipInfo = new Map();

            // Process Team A
            if (matchData.data.teams[0]?.members) {
              matchData.data.teams[0].members.forEach((member: any) => {
                if (member.membershipId && member.membershipName) {
                  newTeamAMembershipInfo.set(member.membershipName.trim().toLowerCase(), {
                    membershipId: member.membershipId,
                    membershipName: member.membershipName
                  });
                }
              });
            }

            // Process Team B
            if (matchData.data.teams[1]?.members) {
              matchData.data.teams[1].members.forEach((member: any) => {
                if (member.membershipId && member.membershipName) {
                  newTeamBMembershipInfo.set(member.membershipName.trim().toLowerCase(), {
                    membershipId: member.membershipId,
                    membershipName: member.membershipName
                  });
                }
              });
            }

            setTeamAMembershipInfo(newTeamAMembershipInfo);
            setTeamBMembershipInfo(newTeamBMembershipInfo);
          }
        } catch (error) {
          console.error('Error loading membership info:', error);
        }
      }
    };
  }, [isEditing, activeMatchId]);

  useEffect(() => {
    loadMembershipInfo();
  }, [loadMembershipInfo]);

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
      toast.error(t('manager.tableAvailable.cannotAddMorePlayers'), {
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444'
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

  const handleReady = async () => {
    try {
      const processedTeamA = [];
      const processedTeamB = [];

      if (isEditing) {
        for (const player of teamA) {
          if (player.trim()) {
            const playerKey = player.trim().toLowerCase();
            const existingMember = teamAMembershipInfo.get(playerKey);

            if (existingMember) {
              processedTeamA.push({
                membershipId: existingMember.membershipId,
                membershipName: existingMember.membershipName
              });
            } else if (player.length >= 10 && /^\d+$/.test(player)) {
              processedTeamA.push({ phoneNumber: player });
            } else {
              processedTeamA.push({ guestName: player });
            }
          }
        }

        for (const player of teamB) {
          if (player.trim()) {
            const playerKey = player.trim().toLowerCase();
            const existingMember = teamBMembershipInfo.get(playerKey);

            if (existingMember) {
              processedTeamB.push({
                membershipId: existingMember.membershipId,
                membershipName: existingMember.membershipName
              });
            } else if (player.length >= 10 && /^\d+$/.test(player)) {
              processedTeamB.push({ phoneNumber: player });
            } else {
              processedTeamB.push({ guestName: player });
            }
          }
        }
      } else {
        for (const player of teamA) {
          if (player.trim()) {
            if (player.length >= 10 && /^\d+$/.test(player)) {
              processedTeamA.push({ phoneNumber: player });
            } else {
              processedTeamA.push({ guestName: player });
            }
          }
        }

        for (const player of teamB) {
          if (player.trim()) {
            if (player.length >= 10 && /^\d+$/.test(player)) {
              processedTeamB.push({ phoneNumber: player });
            } else {
              processedTeamB.push({ guestName: player });
            }
          }
        }
      }

      const totalPlayers = processedTeamA.length + processedTeamB.length;
      if (totalPlayers === 0) {
        toast.error(t('manager.tableAvailable.matchNeedsAtLeastOnePlayer'));
        return;
      }

      onReady(processedTeamA, processedTeamB);

    } catch (error) {
      console.error('Error processing teams:', error);
      toast.error(t('manager.tableAvailable.errorProcessingTeams'));
    }
  };

  return (
    <div className="border border-lime-200 rounded-lg p-4 sm:p-6 lg:p-8 bg-[#FFFFFF] mx-auto text-[#000000]">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold">{isEditing ? t('manager.tableAvailable.editMatch') : t('manager.tableAvailable.createMatch')}</h2>
        <TableStatusBadge status={isEditing ? "using" : "available"} />
      </div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">{table.name}</h3>
        {table.category && <p className="text-lg text-gray-600 mt-2">{table.category}</p>}
      </div>
      <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6">
        <div>
          <div className="font-semibold mb-3 sm:mb-4 text-center text-sm sm:text-base">{t('manager.tableAvailable.teamA')}</div>
          {teamA.map((player, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={player}
                onChange={e => handleChange('A', idx, e.target.value)}
                placeholder={`${t('manager.tableAvailable.player')} ${idx + 1}`}
                disabled={loading}
                className="text-sm sm:text-base"
              />
              {idx === 0 ? (
                <Button size="icon" variant="ghost" onClick={() => handleAddPlayer('A')} disabled={loading} className="hover:bg-transparent p-1 sm:p-2">
                  <Image src="/icon/plus-circle.svg" width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6" alt={t('manager.tableAvailable.addPlayer')} />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => handleRemovePlayer('A', idx)} disabled={loading} className="hover:bg-transparent p-1 sm:p-2">
                  <Image src="/icon/trash-2.svg" width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6" alt={t('manager.tableAvailable.removePlayer')} />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center lg:flex-col lg:justify-center font-bold text-lg sm:text-xl lg:text-2xl my-2 lg:my-0">VS</div>
        <div>
          <div className="font-semibold mb-3 sm:mb-4 text-center text-sm sm:text-base">{t('manager.tableAvailable.teamB')}</div>
          {teamB.map((player, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={player}
                onChange={e => handleChange('B', idx, e.target.value)}
                placeholder={`${t('manager.tableAvailable.player')} ${idx + 1}`}
                disabled={loading}
                className="text-sm sm:text-base"
              />
              {idx === 0 ? (
                <Button size="icon" variant="ghost" onClick={() => handleAddPlayer('B')} disabled={loading} className="hover:bg-transparent p-1 sm:p-2">
                  <Image src="/icon/plus-circle.svg" width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6" alt={t('manager.tableAvailable.addPlayer')} />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => handleRemovePlayer('B', idx)} disabled={loading} className="hover:bg-transparent p-1 sm:p-2">
                  <Image src="/icon/trash-2.svg" width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6" alt={t('manager.tableAvailable.removePlayer')} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {isEditing && elapsedTime && (
        <div className="text-center mb-4 sm:mb-6 text-base sm:text-lg font-mono">{elapsedTime}</div>
      )}
      <div className="flex flex-col sm:flex-row w-full justify-center gap-3 sm:gap-4">
        <button
          type="button"
          className="w-full sm:w-32 lg:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-3 sm:order-1"
          onClick={isEditing && onBack ? onBack : () => router.push('/manager/dashboard')}
        >
          {t('manager.tableAvailable.back')}
        </button>
        <button
          type="button"
          onClick={handleReady}
          disabled={loading}
          className="w-full sm:w-32 lg:w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-1 sm:order-2"
        >
          {loading ? t('manager.tableAvailable.creating') : isEditing ? t('manager.tableAvailable.saveChanges') : t('manager.tableAvailable.ready')}
        </button>
      </div>
    </div>
  );
} 