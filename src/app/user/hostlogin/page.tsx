'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { BackButton } from '@/components/ui/BackButton';

function HostLoginContent() {
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

  const renderTeamCard = (
    teamName: string,
    team: 'A' | 'B',
    value: number
  ) => (
    <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl bg-white border border-gray-200">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 bg-[#8ADB10]"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 bg-[#8ADB10]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{teamName}</h3>
            <p className="text-gray-600 text-sm">Thiết lập đội hình</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#8ADB10]/10 flex items-center justify-center border border-[#8ADB10]/20">
            <span className="text-[#8ADB10] font-bold text-lg">{team}</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-gray-700 text-sm font-medium">
            Số lượng người chơi
          </label>
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-2 border border-gray-200">
            <button
              onClick={() => handleChange(team, -1)}
              className="w-10 h-10 text-gray-700 font-bold text-xl flex items-center justify-center rounded-lg hover:bg-[#8ADB10]/10 transition-colors duration-200"
            >
              −
            </button>
            <div className="mx-6 text-center">
              <span className="text-gray-900 font-bold text-2xl">{value}</span>
            </div>
            <button
              onClick={() => handleChange(team, 1)}
              className="w-10 h-10 text-gray-700 font-bold text-xl flex items-center justify-center rounded-lg hover:bg-[#8ADB10]/10 transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Nút Back ở góc trên bên trái */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton onClick={() => router.back()} />
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8ADB10] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8ADB10] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-[#8ADB10] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="sm:w-28 sm:h-28">
                <ScoreLensLogo />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center px-4 py-2 bg-[#8ADB10]/10 rounded-full border border-[#8ADB10]/20">
                <span className="text-[#8ADB10] text-sm font-medium">Bàn {tableNumber || '...'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Pool 8 Ball
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Tạo đội chơi
              </p>
            </div>

            {/* Team cards */}
            <div className="space-y-4">
              {renderTeamCard('Đội A', 'A', teamAPlayers)}
              {renderTeamCard('Đội B', 'B', teamBPlayers)}
            </div>
          </div>
        </div>

        {/* Bottom button */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleNext}
            className="w-full bg-[#8ADB10] hover:bg-[#7ACB00] text-white font-semibold py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Tiếp tục
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default function HostLoginPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải..." />}>
      <HostLoginContent />
    </Suspense>
  );
}
