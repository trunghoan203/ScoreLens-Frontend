import React, { useEffect, useRef, useState } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';

interface VideoPlayerProps {
  streamUrl: string;
  isPlaying: boolean;
  onError?: (error: string) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  streamUrl, 
  isPlaying, 
  onError,
  className = "w-full h-64 bg-black rounded-lg"
}) => {
  const videoRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPlaying && streamUrl && videoRef.current) {
      try {
        playerRef.current = new JSMpeg.Player(streamUrl, {
          canvas: videoRef.current,
          audio: false,
          autoplay: true,
          loop: false,
          onPlay: () => {
            setIsConnected(true);
            setError(null);
          },
          onError: (err: any) => {
            setError('Không thể kết nối video stream');
            setIsConnected(false);
            onError?.(err);
          },
          onClose: () => {
            setIsConnected(false);
          }
        });
      } catch (err) {
        setError('Không thể khởi tạo video player');
        onError?.(err as string);
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (err) {
          console.error('Error destroying player:', err);
        }
        playerRef.current = null;
      }
      setIsConnected(false);
      setError(null);
    };
  }, [streamUrl, isPlaying, onError]);

  if (!isPlaying) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300`}>
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">Chưa có video stream</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-50 border-2 border-red-200`}>
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-600 font-medium">Lỗi kết nối</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas 
        ref={videoRef}
        className={className}
      />
      {isConnected && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Đang phát
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
