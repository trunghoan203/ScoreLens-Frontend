'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { managerCameraService, RecordResponse } from '@/lib/managerCameraService';
import toast from 'react-hot-toast';
import { Video, Loader2 } from 'lucide-react';

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
            toast.success(`AI Analysis: ${result.ai.result || 'Phân tích hoàn tất'}`);
          } else if (result.ai?.error) {
            toast.error(`AI upload thất bại: ${result.ai.error}`);
          } else if (!result.ai) {
          }
        } else {
          toast.error(result.message || 'Record thất bại');
          onError?.(result.message || 'Record thất bại');
        }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
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
            Đang ghi... ({countdown}s)
          </>
        ) : (
          <>
            <Video className="w-4 h-4 mr-2" />
            Record + AI ({duration}s)
          </>
        )}
      </Button>


    </div>
  );
};
