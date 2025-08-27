import React, { useEffect, useRef, useState } from 'react';
import { cameraStreamService } from '@/lib/cameraStreamService';
import { CameraRecordButton } from './CameraRecordButton';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n/provider';
import axios from '@/lib/axios';

interface CameraVideoModalProps {
  isOpen: boolean;
  cameraId: string | null;
  onClose: () => void;
  onConfirm: () => void;
  isDetailView?: boolean;
}

interface RecordStatus {
  isRecording: boolean;
  currentJobId?: string;
  startTime?: string;
  duration?: number;
  remainingTime?: number;
}

export const CameraVideoModal: React.FC<CameraVideoModalProps> = ({
  isOpen,
  cameraId,
  onClose,
  onConfirm,
  isDetailView = false
}) => {
  const { t } = useI18n();
  const videoRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordStatus, setRecordStatus] = useState<RecordStatus>({ isRecording: false });
  const [recordStatusInterval, setRecordStatusInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchRecordStatus = async () => {
    if (!cameraId) return;

    try {
      const response = await axios.get(`/manager/camera/${cameraId}/recordings`);
      const data = response.data as {
        success: boolean;
        cameraId: string;
        recordings: Array<{
          jobId: string;
          fileName: string;
          filePath: string;
          size: number;
          createdAt: string;
          modifiedAt: string;
        }>;
        activeRecording?: {
          matchId: string;
          cameraId: string;
          isActive: boolean;
          startTime: string;
          duration: number;
        };
        isRecording?: boolean;
      };

      if (data.success) {
        const newStatus = {
          isRecording: data.activeRecording?.isActive || data.isRecording || false,
          currentJobId: data.activeRecording?.matchId,
          startTime: data.activeRecording?.startTime,
          duration: data.activeRecording?.duration,
          remainingTime: data.activeRecording?.duration ?
            Math.max(0, data.activeRecording.duration - Math.floor((Date.now() - new Date(data.activeRecording.startTime).getTime()) / 1000)) :
            undefined
        };

        setRecordStatus(newStatus);
      }
    } catch (error) {
      setRecordStatus({ isRecording: false });
    }
  };

  const startRecordStatusPolling = () => {
    if (recordStatusInterval) {
      clearInterval(recordStatusInterval);
    }

    const interval = setInterval(() => {
      fetchRecordStatus();
    }, 5000);

    setRecordStatusInterval(interval);
  };

  const stopRecordStatusPolling = () => {
    if (recordStatusInterval) {
      clearInterval(recordStatusInterval);
      setRecordStatusInterval(null);
    }
  };

  useEffect(() => {
    if (isOpen && cameraId) {
      fetchRecordStatus();
      startRecordStatusPolling();
    }

    return () => {
      stopRecordStatusPolling();
    };
  }, [isOpen, cameraId]);

  useEffect(() => {
    if (isOpen && cameraId && videoRef.current) {
      const startStream = async () => {
        try {
          setIsLoading(true);
          setError(null);
          setIsStreaming(false);

          await new Promise(resolve => setTimeout(resolve, 100));

          const result = await cameraStreamService.startVideoStream(cameraId, videoRef.current!);

          if (result.success) {
            setIsStreaming(true);
            toast.success(t('manager.cameraVideo.streamStarted'));
          } else {
            setError(result.message);
            toast.error(`${t('manager.cameraVideo.cannotStartStream')} ${result.message}`);
          }
        } catch (error) {
          console.error('Error starting stream:', error);
          const errorMessage = error instanceof Error ? error.message : t('manager.cameraRecord.unknownError');
          setError(errorMessage);
          toast.error(`${t('manager.cameraVideo.streamError')} ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      };

      startStream();
    }

    return () => {
      if (cameraId && isStreaming) {
        try {
          cameraStreamService.stopVideoStream(cameraId);
        } catch (error) {
        }
      }
    };
  }, [isOpen, cameraId, t]);

  const handleClose = () => {
    if (cameraId && isStreaming) {
      cameraStreamService.stopVideoStream(cameraId);
    }
    stopRecordStatusPolling();
    setIsStreaming(false);
    setIsLoading(false);
    setError(null);
    onClose();
  };

  const handleConfirm = () => {
    if (cameraId && isStreaming) {
      cameraStreamService.stopVideoStream(cameraId);
    }
    stopRecordStatusPolling();
    setIsStreaming(false);
    setIsLoading(false);
    setError(null);
    onConfirm();
  };

  const formatTime = (seconds?: number): string => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Video trực tiếp
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${recordStatus.isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {recordStatus.isRecording ? 'Đang ghi' : 'Không ghi'}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mb-4">
          <canvas
            ref={videoRef}
            className="w-full h-96 bg-black rounded-lg"
            width={854}
            height={480}
            style={{
              background: '#000',
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-white">{t('manager.cameraVideo.connectingVideo')}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50 rounded-lg">
              <div className="text-center">
                <svg className="w-12 h-12 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-white font-medium">{t('manager.cameraVideo.connectionError')}</p>
                <p className="text-white text-sm">{error}</p>
              </div>
            </div>
          )}

          {isStreaming && !isLoading && !error && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {t('manager.cameraVideo.liveStream')}
            </div>
          )}

          {recordStatus.isRecording && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              REC
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {isStreaming && !isLoading && !error && cameraId && (
            <CameraRecordButton
              cameraId={cameraId}
              duration={20}
              onSuccess={(result) => {
                fetchRecordStatus();
              }}
            />
          )}

          <button
            onClick={handleConfirm}
            disabled={!isStreaming || isLoading}
            className={`w-40 border border-lime-400 text-lime-500 font-bold py-2 rounded-lg transition text-lg ${isStreaming && !isLoading
              ? 'bg-lime-500 hover:bg-lime-600 text-white border-lime-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
              }`}
          >
            {isDetailView ? t('manager.cameraVideo.close') : t('manager.cameraVideo.addCamera')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraVideoModal;
