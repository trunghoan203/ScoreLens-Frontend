"use client";
import Image from 'next/image';

interface TableCardProps {
  name: string;
  type: string;
  status: 'inuse' | 'empty' | 'maintenance' | 'using' | 'available';
  teamA?: string;
  teamB?: string;
  time?: string;
  matchStatus?: 'pending' | 'ongoing' | 'completed';
  elapsedTime?: string;
  isAiAssisted?: boolean;
  onDetail?: () => void;
}

export default function TableCard({ name, type, status, teamA, teamB, time, matchStatus, elapsedTime, isAiAssisted = false, onDetail }: TableCardProps) {
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'inuse':
      case 'using':
        return 'using';
      case 'empty':
      case 'available':
        return 'available';
      case 'maintenance':
        return 'maintenance';
      default:
        return 'available';
    }
  };

  const getDisplayType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pool-8':
        return 'pool-8';
      case 'carom':
        return 'carom';
      default:
        return 'pool';
    }
  };

  const displayStatus = getDisplayStatus(status);
  const displayType = getDisplayType(type);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'using':
        return 'bg-[#8ADB10] text-[#FFFFFF]';
      case 'available':
        return 'bg-[#3D96FF] text-[#FFFFFF]';
      case 'maintenance':
        return 'bg-[#e36a23] text-[#FFFFFF]';
      default:
        return 'bg-[#3D96FF] text-[#FFFFFF]';
    }
  };

  const getStatusText = (status: string, isAiAssisted: boolean) => {
    switch (status) {
      case 'using':
        return isAiAssisted ? 'Đang sử dụng - AI' : 'Đang sử dụng';
      case 'available':
        return 'Bàn trống';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return 'Bàn trống';
    }
  };

  return (
    <div className="border-2 border-[#8ADB10] rounded-2xl shadow bg-[#FFFFFF] p-4 flex flex-col items-center min-w-[220px] h-[280px] relative">
      <div className="flex w-full justify-between items-center mb-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(displayStatus)} uppercase tracking-wide text-center whitespace-nowrap`}>
          {getStatusText(displayStatus, isAiAssisted)}
        </span>
        <span className="text-xs text-[#000000] font-semibold">{displayType === 'pool-8' ? 'Bida Pool-8' : 'Bida Carom'}</span>
      </div>

      <div className="font-bold text-base mb-3 text-center text-gray-700">{name}</div>

      <div className="flex-1 flex flex-col justify-center items-center w-full pb-16">
        {displayStatus === 'using' && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex w-full justify-between items-center mb-3">
              <div className="flex flex-col items-center">
                <span className="w-10 h-10 rounded-full bg-gray-200 mb-1"></span>
                <span className="text-xs text-[#000000]">{teamA || 'Team A'}</span>
              </div>
              <span className="mx-2 text-[#000000] font-bold">VS</span>
              <div className="flex flex-col items-center">
                <span className="w-10 h-10 rounded-full bg-gray-200 mb-1"></span>
                <span className="text-xs text-[#000000]">{teamB || 'Team B'}</span>
              </div>
            </div>
            <div className="text-xs text-[#000000] font-mono">
              {matchStatus === 'ongoing' && elapsedTime ? elapsedTime : (time || '00:00:00')}
            </div>
          </div>
        )}

        {displayStatus === 'available' && (
          <div className="flex flex-col items-center justify-center w-full">
            <Image src="/images/logoScoreLensBlack.png" alt="ScoreLens" width={200} height={24} className="-rotate-6 mb-3" />
          </div>
        )}

        {displayStatus === 'maintenance' && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-center">
              <div className="text-[#e36a23] text-2xl font-bold mb-3">⚠️</div>
              <div className="text-[#e36a23] text-sm font-semibold mb-2">Đang bảo trì</div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          className={`w-full py-2 rounded-xl font-bold text-base transition ${displayStatus === 'using'
            ? 'bg-[#8ADB10] text-[#FFFFFF] hover:bg-[#8ADB10]/80'
            : displayStatus === 'available'
              ? 'bg-[#8ADB10] text-[#FFFFFF] hover:bg-[#8ADB10]/80'
              : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          onClick={displayStatus === 'maintenance' ? undefined : onDetail}
          disabled={displayStatus === 'maintenance'}
        >
          {displayStatus === 'using' ? 'Xem chi tiết' : displayStatus === 'available' ? 'Sẵn sàng' : 'Bảo trì'}
        </button>
      </div>
    </div>
  );
} 