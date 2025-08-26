'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { managerCameraService, RecordResponse } from '@/lib/managerCameraService';
import toast from 'react-hot-toast';
import { Video, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/provider';

interface CameraRecordButtonProps {
  cameraId: string;
  duration?: number;
  onSuccess?: (result: RecordResponse) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CameraRecordButton: React.FC<CameraRecordButtonProps> = ({
  cameraId,
  duration = 20,
  onSuccess,
  onError,
  disabled = false,
  className = ''
}) => {
  const { t } = useI18n();
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(duration);

  const handleRecord = async () => {
    if (isRecording || disabled) return;

    setIsRecording(true);
    setCountdown(duration);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const result = await managerCameraService.recordCamera(cameraId, duration);

      if (result.success) {
        onSuccess?.(result);
        if (result.ai?.success) {
          toast.success(`${t('manager.cameraRecord.aiAnalysis')} ${result.ai.result || t('manager.cameraRecord.analysisComplete')}`);
        } else if (result.ai?.error) {
          toast.error(`${t('manager.cameraRecord.aiUploadFailed')} ${result.ai.error}`);
        } else if (!result.ai) {
        }
      } else {
        toast.error(result.message || t('manager.cameraRecord.recordFailed'));
        onError?.(result.message || t('manager.cameraRecord.recordFailed'));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('manager.cameraRecord.unknownError');
      onError?.(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsRecording(false);
      setCountdown(duration);
    }
  };

  return (
    <div className={`camera-record-container ${className}`}>
      <Button
        onClick={handleRecord}
        disabled={isRecording || disabled}
        variant={isRecording ? "destructive" : "default"}
        className={`record-button ${isRecording ? 'recording' : ''}`}
        size="lg"
      >
        {isRecording ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('manager.cameraRecord.recording')} ({countdown}s)
          </>
        ) : (
          <>
            <Video className="w-4 h-4 mr-2" />
            {t('manager.cameraRecord.recordWithAi')} ({duration}s)
          </>
        )}
      </Button>


    </div>
  );
};
