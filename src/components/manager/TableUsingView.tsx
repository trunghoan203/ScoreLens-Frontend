import React, { useState } from 'react';
import TableStatusBadge from './TableStatusBadge';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import VideoAI from '@/components/shared/videoAI';
import { managerMatchService } from '@/lib/managerMatchService';
import { CameraVideoModal } from '@/components/manager/CameraVideoModal';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n/provider';

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
  cameras?: Array<{
    cameraId: string;
    tableId: string;
    IPAddress: string;
    username: string;
    password: string;
    isConnect: boolean;
  }>;
  cameraLoading?: boolean;
}

export default function TableUsingView({ table, onBack, onEndMatch, onCancelMatch, onEdit, onStartMatch, matchStatus = 'pending', elapsedTime, isAiAssisted = false, matchId, onScoresUpdated, onVideoUrlUpdate, cameras = [], cameraLoading = false }: TableUsingViewProps) {
  const { t } = useI18n();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showVideoAIModal, setShowVideoAIModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

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

  const handleViewCameraClick = (cameraId: string) => {
    if (showCameraModal) {
      toast.error(t('manager.tableUsing.cameraStreamRunning'));
      return;
    }

    setSelectedCameraId(cameraId);
    setShowCameraModal(true);
  };

  const handleCloseCameraModal = () => {
    setShowCameraModal(false);
    setSelectedCameraId(null);
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
        toast.error(t('manager.tableUsing.cannotIdentifyMatch'));
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
          toast.error(t('manager.tableUsing.cannotUpdateVideoUrl'));
        }
      }

      const rows = parseCsvRows(result.events_csv);

      if (result.analysis_type === 'pool8') {
        const gameEnd = rows.find(r => r.eventType === 'GameEnd');
        if (!gameEnd) return;
        const isTeamAWins = gameEnd.details === 'Team A WINS (8-ball pocketed after all objects)';
        const tId = toast.loading(t('manager.tableUsing.updatingScore'));
        const newTeamAScore = (table.teamAScore || 0) + (isTeamAWins ? 1 : 0);
        const newTeamBScore = (table.teamBScore || 0) + (isTeamAWins ? 0 : 1);
        await Promise.all([
          managerMatchService.updateScore(matchId, { teamIndex: 0, score: newTeamAScore }),
          managerMatchService.updateScore(matchId, { teamIndex: 1, score: newTeamBScore }),
        ]);
        toast.dismiss(tId);
        const newA = newTeamAScore;
        const newB = newTeamBScore;
        if (onScoresUpdated) {
          onScoresUpdated(newA, newB);
        }
        toast.success(`${t('manager.tableUsing.scoreUpdated')} ${isTeamAWins ? t('manager.tableUsing.teamA') : t('manager.tableUsing.teamB')} +1`);
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

        const tId = toast.loading(t('manager.tableUsing.updatingScore'));
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
      toast.error(t('manager.tableUsing.aiScoreUpdateFailed'));
    }
  };

  return (
    <>
      <div className="border border-lime-200 rounded-lg p-4 sm:p-6 lg:p-8 bg-[#FFFFFF] mx-auto text-[#000000]">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold">{t('manager.tableUsing.matchDetails')}</h2>
          <div className="flex items-center gap-2 sm:gap-3">
            {isAiAssisted && matchStatus === 'ongoing' && (
              <button
                type="button"
                className="inline-block px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-[#FFFFFF] font-semibold text-base shadow whitespace-nowrap"
                onClick={() => setShowVideoAIModal(true)}
              >
                {t('manager.tableUsing.videoAi')}
              </button>
            )}
            <TableStatusBadge status="using" isAiAssisted={isAiAssisted} />
          </div>
        </div>
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">{table.name}</h3>
          {table.category && (
            <p className="text-base sm:text-lg text-gray-600 mt-2">{table.category}</p>
          )}
        </div>

        <div className="lg:hidden mb-4 sm:mb-6">
          <div className="flex justify-center gap-4 sm:gap-6 mb-4">
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-bold text-[#000000] mb-2">
                {table.teamAScore || 0}
              </div>
              <div className="font-semibold text-sm sm:text-base mb-2">{t('manager.tableUsing.teamA')}</div>
            </div>
            <div className="flex flex-col justify-center font-bold text-lg sm:text-xl">VS</div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-bold text-[#000000] mb-2">
                {table.teamBScore || 0}
              </div>
              <div className="font-semibold text-sm sm:text-base mb-2">{t('manager.tableUsing.teamB')}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="font-semibold text-sm sm:text-base mb-2">{t('manager.tableUsing.teamA')}</div>
              <div className="text-xs sm:text-sm text-gray-600">
                {table.teamA.length > 0 ? (
                  table.teamA.map((player, idx) => (
                    <div key={idx}>{t('manager.tableUsing.player')} {idx + 1}: {player}</div>
                  ))
                ) : (
                  <div className="text-gray-400">{t('manager.tableUsing.noMembers')}</div>
                )}
              </div>
            </div>

            <div className="text-center">
              <div className="font-semibold text-sm sm:text-base mb-2">{t('manager.tableUsing.teamB')}</div>
              <div className="text-xs sm:text-sm text-gray-600">
                {table.teamB.length > 0 ? (
                  table.teamB.map((player, idx) => (
                    <div key={idx}>{t('manager.tableUsing.player')} {idx + 1}: {player}</div>
                  ))
                ) : (
                  <div className="text-gray-400">{t('manager.tableUsing.noMembers')}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex justify-center gap-8 mb-6">
          <div className="flex flex-col items-center justify-center">
            <div className="text-8xl font-bold text-[#000000] mb-2 mr-10">
              {table.teamAScore || 0}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-8 mb-4">
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-6">{t('manager.tableUsing.teamA')}</div>
                <div className="text-center text-sm mb-2 min-h-[40px] flex flex-col justify-center">
                  {table.teamA.length > 0 ? (
                    table.teamA.map((player, idx) => (
                      <div key={idx}>{t('manager.tableUsing.player')} {idx + 1}: {player}</div>
                    ))
                  ) : (
                    <div className="text-gray-400">{t('manager.tableUsing.noMembers')}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center font-bold text-xl">VS</div>
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-6">{t('manager.tableUsing.teamB')}</div>
                <div className="text-center text-sm mb-2 min-h-[40px] flex flex-col justify-center">
                  {table.teamB.length > 0 ? (
                    table.teamB.map((player, idx) => (
                      <div key={idx}>{t('manager.tableUsing.player')} {idx + 1}: {player}</div>
                    ))
                  ) : (
                    <div className="text-gray-400">{t('manager.tableUsing.noMembers')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="text-8xl font-bold text-[#000000] mb-2 ml-10">
              {table.teamBScore || 0}
            </div>
          </div>
        </div>

        <div className="text-center mb-4 sm:mb-6 text-base sm:text-lg font-mono">
          {matchStatus === 'ongoing' && elapsedTime ? elapsedTime : (table.time || '00:00:00')}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            type="button"
            className="w-full sm:w-32 lg:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-3 sm:order-1"
            onClick={onBack}
          >
            {t('manager.tableUsing.back')}
          </button>
          {matchStatus === 'pending' && onStartMatch && (
            <button
              type="button"
              className="w-full sm:w-32 lg:w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-1 sm:order-2"
              onClick={onStartMatch}
            >
              {t('manager.tableUsing.start')}
            </button>
          )}
          {matchStatus === 'ongoing' && onEdit && (
            <button
              type="button"
              className="w-full sm:w-32 lg:w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-1 sm:order-2"
              onClick={onEdit}
            >
              {t('manager.tableUsing.edit')}
            </button>
          )}
          {matchStatus === 'ongoing' && isAiAssisted && cameras && cameras.length > 0 && (
            <button
              type="button"
              className="w-full sm:w-32 lg:w-40 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-1 sm:order-2"
              onClick={() => {
                const connectedCamera = cameras.find(c => c.isConnect);
                if (connectedCamera) {
                  handleViewCameraClick(connectedCamera.cameraId);
                } else {
                  toast.error(t('manager.tableUsing.noConnectedCamera'));
                }
              }}
              disabled={cameraLoading || !cameras.some(c => c.isConnect)}
            >
              {cameraLoading ? t('manager.tableUsing.loading') : t('manager.tableUsing.viewCamera')}
            </button>
          )}
          <button
            type="button"
            className="w-full sm:w-32 lg:w-40 bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-2 sm:order-3"
            onClick={matchStatus === 'pending' ? handleCancelClick : handleEndClick}
          >
            {matchStatus === 'pending' ? t('manager.tableUsing.cancelMatch') : t('manager.tableUsing.endMatch')}
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
                <div className="font-semibold text-[#000000]">{t('manager.tableUsing.videoAiAnalysis')}</div>
                <button
                  type="button"
                  className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setShowVideoAIModal(false)}
                >
                  {t('manager.tableUsing.close')}
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
        title={t('manager.tableUsing.confirmCancelMatch')}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
        confirmText={t('manager.tableUsing.confirm')}
        cancelText={t('manager.tableUsing.cancel')}
      >
        <div className="text-center">
          <p className="text-gray-700 mb-4">{t('manager.tableUsing.confirmCancelMessage')}</p>
        </div>
      </ConfirmPopup>

      <ConfirmPopup
        open={showEndConfirm}
        title={t('manager.tableUsing.confirmEndMatch')}
        onConfirm={handleConfirmEnd}
        onCancel={() => setShowEndConfirm(false)}
        confirmText={t('manager.tableUsing.confirm')}
        cancelText={t('manager.tableUsing.cancel')}
      >
        <div className="text-center">
          <p className="text-gray-700 mb-4">{t('manager.tableUsing.confirmEndMessage')}</p>
        </div>
      </ConfirmPopup>

      <CameraVideoModal
        isOpen={showCameraModal}
        cameraId={selectedCameraId}
        onClose={handleCloseCameraModal}
        onConfirm={handleCloseCameraModal}
        isDetailView={true}
      />
    </>
  );
} 