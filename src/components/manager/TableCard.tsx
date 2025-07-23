"use client";
import React from 'react';
import Image from 'next/image';

interface TableCardProps {
  name: string;
  type: string;
  status: 'using' | 'available';
  teamA?: string;
  teamB?: string;
  time?: string;
  onDetail?: () => void;
}

export default function TableCard({ name, type, status, teamA, teamB, time, onDetail }: TableCardProps) {
  return (
    <div className="border-2 border-[#8ADB10] rounded-2xl shadow bg-[#FFFFFF] p-4 flex flex-col items-center min-w-[220px]">
      <div className="flex w-full justify-between items-center mb-2">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${status === 'using' ? 'bg-[#8ADB10] text-[#000000]' : 'bg-blue-100 text-blue-700'} uppercase tracking-wide`}>{status === 'using' ? 'Đang sử dụng' : 'Bàn trống'}</span>
        <span className="text-xs text-gray-500 font-semibold">{type === 'pool' ? 'Bida Pool' : 'Bida Carom'}</span>
      </div>
      <div className="font-bold text-base mb-2 text-center text-gray-700">{name}</div>
      {status === 'available' && (
        <div className="flex justify-center items-center mb-2">
          <Image src="/images/logoScoreLensBlack.png" alt="ScoreLens" width={60} height={18} className="-rotate-6" />
        </div>
      )}
      <div className="flex w-full justify-between items-center mb-2">
        <div className="flex flex-col items-center">
          <span className="w-8 h-8 rounded-full bg-gray-200 mb-1"></span>
          <span className="text-xs text-gray-600">{teamA || 'Team A'}</span>
        </div>
        <span className="mx-2 text-gray-400 font-bold">VS</span>
        <div className="flex flex-col items-center">
          <span className="w-8 h-8 rounded-full bg-gray-200 mb-1"></span>
          <span className="text-xs text-gray-600">{teamB || 'Team B'}</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-2">{time || '01:23:45'}</div>
      <button
        className="w-full py-2 rounded-xl font-bold bg-[#8ADB10] text-[#000000] text-base mt-1 hover:bg-lime-500 transition"
        onClick={onDetail || (() => {})}
      >
        {status === 'using' ? 'Xem chi tiết' : 'Sẵn sàng'}
      </button>
    </div>
  );
} 