"use client";
import React from 'react';
import Image from 'next/image';

interface TableCardProps {
  name: string;
  type: string;
  status: 'inuse' | 'empty' | 'maintenance' | 'using' | 'available';
  teamA?: string;
  teamB?: string;
  time?: string;
  onDetail?: () => void;
}

export default function TableCard({ name, type, status, teamA, teamB, time, onDetail }: TableCardProps) {
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
      case 'pool':
        return 'pool';
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
        return 'bg-[#8ADB10] text-[#000000]';
      case 'available':
        return 'bg-blue-100 text-blue-700';
      case 'maintenance':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'using':
        return 'Đang sử dụng';
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
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(displayStatus)} uppercase tracking-wide`}>
          {getStatusText(displayStatus)}
        </span>
        <span className="text-xs text-[#000000] font-semibold">{displayType === 'pool' ? 'Bida Pool' : 'Bida Carom'}</span>
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
            <div className="text-xs text-[#000000]">{time || '01:23:45'}</div>
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
              <div className="text-orange-500 text-2xl font-bold mb-3">⚠️</div>
              <div className="text-orange-500 text-sm font-semibold mb-2">Đang bảo trì</div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          className={`w-full py-2 rounded-xl font-bold text-base transition ${
            displayStatus === 'using' 
              ? 'bg-[#8ADB10] text-[#000000] hover:bg-lime-500' 
              : displayStatus === 'available'
              ? 'bg-[#8ADB10] text-[#000000] hover:bg-lime-500'
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