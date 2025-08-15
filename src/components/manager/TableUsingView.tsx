import React, { useState, useEffect } from 'react';
import TableStatusBadge from './TableStatusBadge';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import Image from 'next/image';

interface TableUsingViewProps {
  table: {
    id: string;
    name: string;
    teamA: string[];
    teamB: string[];
    teamAScore?: number;
    teamBScore?: number;
    time?: string;
    category?: string;
  };
  onBack: () => void;
  onEndMatch: () => void;
  onCancelMatch: () => void;
  onEdit?: () => void;
  onStartMatch?: () => void;
  matchStatus?: 'pending' | 'ongoing' | 'completed';
  elapsedTime?: string;
  isAiAssisted?: boolean;
}

export default function TableUsingView({ table, onBack, onEndMatch, onCancelMatch, onEdit, onStartMatch, matchStatus = 'pending', elapsedTime, isAiAssisted = false }: TableUsingViewProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [teamAAvatar, setTeamAAvatar] = useState<string>('');
  const [teamBAvatar, setTeamBAvatar] = useState<string>('');

  useEffect(() => {
    const ballImages = [
      '/images/numberBalls/ball_1.png',
      '/images/numberBalls/ball_2.png',
      '/images/numberBalls/ball_3.png',
      '/images/numberBalls/ball_4.png',
      '/images/numberBalls/ball_5.png',
      '/images/numberBalls/ball_6.png',
      '/images/numberBalls/ball_7.png',
      '/images/numberBalls/ball_8.png',
      '/images/numberBalls/ball_9.png'
    ];

    const randomTeamA = ballImages[Math.floor(Math.random() * ballImages.length)];
    setTeamAAvatar(randomTeamA);

    const remainingBalls = ballImages.filter(ball => ball !== randomTeamA);
    const randomTeamB = remainingBalls[Math.floor(Math.random() * remainingBalls.length)];
    setTeamBAvatar(randomTeamB);
  }, []);

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleEndClick = () => {
    setShowEndConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    onCancelMatch();
  };

  const handleConfirmEnd = () => {
    setShowEndConfirm(false);
    onEndMatch();
  };

  return (
    <>
      <div className="border border-lime-200 rounded-lg p-8 bg-[#FFFFFF] mx-auto text-[#000000]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Chi tiết trận đấu</h2>
          <TableStatusBadge status="using" isAiAssisted={isAiAssisted} />
        </div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">{table.name}</h3>
          {table.category && (
            <p className="text-lg text-gray-600 mt-2">{table.category}</p>
          )}
        </div>
        <div className="flex justify-center gap-8 mb-6">
          {/* Team A */}
          <div className="flex flex-col items-center">
            <div className="font-semibold mb-2">Team A</div>
            <div className="w-16 h-16 mb-2 flex items-center justify-center">
              {teamAAvatar ? (
                <Image
                  src={teamAAvatar}
                  alt="Team A Avatar"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              )}
            </div>
            <div className="text-center text-sm mb-2 min-h-[40px] flex flex-col justify-center">
              {table.teamA.length > 0 ? (
                table.teamA.map((player, idx) => (
                  <div key={idx}>{player}</div>
                ))
              ) : (
                <div className="text-gray-400">Chưa có thành viên</div>
              )}
            </div>
            <div className="text-2xl font-bold text-[#000000]">
              {table.teamAScore || 0}
            </div>
          </div>
          <div className="flex flex-col justify-center font-bold text-xl">VS</div>
          {/* Team B */}
          <div className="flex flex-col items-center">
            <div className="font-semibold mb-2">Team B</div>
            <div className="w-16 h-16 mb-2 flex items-center justify-center">
              {teamBAvatar ? (
                <Image
                  src={teamBAvatar}
                  alt="Team B Avatar"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              )}
            </div>
            <div className="text-center text-sm mb-2 min-h-[40px] flex flex-col justify-center">
              {table.teamB.length > 0 ? (
                table.teamB.map((player, idx) => (
                  <div key={idx}>{player}</div>
                ))
              ) : (
                <div className="text-gray-400">Chưa có thành viên</div>
              )}
            </div>
            <div className="text-2xl font-bold text-[#000000]">
              {table.teamBScore || 0}
            </div>
          </div>
        </div>
        <div className="text-center mb-6 text-lg font-mono">
          {matchStatus === 'ongoing' && elapsedTime ? elapsedTime : (table.time || '00:00:00')}
        </div>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg"
            onClick={onBack}
          >
            Quay lại
          </button>
          {matchStatus === 'pending' && onStartMatch && (
            <button
              type="button"
              className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg"
              onClick={onStartMatch}
            >
              Bắt đầu
            </button>
          )}
          {matchStatus === 'ongoing' && onEdit && (
            <button
              type="button"
              className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg"
              onClick={onEdit}
            >
              Chỉnh sửa
            </button>
          )}
          <button
            type="button"
            className="w-40 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition text-lg"
            onClick={matchStatus === 'pending' ? handleCancelClick : handleEndClick}
          >
            {matchStatus === 'pending' ? 'Hủy trận đấu' : 'Kết thúc'}
          </button>
        </div>
      </div>

      {/* Confirmation Popup for Cancel Match */}
      <ConfirmPopup
        open={showCancelConfirm}
        title="Xác nhận hủy trận đấu"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
        confirmText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-4">Bạn có chắc chắn muốn hủy trận đấu này?</p>
        </div>
      </ConfirmPopup>

      {/* Confirmation Popup for End Match */}
      <ConfirmPopup
        open={showEndConfirm}
        title="Xác nhận kết thúc trận đấu"
        onConfirm={handleConfirmEnd}
        onCancel={() => setShowEndConfirm(false)}
        confirmText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-4">Bạn có chắc chắn muốn kết thúc trận đấu này?</p>
        </div>
      </ConfirmPopup>
    </>
  );
} 