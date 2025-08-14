'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { userMatchService } from '@/lib/userMatchService';
import socketService from '@/lib/socketService';

interface Props {
  onClose: () => void;
  onSave: (teamAMembers: string[], teamBMembers: string[]) => void;
  initialTeamA: string[];
  initialTeamB: string[];
  matchId: string | null;
  actorGuestToken: string | null;
  actorMembershipId: string | null;
}

export default function PopupEditMembers({ onClose, onSave, initialTeamA, initialTeamB, matchId, actorGuestToken, actorMembershipId }: Props) {
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

    try {
      const teamAMembers = teamA.filter(name => name.trim() !== '').map(name => ({ guestName: name }));
      const teamBMembers = teamB.filter(name => name.trim() !== '').map(name => ({ guestName: name }));
      
      await userMatchService.updateTeamMembers(matchId, 0, {
        actorGuestToken: actorGuestToken || undefined,
        actorMembershipId: actorMembershipId || undefined,
        members: teamAMembers
      });

      await userMatchService.updateTeamMembers(matchId, 1, {
        actorGuestToken: actorGuestToken || undefined,
        actorMembershipId: actorMembershipId || undefined,
        members: teamBMembers
      });

      toast.success('Cập nhật thành viên thành công!');
      
      setTimeout(() => {
        onSave(teamA, teamB);
        onClose();
      }, 100);
    } catch (error: any) {
      const errorMessage = error?.message || 'Cập nhật thành viên thất bại';
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
          <div>
            <div className="font-semibold mb-3 text-center text-[#000000] text-lg">Team A</div>
            {teamA.map((player, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  value={player}
                  onChange={e => handleChange('A', idx, e.target.value)}
                  placeholder={`Người Chơi ${idx + 1}`}
                  className="w-full"
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
                  placeholder={`Người Chơi ${idx + 1}`}
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
