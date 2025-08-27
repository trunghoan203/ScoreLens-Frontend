'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { userMatchService, TeamMembersProps } from '@/lib/userMatchService';
import { useI18n } from '@/lib/i18n/provider';

export default function TeamMembers({ onClose, onSave, initialTeamA, initialTeamB, matchId, actorGuestToken, actorMembershipId, clubId, sessionToken }: TeamMembersProps) {
  const { t } = useI18n();
  const [teamA, setTeamA] = useState<string[]>(initialTeamA && initialTeamA.length > 0 ? initialTeamA : ['']);
  const [teamB, setTeamB] = useState<string[]>(initialTeamB && initialTeamB.length > 0 ? initialTeamB : ['']);
  const [creatorMembershipName, setCreatorMembershipName] = useState<string>('');
  const [teamAMembershipInfo, setTeamAMembershipInfo] = useState<Map<string, { membershipId: string; membershipName: string }>>(new Map());
  const [teamBMembershipInfo, setTeamBMembershipInfo] = useState<Map<string, { membershipId: string; membershipName: string }>>(new Map());

  useEffect(() => {
    const cleanupDuplicates = (team: string[]) => {
      const seen = new Set<string>();
      const cleaned: string[] = [];

      team.forEach(member => {
        if (member.trim() === '') {
          cleaned.push(member);
        } else if (!seen.has(member)) {
          seen.add(member);
          cleaned.push(member);
        }
      });

      return cleaned.length > 0 ? cleaned : [''];
    };

    if (initialTeamA && initialTeamA.length > 0) {
      const cleanedTeamA = cleanupDuplicates(initialTeamA);
      setTeamA(cleanedTeamA);
    }
    if (initialTeamB && initialTeamB.length > 0) {
      const cleanedTeamB = cleanupDuplicates(initialTeamB);
      setTeamB(cleanedTeamB);
    }

    const getCreatorMembershipName = async () => {
      if (matchId && actorMembershipId) {
        try {
          const matchData = await userMatchService.getMatchById(matchId);
          const responseData = (matchData as { data?: { teams?: Array<{ members?: Array<{ membershipId?: string; membershipName?: string }> }> } })?.data || matchData;
          const matchInfoData = responseData as { teams?: Array<{ members?: Array<{ membershipId?: string; membershipName?: string }> }> };

          if (matchInfoData?.teams) {
            const newTeamAMembershipInfo = new Map();
            const newTeamBMembershipInfo = new Map();

            if (matchInfoData.teams[0]?.members) {
              matchInfoData.teams[0].members.forEach((member: any) => {
                if (member.membershipId && member.membershipName) {
                  newTeamAMembershipInfo.set(member.membershipName.trim().toLowerCase(), {
                    membershipId: member.membershipId,
                    membershipName: member.membershipName
                  });
                  if (member.membershipId === actorMembershipId) {
                    setCreatorMembershipName(member.membershipName);
                  }
                }
              });
            }

            if (matchInfoData.teams[1]?.members) {
              matchInfoData.teams[1].members.forEach((member: any) => {
                if (member.membershipId && member.membershipName) {
                  newTeamBMembershipInfo.set(member.membershipName.trim().toLowerCase(), {
                    membershipId: member.membershipId,
                    membershipName: member.membershipName
                  });
                  if (member.membershipId === actorMembershipId) {
                    setCreatorMembershipName(member.membershipName);
                  }
                }
              });
            }

            setTeamAMembershipInfo(newTeamAMembershipInfo);
            setTeamBMembershipInfo(newTeamBMembershipInfo);
          }
        } catch (error) {
        }
      }
    };

    getCreatorMembershipName();
  }, [initialTeamA, initialTeamB, matchId, actorMembershipId]);

  const handleChange = (team: 'A' | 'B', index: number, value: string) => {
    if (team === 'A' && index === 0) {
      return;
    }

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
      toast.error(t('teamMembers.errors.tooManyPlayers'));
      return;
    }
    setter([...current, '']);
  };

  const handleRemovePlayer = (team: 'A' | 'B', index: number) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;

    const playerName = current[index];
    const duplicateCount = current.filter(name => name === playerName).length;

    if (team === 'A' && index === 0 && duplicateCount === 1) {
      toast.error(t('teamMembers.errors.cannotRemoveOnlyOwner'));
      return;
    }

    const updated = [...current];
    updated.splice(index, 1);
    setter(updated);
  };

  const handleSave = async () => {
    if (!matchId) {
      toast.error(t('teamMembers.errors.matchNotFound'));
      return;
    }

    if (!actorGuestToken && !actorMembershipId) {
      toast.error(t('teamMembers.errors.noPermission'));
      return;
    }

    if (!sessionToken || sessionToken.trim() === '') {
      toast.error(t('teamMembers.errors.invalidSessionToken'));
      return;
    }

    if (!clubId) {
      toast.error(t('teamMembers.errors.cannotDetermineClub'));
      return;
    }

    try {
      const validationErrors: string[] = [];
      const membershipUpdates: Array<{ teamIndex: number, memberIndex: number, fullName: string }> = [];
      const guestUpdates: Array<{ teamIndex: number, memberIndex: number, guestName: string }> = [];

      for (let teamIndex = 0; teamIndex < 2; teamIndex++) {
        const team = teamIndex === 0 ? teamA : teamB;
        const teamName = teamIndex === 0 ? t('teamMembers.teamA') : t('teamMembers.teamB');

        for (let memberIndex = 0; memberIndex < team.length; memberIndex++) {
          const memberName = team[memberIndex];
          if (memberName.trim() === '') continue;

          const isPhoneNumber = /^\d+$/.test(memberName.trim());

          if (isPhoneNumber) {
            try {
              const membershipInfo = await userMatchService.verifyMembership({
                phoneNumber: memberName.trim(),
                clubId: clubId
              });

              if (!membershipInfo.success) {
                validationErrors.push(`${teamName} - ${memberName}: ${membershipInfo.message}`);
                continue;
              }

              if (!membershipInfo.isMember) {
                guestUpdates.push({
                  teamIndex,
                  memberIndex,
                  guestName: memberName.trim()
                });
                continue;
              }

              if (!membershipInfo.isBrandCompatible) {
                validationErrors.push(`${teamName} - ${memberName}: ${t('teamMembers.errors.invalidMemberCode')}`);
                continue;
              }

              if (membershipInfo.data?.status === 'inactive') {
                validationErrors.push(`${teamName} - ${memberName}: ${t('teamMembers.errors.accountBanned')}`);
                continue;
              }

              if (membershipInfo.data?.fullName) {
                membershipUpdates.push({
                  teamIndex,
                  memberIndex,
                  fullName: membershipInfo.data.fullName
                });
              }

            } catch (error) {
              guestUpdates.push({
                teamIndex,
                memberIndex,
                guestName: memberName.trim()
              });
            }
          } else {
            guestUpdates.push({
              teamIndex,
              memberIndex,
              guestName: memberName.trim()
            });
          }
        }
      }

      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join('\n');
        toast.error(`${t('teamMembers.errors.validationError')}\n${errorMessage}`);
        return;
      }

      if (membershipUpdates.length > 0) {
        membershipUpdates.forEach(update => {
          if (update.teamIndex === 0) {
            const updatedTeamA = [...teamA];
            updatedTeamA[update.memberIndex] = update.fullName;
            setTeamA(updatedTeamA);
          } else {
            const updatedTeamB = [...teamB];
            updatedTeamB[update.memberIndex] = update.fullName;
            setTeamB(updatedTeamB);
          }
        });
      }
      if (guestUpdates.length > 0) {
        guestUpdates.forEach(update => {
          if (update.teamIndex === 0) {
            const updatedTeamA = [...teamA];
            updatedTeamA[update.memberIndex] = update.guestName;
            setTeamA(updatedTeamA);
          } else {
            const updatedTeamB = [...teamB];
            updatedTeamB[update.memberIndex] = update.guestName;
            setTeamB(updatedTeamB);
          }
        });
      }




      const teams = [
        teamA.filter(name => name.trim() !== '').map(name => {
          const isPhoneNumber = /^\d+$/.test(name.trim());
          if (isPhoneNumber) {
            return { phoneNumber: name.trim() };
          } else {
            const playerKey = name.trim().toLowerCase();
            const existingMember = teamAMembershipInfo.get(playerKey);

            if (existingMember) {
              return {
                membershipId: existingMember.membershipId,
                membershipName: existingMember.membershipName
              };
            } else {
              const isCreatorName = creatorMembershipName && name.trim().toLowerCase() === creatorMembershipName.toLowerCase();
              if (isCreatorName) {
                return { membershipId: actorMembershipId };
              } else {
                return { guestName: name.trim() };
              }
            }
          }
        }),
        teamB.filter(name => name.trim() !== '').map(name => {
          const isPhoneNumber = /^\d+$/.test(name.trim());
          if (isPhoneNumber) {
            return { phoneNumber: name.trim() };
          } else {
            const playerKey = name.trim().toLowerCase();
            const existingMember = teamBMembershipInfo.get(playerKey);

            if (existingMember) {
              return {
                membershipId: existingMember.membershipId,
                membershipName: existingMember.membershipName
              };
            } else {
              const isCreatorName = creatorMembershipName && name.trim().toLowerCase() === creatorMembershipName.toLowerCase();
              if (isCreatorName) {
                return { membershipId: actorMembershipId };
              } else {
                return { guestName: name.trim() };
              }
            }
          }
        })
      ];




      await userMatchService.updateTeamMembersV2(matchId, teams, sessionToken, actorGuestToken || undefined, actorMembershipId || undefined);

      toast.success(t('teamMembers.errors.updateSuccess'));
      setTimeout(() => {
        onSave(teamA, teamB);
        onClose();
      }, 100);
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message || t('teamMembers.errors.updateFailed');
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-bold text-[#000000] mb-6 text-center">
          {t('teamMembers.title')}
        </h2>
        <div className="space-y-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              {t('teamMembers.description')}
            </p>
          </div>

          <div>
            <div className="font-semibold mb-3 text-center text-[#000000] text-lg">{t('teamMembers.teamA')}</div>
            {teamA.map((player, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  value={player}
                  onChange={e => handleChange('A', idx, e.target.value)}
                  placeholder={idx === 0 ? t('teamMembers.roomOwnerPlaceholder') : t('teamMembers.memberOrGuestPlaceholder')}
                  className={`w-full ${idx === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={idx === 0}
                />
                {idx === 0 ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleAddPlayer('A')}
                    className="hover:bg-transparent"
                  >
                    <Image
                      src="/icon/plus-circle.svg"
                      width={25}
                      height={25}
                      alt={t('teamMembers.addPlayer')}
                    />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemovePlayer('A', idx)}
                    className="hover:bg-transparent"
                  >
                    <Image
                      src="/icon/trash-2.svg"
                      width={25}
                      height={25}
                      alt={t('teamMembers.removePlayer')}
                    />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="font-bold text-xl text-gray-400">VS</div>
          </div>

          <div>
            <div className="font-semibold mb-3 text-center text-lg text-[#000000]">{t('teamMembers.teamB')}</div>
            {teamB.map((player, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  value={player}
                  onChange={e => handleChange('B', idx, e.target.value)}
                  placeholder={idx === 0 ? t('teamMembers.roomOwnerPlaceholder') : t('teamMembers.memberOrGuestPlaceholder')}
                  className="w-full"
                />
                {idx === 0 ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleAddPlayer('B')}
                    className="hover:bg-transparent"
                  >
                    <Image
                      src="/icon/plus-circle.svg"
                      width={25}
                      height={25}
                      alt={t('teamMembers.addPlayer')}
                    />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemovePlayer('B', idx)}
                    className="hover:bg-transparent"
                  >
                    <Image
                      src="/icon/trash-2.svg"
                      width={25}
                      height={25}
                      alt={t('teamMembers.removePlayer')}
                    />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="w-1/2 bg-[#FF0000] hover:bg-red-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
          >
            {t('teamMembers.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
          >
            {t('teamMembers.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}
