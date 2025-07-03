'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export default function SetupMatchPage() {
  const router = useRouter();

  const [teamA, setTeamA] = useState(['']);
  const [teamB, setTeamB] = useState(['']);
  const tableNumber = '06';

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

  const handleStart = () => {
    // Sau này bạn có thể thêm validate trước khi start
    router.push('/user/screencontrol');
  };

  const renderTeam = (label: string, team: string[], teamKey: 'A' | 'B') => (
    <div className="w-full sm:w-[48%] p-4 border border-gray-300 rounded-lg space-y-2 bg-white shadow-sm">
      <h2 className="text-left font-semibold text-base text-black">{label}</h2>
      {team.map((player, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={player}
            onChange={(e) => handleChange(teamKey, index, e.target.value)}
            placeholder={`Người chơi ${index + 1}`}
            className="flex-1 text-black"
          />
          {index === 0 ? (
            <button
              type="button"
              onClick={() => handleAddPlayer(teamKey)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
              title="Thêm người chơi"
            >
              <Plus size={18} className="text-black" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleRemovePlayer(teamKey, index)}
              className="p-2 bg-gray-100 hover:bg-red-100 rounded"
              title="Xoá người chơi"
            >
              <Trash2 size={18} className="text-red-600" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="w-full max-w-4xl space-y-8 text-center py-10">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="sm:w-28 sm:h-28">
            <ScoreLensLogo />
          </div>
        </div>

        {/* Tiêu đề */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Bàn {tableNumber} - Pool 8 Ball</h1>
          <p className="text-base sm:text-lg text-black font-medium">TẠO ĐỘI CHƠI</p>
        </div>

        {/* Đội A và B */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4">
          {renderTeam('Đội A', teamA, 'A')}
          {renderTeam('Đội B', teamB, 'B')}
        </div>

        {/* Nút bắt đầu */}
        <Button
          onClick={handleStart}
          className="w-full sm:w-1/2 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-md py-3 text-lg"
        >
          Bắt đầu
        </Button>
      </div>
    </div>
  );
}
