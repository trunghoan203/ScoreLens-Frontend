'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

export default function HostLoginPage() {
  const [teamAPlayers, setTeamAPlayers] = useState(2);
  const [teamBPlayers, setTeamBPlayers] = useState(2);
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams.get('table');
    if (table) setTableNumber(table);

    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleNext = () => {
    router.push(
      `/user/homerandom?table=${tableNumber}&teamA=${teamAPlayers}&teamB=${teamBPlayers}`
    );
  };

  const handleChange = (team: 'A' | 'B', delta: number) => {
    if (team === 'A') {
      setTeamAPlayers((prev) => Math.max(1, prev + delta));
    } else {
      setTeamBPlayers((prev) => Math.max(1, prev + delta));
    }
  };

  const renderTeamRow = (
    teamName: string,
    team: 'A' | 'B',
    value: number
  ) => (
    <div className="flex items-center justify-between w-full gap-2">
      <div className="text-left w-1/2">
        <span className="font-bold text-xl text-black whitespace-nowrap">{teamName}</span>
      </div>

      <div className="flex flex-col w-1/2 items-end">
        <label className="text-sm font-semibold text-black mb-1">
          Số Lượng Người Chơi
        </label>
        <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-white shadow-sm">
          <button
            onClick={() => handleChange(team, -1)}
            className="w-6 h-6 text-black font-bold text-xl flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            −
          </button>
          <span className="mx-4 text-black font-semibold text-base">{value}</span>
          <button
            onClick={() => handleChange(team, 1)}
            className="w-6 h-6 text-black font-bold text-xl flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="flex-1 flex flex-col items-center text-center space-y-8 py-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="sm:w-28 sm:h-28">
            <ScoreLensLogo />
          </div>
        </div>

        {/* Tiêu đề */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-black">
            Bàn {tableNumber || '...'} - Pool 8 Ball
          </h2>
          <p className="text-sm sm:text-base text-black font-medium">TẠO ĐỘI CHƠI</p>
        </div>

        {/* Cài đặt đội */}
        <div className="space-y-6 w-full">
          {renderTeamRow('Đội A', 'A', teamAPlayers)}
          {renderTeamRow('Đội B', 'B', teamBPlayers)}
        </div>
      </div>

      {/* Nút tiếp tục dưới cùng */}
      <div className="w-full p-4 bg-white shadow-inner">
        <button
          onClick={handleNext}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-base sm:text-lg transition"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
