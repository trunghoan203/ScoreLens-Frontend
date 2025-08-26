import React, { useEffect, useRef, useState } from 'react';
import { cameraStreamService } from '@/lib/cameraStreamService';
import { CameraRecordButton } from './CameraRecordButton';
import toast from 'react-hot-toast';

interface CameraVideoModalProps {
  isOpen: boolean;
  cameraId: string | null;
  onClose: () => void;
  onConfirm: () => void;
  isDetailView?: boolean;
}

export const CameraVideoModal: React.FC<CameraVideoModalProps> = ({
  isOpen,
  cameraId,
  onClose,
  onConfirm,
  isDetailView = false
}) => {
  const videoRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            toast.success('Đã bắt đầu video stream');
          } else {
            setError(result.message);
            toast.error('Không thể bắt đầu video stream: ' + result.message);
          }
        } catch (error) {
          console.error('Error starting stream:', error);
          const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
          setError(errorMessage);
          toast.error('Lỗi khi bắt đầu video stream: ' + errorMessage);
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
          console.error('Error stopping stream:', error);
        }
      }
    };
  }, [isOpen, cameraId]);

  const handleClose = () => {
    if (cameraId && isStreaming) {
      cameraStreamService.stopVideoStream(cameraId);
    }
    setIsStreaming(false);
    setIsLoading(false);
    setError(null);
    onClose();
  };

  const handleConfirm = () => {
    if (cameraId && isStreaming) {
      cameraStreamService.stopVideoStream(cameraId);
    }
    setIsStreaming(false);
    setIsLoading(false);
    setError(null);
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-4">
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
                <p className="text-white">Đang kết nối video...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50 rounded-lg">
              <div className="text-center">
                <svg className="w-12 h-12 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-white font-medium">Lỗi kết nối</p>
                <p className="text-white text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {isStreaming && !isLoading && !error && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Đang phát
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {isStreaming && !isLoading && !error && cameraId && (
            <CameraRecordButton
              cameraId={cameraId}
              duration={20}
              onSuccess={(result) => {
                // Record completed
              }}
            />
          )}
          
          <button
            onClick={handleConfirm}
            disabled={!isStreaming || isLoading}
            className={`w-40 border border-lime-400 text-lime-500 font-bold py-2 rounded-lg transition text-lg ${
              isStreaming && !isLoading 
                ? 'bg-lime-500 hover:bg-lime-600 text-white border-lime-500' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
            }`}
          >
            {isDetailView ? 'Đóng' : 'Thêm Camera'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraVideoModal;
