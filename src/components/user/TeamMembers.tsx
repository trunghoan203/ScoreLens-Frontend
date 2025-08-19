'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { userMatchService, TeamMembersProps } from '@/lib/userMatchService';

export default function TeamMembers({ onClose, onSave, initialTeamA, initialTeamB, matchId, actorGuestToken, actorMembershipId, clubId, sessionToken }: TeamMembersProps) {
  const [teamA, setTeamA] = useState<string[]>(initialTeamA && initialTeamA.length > 0 ? initialTeamA : ['']);
  const [teamB, setTeamB] = useState<string[]>(initialTeamB && initialTeamB.length > 0 ? initialTeamB : ['']);

  useEffect(() => {
    if (initialTeamA && initialTeamA.length > 0) setTeamA(initialTeamA);
    if (initialTeamB && initialTeamB.length > 0) setTeamB(initialTeamB);
  }, [initialTeamA, initialTeamB]);

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
      toast.error('Không thể thêm quá 4 người chơi!');
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

  const handleSave = async () => {
    if (!matchId) {
      toast.error('Không tìm thấy thông tin trận đấu');
      return;
    }

    if (!actorGuestToken && !actorMembershipId) {
      toast.error('Không có quyền chỉnh sửa thành viên');
      return;
    }

    if (!sessionToken || sessionToken.trim() === '') {
      toast.error('SessionToken không hợp lệ');
      return;
    }

    if (!clubId) {
      toast.error('Không thể xác định club để validation membership');
      return;
    }

    try {
      const validationErrors: string[] = [];
      const membershipUpdates: Array<{ teamIndex: number, memberIndex: number, fullName: string }> = [];
      const guestUpdates: Array<{ teamIndex: number, memberIndex: number, guestName: string }> = [];

      for (let teamIndex = 0; teamIndex < 2; teamIndex++) {
        const team = teamIndex === 0 ? teamA : teamB;
        const teamName = teamIndex === 0 ? 'Team A' : 'Team B';

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
                validationErrors.push(`${teamName} - ${memberName}: Không thuộc cùng brand`);
                continue;
              }

              if (membershipInfo.data?.status === 'inactive') {
                validationErrors.push(`${teamName} - ${memberName}: Tài khoản bị cấm`);
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
        toast.error(`Có lỗi validation:\n${errorMessage}`);
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

      // 🎯 BE đã có ULTIMATE PROTECTION hoàn chỉnh:
      // - Chỉ update name, KHÔNG BAO GIỜ động đến token/role
      // - Host member được bảo vệ tuyệt đối tự động
      // - Existing members giữ nguyên token và role
      // - Member mới LUÔN là participant
      // - Không cần flags từ Frontend
      
      const teams = [
        teamA.filter(name => name.trim() !== '').map(name => {
          const isPhoneNumber = /^\d+$/.test(name.trim());
          if (isPhoneNumber) {
            return { phoneNumber: name.trim() };
          } else {
            return { guestName: name.trim() };
          }
        }),
        teamB.filter(name => name.trim() !== '').map(name => {
          const isPhoneNumber = /^\d+$/.test(name.trim());
          if (isPhoneNumber) {
            return { phoneNumber: name.trim() };
          } else {
            return { guestName: name.trim() };
          }
        })
      ];

      // 🎯 Backend đã có ULTIMATE PROTECTION:
      // - Chỉ update name, KHÔNG BAO GIỜ động đến token/role
      // - Host member được bảo vệ tuyệt đối
      // - Existing members giữ nguyên token và role
      // - Member mới LUÔN là participant
      await userMatchService.updateTeamMembersV2(matchId, teams, sessionToken, actorGuestToken || undefined, actorMembershipId || undefined);

      toast.success('Cập nhật thành viên thành công!');

      // ← MỚI: BE trả về hostSessionToken để confirm host vẫn giữ token
      // Có thể sử dụng để verify rằng host không bị mất quyền

      setTimeout(() => {
        onSave(teamA, teamB);
        onClose();
      }, 100);
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message || 'Cập nhật thành viên thất bại';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-bold text-[#000000] mb-6 text-center">
          Chỉnh sửa thành viên
        </h2>



        <div className="space-y-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Bạn có thể nhập số điện thoại hội viên hoặc tên khách
            </p>
          </div>

          <div>
            <div className="font-semibold mb-3 text-center text-[#000000] text-lg">Team A</div>
            {teamA.map((player, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  value={player}
                  onChange={e => handleChange('A', idx, e.target.value)}
                  placeholder={idx === 0 ? "Tên chủ phòng" : "Số điện thoại hoặc tên khách"}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">Người chơi {idx + 1}</span>
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
                      alt="Thêm người chơi"
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
                      alt="Xóa người chơi"
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
            <div className="font-semibold mb-3 text-center text-lg text-[#000000]">Team B</div>
            {teamB.map((player, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  value={player}
                  onChange={e => handleChange('B', idx, e.target.value)}
                  placeholder={idx === 0 ? "Tên chủ phòng" : "Số điện thoại hoặc tên khách"}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">Người chơi {idx + 1}</span>
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
                      alt="Thêm người chơi"
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
                      alt="Xóa người chơi"
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
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
