import React, { useState } from 'react';
import TableStatusBadge from './TableStatusBadge';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';

interface TableUsingViewProps {
  table: {
    id: string;
    name: string;
    teamA: string[];
    teamB: string[];
    teamAScore?: number;
    teamBScore?: number;
    time?: string;
  };
  onBack: () => void;
  onEndMatch: () => void;
  onCancelMatch: () => void;
  onEdit?: () => void;
  onStartMatch?: () => void;
  matchStatus?: 'pending' | 'ongoing' | 'completed';
  elapsedTime?: string;
}

export default function TableUsingView({ table, onBack, onEndMatch, onCancelMatch, onEdit, onStartMatch, matchStatus = 'pending', elapsedTime }: TableUsingViewProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

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
          <TableStatusBadge status="using" />
        </div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">{table.name}</h3>
        </div>
        <div className="flex justify-center gap-8 mb-6">
          {/* Team A */}
          <div className="flex flex-col items-center">
            <div className="font-semibold mb-2">Team A</div>
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
            <div className="text-center text-sm mb-2">
              {table.teamA.map((player, idx) => (
                <div key={idx}>{player}</div>
              ))}
            </div>
            <div className="text-2xl font-bold text-[#000000]">
              {table.teamAScore || 0}
            </div>
          </div>
          <div className="flex flex-col justify-center font-bold text-xl">VS</div>
          {/* Team B */}
          <div className="flex flex-col items-center">
            <div className="font-semibold mb-2">Team B</div>
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
            <div className="text-center text-sm mb-2">
              {table.teamB.map((player, idx) => (
                <div key={idx}>{player}</div>
              ))}
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