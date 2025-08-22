import React, { useState } from 'react';
import TableStatusBadge from './TableStatusBadge';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import VideoAI from '@/components/shared/videoAI';
import { managerMatchService } from '@/lib/managerMatchService';
import toast from 'react-hot-toast';

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
  matchId?: string;
  onScoresUpdated?: (teamAScore: number, teamBScore: number) => void;
  onVideoUrlUpdate?: (videoUrl: string) => void;
}

export default function TableUsingView({ table, onBack, onEndMatch, onCancelMatch, onEdit, onStartMatch, matchStatus = 'pending', elapsedTime, isAiAssisted = false, matchId, onScoresUpdated, onVideoUrlUpdate }: TableUsingViewProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showVideoAIModal, setShowVideoAIModal] = useState(false);

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

  const normalizeCategory = (value?: string) => (value ? value.toLowerCase().replace(/[^a-z0-9]/g, '') : '');
  const normalized = normalizeCategory(table.category);
  const derivedAnalysisType: 'pool8' | 'carom' = normalized.includes('pool8') ? 'pool8' : 'carom';

  const parseCsvRows = (csv?: string) => {
    if (!csv) return [] as Array<{ eventType: string; details: string }>;
    const lines = csv.trim().split('\n');
    const rows: Array<{ eventType: string; details: string }> = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.match(/("[^"]*"|[^,]+)/g) || [];
      if (parts.length >= 5) {
        const eventType = (parts[0] || '').replace(/^"|"$/g, '').trim();
        const details = (parts[4] || '').replace(/^"|"$/g, '').trim();
        rows.push({ eventType, details });
      }
    }
    return rows;
  };

  const handleVideoProcessed = async (result: {
    success: boolean;
    player_url: string;
    cloudinary_url: string;
    public_id: string;
    events_csv: string;
    filename: string;
    analysis_type: 'pool8' | 'carom';
  }) => {
    try {
      if (!result?.success) return;
      if (!matchId) {
        toast.error('Không xác định được trận đấu để cập nhật điểm.');
        return;
      }

      if (result.player_url) {
        try {
          await managerMatchService.updateVideoUrl(matchId, result.player_url);
          

          if (onVideoUrlUpdate) {
            onVideoUrlUpdate(result.player_url);
          }
        } catch (error) {
          console.error('[AI] Failed to update video URL:', error);
          toast.error('Không thể cập nhật video URL vào trận đấu');
        }
      }

      const rows = parseCsvRows(result.events_csv);

      if (result.analysis_type === 'pool8') {
        const gameEnd = rows.find(r => r.eventType === 'GameEnd');
        if (!gameEnd) return;
        const isTeamAWins = gameEnd.details === 'Team A WINS (8-ball pocketed after all objects)';
        const teamIndex = isTeamAWins ? 0 : 1;
        const tId = toast.loading('Đang cập nhật điểm...');
        await managerMatchService.updateScore(matchId, { teamIndex, score: (teamIndex === 0 ? (table.teamAScore || 0) + 1 : (table.teamAScore || 0)) });
        await managerMatchService.updateScore(matchId, { teamIndex: teamIndex === 0 ? 1 : 0, score: (teamIndex === 1 ? (table.teamBScore || 0) + 1 : (table.teamBScore || 0)) });
        toast.dismiss(tId);
        const newA = teamIndex === 0 ? (table.teamAScore || 0) + 1 : (table.teamAScore || 0);
        const newB = teamIndex === 1 ? (table.teamBScore || 0) + 1 : (table.teamBScore || 0);
        if (onScoresUpdated) {
          onScoresUpdated(newA, newB);
        }
        toast.success(`Cập nhật điểm: ${teamIndex === 0 ? 'Đội A' : 'Đội B'} +1`);
      } else if (result.analysis_type === 'carom') {
        const finalScore = rows.find(r => r.eventType === 'FinalScore');
        if (!finalScore) return;
        const match = finalScore.details.match(/Player A:\s*(\d+)\s*,\s*Player B:\s*(\d+)/i);
        if (!match) return;
        const a = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);

        const currentA = table.teamAScore || 0;
        const currentB = table.teamBScore || 0;
        const newTeamAScore = currentA + a;
        const newTeamBScore = currentB + b;

        const tId = toast.loading('Đang cập nhật điểm...');
        await Promise.all([
          managerMatchService.updateScore(matchId, { teamIndex: 0, score: newTeamAScore }),
          managerMatchService.updateScore(matchId, { teamIndex: 1, score: newTeamBScore }),
        ]);
        toast.dismiss(tId);
        if (onScoresUpdated) {
          onScoresUpdated(newTeamAScore, newTeamBScore);
        }
      }
    } catch (error) {
      console.error('AI updateScore error:', error);
      toast.error('Cập nhật điểm từ AI thất bại');
    }
  };

  return (
    <>
      <div className="border border-lime-200 rounded-lg p-8 bg-[#FFFFFF] mx-auto text-[#000000]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Chi tiết trận đấu</h2>
          <div className="flex items-center gap-3">
            {isAiAssisted && matchStatus === 'ongoing' && (
              <button
                type="button"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={() => setShowVideoAIModal(true)}
              >
                Video AI
              </button>
            )}
            <TableStatusBadge status="using" isAiAssisted={isAiAssisted} />
          </div>
        </div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">{table.name}</h3>
          {table.category && (
            <p className="text-lg text-gray-600 mt-2">{table.category}</p>
          )}
        </div>
        <div className="flex justify-center gap-8 mb-6">
          {/* Team A Score - Left Position */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-8xl font-bold text-[#000000] mb-2 mr-10">
              {table.teamAScore || 0}
            </div>
          </div>

          {/* Center Team Info */}
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-8 mb-4">
              {/* Team A */}
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-6">Đội A</div>
                <div className="text-center text-sm mb-2 min-h-[40px] flex flex-col justify-center">
                  {table.teamA.length > 0 ? (
                    table.teamA.map((player, idx) => (
                      <div key={idx}>Người chơi {idx + 1}: {player}</div>
                    ))
                  ) : (
                    <div className="text-gray-400">Chưa có thành viên</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center font-bold text-xl">VS</div>
              {/* Team B */}
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-6">Đội B</div>
                <div className="text-center text-sm mb-2 min-h-[40px] flex flex-col justify-center">
                  {table.teamB.length > 0 ? (
                    table.teamB.map((player, idx) => (
                      <div key={idx}>Người chơi {idx + 1}: {player}</div>
                    ))
                  ) : (
                    <div className="text-gray-400">Chưa có thành viên</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Team B Score - Right Position */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-8xl font-bold text-[#000000] mb-2 ml-10">
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

      {isAiAssisted && matchStatus === 'ongoing' && (
        <div className={`${showVideoAIModal ? '' : 'hidden'} fixed inset-0 z-50`}>
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowVideoAIModal(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg relative">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="font-semibold">Phân tích video AI</div>
                <button
                  type="button"
                  className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setShowVideoAIModal(false)}
                >
                  Đóng
                </button>
              </div>
              <div className="p-4">
                <VideoAI
                  onVideoProcessed={handleVideoProcessed}
                  analysisType={derivedAnalysisType}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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