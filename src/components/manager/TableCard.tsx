"use client";
import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

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
  scoreA?: number;
  scoreB?: number;
  creatorType?: 'manager' | 'member' | 'guest' | null;
  onDetail?: () => void;
}

export default function TableCard({
  name,
  status,
  type,
  onDetail,
  scoreA = 0,
  scoreB = 0,
  time,
  elapsedTime,
  matchStatus,
  creatorType,
  isAiAssisted = false
}: TableCardProps) {
  const { t } = useI18n();

  const displayStatus = status === 'empty' ? 'available' : status;
  const displayType = type === 'pool8' ? 'pool-8' : 'carom';

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'using':
        return 'bg-red-500 text-white';
      case 'available':
        return 'bg-blue-500 text-white';
      case 'maintenance':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getStatusText = (status: string, isAiAssisted: boolean) => {
    switch (status) {
      case 'using':
        return isAiAssisted ? t('dashboard.tablesInUse') + ' - AI' : t('dashboard.tablesInUse');
      case 'available':
        return t('dashboard.availableTables');
      case 'maintenance':
        return t('tables.status.maintenance');
      default:
        return t('dashboard.availableTables');
    }
  };

  const getCreatorText = (creatorType: 'manager' | 'member' | 'guest' | null) => {
    switch (creatorType) {
      case 'manager':
        return t('nav.managers');
      case 'member':
        return t('nav.members');
      case 'guest':
        return t('feedbacks.creatorType.guest');
      default:
        return null;
    }
  };

  return (
    <div className="border-2 border-[#8ADB10] rounded-2xl shadow bg-[#FFFFFF] p-4 flex flex-col items-center min-w-[220px] h-[280px] relative">
      <div className="flex w-full justify-between items-center mb-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(displayStatus)} uppercase tracking-wide text-center whitespace-nowrap`}>
          {getStatusText(displayStatus, isAiAssisted)}
        </span>
        <span className="text-xs text-[#000000] font-semibold">{displayType === 'pool-8' ? t('tables.types.pool') : t('tables.types.carom')}</span>
      </div>

      <div className="font-bold text-base mb-2 text-center text-gray-700">
        {name}
      </div>

      {displayStatus === 'using' && creatorType && (
        <div className="text-xs text-gray-600 text-center mb-4">
          {t('common.name')}: {getCreatorText(creatorType)}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center items-center w-full pb-16">
        {displayStatus === 'using' && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex w-full justify-between items-center mb-3">
              <div className="flex flex-col items-center ml-10">
                <span className="text-xs text-[#000000] font-medium mb-1">{t('managerMatches.team')} A</span>
                <span className="text-4xl font-bold text-[#000000]">{scoreA}</span>
              </div>
              <span className="mx-2 text-[#000000] font-bold">VS</span>
              <div className="flex flex-col items-center mr-10">
                <span className="text-xs text-[#000000] font-medium mb-1">{t('managerMatches.team')} B</span>
                <span className="text-4xl font-bold text-[#000000]">{scoreB}</span>
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
              <div className="text-[#e36a23] text-sm font-semibold mb-2">{t('tables.status.maintenance')}</div>
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
          {displayStatus === 'using' ? t('common.details') : displayStatus === 'available' ? t('tables.ready') : t('tables.status.maintenance')}
        </button>
      </div>
    </div>
  );
} 