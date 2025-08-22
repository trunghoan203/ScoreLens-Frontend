import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface ProcessVideoResponse {
  success: boolean;
  player_url: string;
  cloudinary_url: string;
  public_id: string;
  events_csv: string;
  filename: string;
  analysis_type: 'pool8' | 'carom';
}

interface VideoAIProps {
  onVideoProcessed?: (result: ProcessVideoResponse) => void;
  className?: string;
  analysisType: 'pool8' | 'carom';
}

export default function VideoAI({ onVideoProcessed, className = '', analysisType }: VideoAIProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<Partial<ProcessVideoResponse>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const MAX_VIDEO_SIZE_GB = 2;

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('video/')) {
      toast.error('Vui lòng chọn đúng định dạng video!', {
        icon: '📹',
        style: { borderRadius: '10px', background: '#fee2e2', color: '#dc2626' }
      });
      return false;
    }
    if (file.size > MAX_VIDEO_SIZE_GB * 1024 * 1024 * 1024) {
      toast.error(`Video không được vượt quá ${MAX_VIDEO_SIZE_GB}GB!`, {
        icon: '⚠️',
        style: { borderRadius: '10px', background: '#fef3c7', color: '#d97706' }
      });
      return false;
    }
    return true;
  };

  const handleVideoSelect = (file: File) => {
    if (!validateFile(file)) return;
    
    setVideoFile(file);
    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);
  };

  const processVideo = async () => {
    if (!videoFile) {
      toast.error('Vui lòng chọn video trước!', {
        icon: '📹',
        style: { borderRadius: '10px', background: '#fef3c7', color: '#d97706' }
      });
      return;
    }
    
    try {
      setProcessing(true);
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('analysis_type', analysisType);

      const res = await fetch('http://localhost:5000/process_video', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        throw new Error('Lỗi khi gửi video để phân tích');
      }
      
      const data = await res.json();
      setProcessResult(data);
      
      try {
        if (onVideoProcessed) {
          onVideoProcessed(data as ProcessVideoResponse);
          toast.success('Đã gửi kết quả AI đến xử lý điểm!');
        }
      } catch (cbErr) {
        console.error('[VideoAI] onVideoProcessed error:', cbErr);
      }
      
      if (data?.success) {
        toast.success('Thành công! Đang xử lý điểm...', {
          style: { borderRadius: '10px', background: '#dcfce7', color: '#16a34a' }
        });
      } else {
        toast('Lỗi phân tích video!');
      }
    } catch (error) {
      console.error('[VideoAI] processVideo error:', error);
      toast.error('Lỗi phân tích video!', {
        style: { borderRadius: '10px', background: '#fee2e2', color: '#dc2626' }
      });
    } finally {
      setProcessing(false);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleVideoSelect(videoFile);
    } else {
      toast.error('Vui lòng thả file video!', {
        icon: '📹',
        style: { borderRadius: '10px', background: '#fef3c7', color: '#d97706' }
      });
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVideoSelect(file);
    }
  };

  const clearVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setVideoFile(null);
    setProcessResult({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadCsv = () => {
    const csvData = processResult.events_csv || '';
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = processResult.filename?.replace(/\.[^.]+$/, '') + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadVideo = async () => {
    try {
      toast.success(`Đang tải ${processResult.filename || 'video.mp4'}...`, {
        style: { borderRadius: '10px', background: '#dcfce7', color: '#16a34a' }
      });
      
      const response = await fetch(processResult.cloudinary_url!);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = processResult.filename || 'video.mp4';
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Đã tải thành công ${processResult.filename || 'video.mp4'}! 🎉`, {
        style: { borderRadius: '10px', background: '#dcfce7', color: '#16a34a' }
      });
    } catch (error) {
      console.error('Lỗi khi tải video:', error);
      toast.error('Lỗi khi tải video! ❌', {
        style: { borderRadius: '10px', background: '#fee2e2', color: '#dc2626' }
      });
    }
  };

  const displayCSVData = (csvContent: string) => {
    if (!csvContent) return [];
    
    const lines = csvContent.trim().split('\n');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.match(/("[^"]*"|[^,]+)/g) || [];
      if (parts.length >= 5) {
        const row = {
          eventType: (parts[0] || '').replace(/^"|"$/g, '').trim(),
          turn: (parts[1] || '').replace(/^"|"$/g, '').trim(),
          frame: (parts[2] || '').replace(/^"|"$/g, '').trim(),
          timestamp: (parts[3] || '').replace(/^"|"$/g, '').trim(),
          details: (parts[4] || '').replace(/^"|"$/g, '').trim()
        };
        data.push(row);
      }
    }
    
    return data;
  };

  const csvData = displayCSVData(processResult.events_csv || '');

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100 ${className}`}>
      <h4 className="text-xl font-semibold mb-4 text-center text-blue-800">
        📹 Video AI Billiards
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {!videoUrl ? (
            <div
              ref={dropZoneRef}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleFileSelect}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-100 scale-105' 
                  : videoFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-blue-300 bg-white hover:border-blue-400 hover:bg-blue-25'
              }`}
            >
              {videoFile ? (
                <div className="space-y-4">
                  <div className="text-6xl">📹</div>
                  <div>
                    <p className="text-lg font-medium text-green-700 mb-2">
                      Video đã chọn: {videoFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Hãy nhấn &ldquo;🔍 Phân tích Video&rdquo; để bắt đầu phân tích.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl">📹</div>
                  <div>
                    <p className="text-lg font-medium text-blue-700 mb-2">
                      Thả video vào đây hoặc click để chọn
                    </p>
                    <p className="text-sm text-gray-500">
                      Hỗ trợ: MP4, MOV, AVI • Tối đa: {MAX_VIDEO_SIZE_GB}GB
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border-2 border-green-200">
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium text-green-700">✅ Video đã tải lên</p>
                <button
                  onClick={clearVideo}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ❌ Xóa
                </button>
              </div>
              <video src={videoUrl} controls className="w-full rounded-lg border">
                Your browser does not support the video tag.
              </video>
              {videoFile && (
                <p className="text-sm text-gray-600 mt-2">
                  📁 {videoFile.name} ({(videoFile.size / (1024 * 1024 * 1024)).toFixed(1)}GB)
                </p>
              )}
              <div className="mt-3 text-xs text-gray-500">analysis_type gửi: {analysisType}</div>
            </div>
          )}

          <div className="mt-4">
            <Button
              onClick={processVideo}
              disabled={processing || !videoFile}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                !videoFile 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : processing
                    ? 'bg-orange-500 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang phân tích...
                </div>
              ) : (
                '🔍 Phân tích Video'
              )}
            </Button>
          </div>
        </div>

        <div>
          {processResult.success ? (
            <div className="bg-white rounded-xl p-4 border-2 border-emerald-200">
              <h5 className="font-semibold text-emerald-700 mb-3 text-center">
                🎯 Kết quả phân tích
              </h5>
              
              <div className="bg-emerald-50 rounded-lg p-3 mb-4 border-l-4 border-emerald-400">
                <div className="space-y-2 text-sm">
                  <p><strong>Loại phân tích:</strong> {analysisType === 'pool8' ? '🎱 Pool 8-Ball' : '🔴 Carom'}</p>
                  <p><strong>Tên file:</strong> {processResult.filename || 'N/A'}</p>
                </div>
              </div>

              {processResult.cloudinary_url && (
                <div className="mb-4">
                  <h6 className="font-medium text-emerald-700 mb-2">🎬 Video đã xử lý</h6>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <a 
                      href={processResult.player_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      🎥 Xem video đã xử lý
                    </a>
                    <p className="text-xs text-emerald-600 mt-2">
                      Mở trong tab mới với Cloudinary video player
                    </p>
                  </div>
                </div>
              )}

              {csvData.length > 0 && (
                <div className="mb-4">
                  <h6 className="font-medium text-emerald-700 mb-2">📊 Sự kiện trận đấu</h6>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-auto">
                    <div className="min-w-full">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-2 py-2 text-left font-medium text-gray-700 w-24">Loại sự kiện</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-700 w-16">Lượt đánh</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-700 w-20">Thời gian</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-700 min-w-48">Chi tiết</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvData.map((row, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                              <td className="px-2 py-2 text-gray-800">{row.eventType}</td>
                              <td className="px-2 py-2 text-gray-800">{row.turn}</td>
                              <td className="px-2 py-2 text-gray-800">{row.timestamp}</td>
                              <td className="px-2 py-2 text-gray-800 break-words whitespace-normal text-left" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                {row.details}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {processResult.filename && (
                  <Button
                    onClick={() => downloadVideo()}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium text-sm"
                  >
                    📥 Tải video
                  </Button>
                )}
                <Button
                  onClick={downloadCsv}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm"
                >
                  📊 Tải CSV
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-gray-200">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-gray-500">Kết quả phân tích sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
