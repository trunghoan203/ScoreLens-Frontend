import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n/provider';

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
  const { t } = useI18n();
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
      toast.error('Vui lòng chọn đúng định dạng video!');
      return false;
    }
    if (file.size > MAX_VIDEO_SIZE_GB * 1024 * 1024 * 1024) {
      toast.error(t('shared.videoAI.maxSize').replace('{size}', MAX_VIDEO_SIZE_GB.toString()));
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
      toast.error(t('shared.videoAI.pleaseSelectVideo'));
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
        throw new Error(t('shared.videoAI.errorSendingVideo'));
      }

      const data = await res.json();
      setProcessResult(data);

      if (onVideoProcessed) {
        onVideoProcessed(data as ProcessVideoResponse);
        toast.success(t('shared.videoAI.aiResultSent'));
      }

      if (data?.success) {
        toast.success(t('shared.videoAI.processingScore'));
      } else {
        toast.error(t('shared.videoAI.videoAnalysisError'));
      }
    } catch (error) {
      console.error('[VideoAI] processVideo error:', error);
      toast.error(t('shared.videoAI.videoAnalysisError'));
    } finally {
      setProcessing(false);
    }
  };

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
      toast.error(t('shared.videoAI.pleaseDropVideo'));
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
      const filename = processResult.filename || 'video.mp4';
      toast.success(t('shared.videoAI.downloadingVideo').replace('{filename}', filename));

      const response = await fetch(processResult.cloudinary_url!);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(t('shared.videoAI.videoDownloaded').replace('{filename}', filename));
    } catch (error) {
      console.error('Lỗi khi tải video:', error);
      toast.error(t('shared.videoAI.videoDownloadError'));
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
    <div className={`bg-white rounded-lg shadow p-4 sm:p-6 ${className}`}>
      <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center text-gray-800">
        {t('shared.videoAI.title')}
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          {!videoUrl ? (
            <div
              ref={dropZoneRef}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleFileSelect}
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${isDragOver
                ? 'border-lime-500 bg-lime-50 scale-105'
                : videoFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-lime-400 hover:bg-lime-25'
                }`}
            >
              {videoFile ? (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-base sm:text-lg font-medium text-green-700 mb-2">
                      {t('shared.videoAI.videoSelected').replace('{name}', videoFile.name)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('shared.videoAI.pressAnalyze')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                      {t('shared.videoAI.addVideoHere')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('shared.videoAI.supportedFormats')} • {t('shared.videoAI.maxSize').replace('{size}', MAX_VIDEO_SIZE_GB.toString())}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium text-green-700">{t('shared.videoAI.videoUploaded')}</p>
                <button
                  onClick={clearVideo}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  {t('shared.videoAI.clear')}
                </button>
              </div>
              <video src={videoUrl} controls className="w-full rounded-lg border">
                {t('shared.videoAI.yourBrowserNotSupport')}
              </video>
              {videoFile && (
                <p className="text-sm text-gray-600 mt-2">
                  {videoFile.name} ({(videoFile.size / (1024 * 1024 * 1024)).toFixed(1)}GB)
                </p>
              )}
            </div>
          )}

          <div className="mt-4">
            <Button
              onClick={processVideo}
              disabled={processing || !videoFile}
              className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${!videoFile
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : processing
                  ? 'bg-orange-500 text-white'
                  : 'bg-lime-400 hover:bg-lime-500 text-white'
                }`}
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {t('shared.videoAI.analyzing')}
                </div>
              ) : (
                t('shared.videoAI.analyzeVideo')
              )}
            </Button>
          </div>
        </div>

        <div>
          {processResult.success ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h5 className="font-semibold text-gray-800 mb-3 text-center">
                {t('shared.videoAI.analysisResults')}
              </h5>

              <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                <div className="space-y-2 text-sm">
                  <p><strong>{t('shared.videoAI.analysisType')}</strong> {analysisType === 'pool8' ? t('shared.videoAI.pool8Ball') : t('shared.videoAI.carom')}</p>
                  <p><strong>{t('shared.videoAI.fileName')}</strong> {processResult.filename || t('shared.videoAI.notAvailable')}</p>
                </div>
              </div>

              {processResult.cloudinary_url && (
                <div className="mb-4">
                  <h6 className="font-medium text-gray-700 mb-2">{t('shared.videoAI.processedVideo')}</h6>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <a
                      href={processResult.player_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      {t('shared.videoAI.viewProcessedVideo')}
                    </a>
                  </div>
                </div>
              )}

              {csvData.length > 0 && (
                <div className="mb-4">
                  <h6 className="font-medium text-gray-700 mb-2">{t('shared.videoAI.matchEvents')}</h6>
                  <div className="bg-white rounded-lg border border-gray-200 max-h-48 overflow-auto">
                    <div className="min-w-full">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-2 py-2 text-left font-medium text-gray-700 w-20">{t('shared.videoAI.eventType')}</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-700 w-12">{t('shared.videoAI.turn')}</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-700 w-16">{t('shared.videoAI.time')}</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-700">{t('shared.videoAI.details')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvData.map((row, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-2 py-2 text-gray-800">{row.eventType}</td>
                              <td className="px-2 py-2 text-gray-800">{row.turn}</td>
                              <td className="px-2 py-2 text-gray-800">{row.timestamp}</td>
                              <td className="px-2 py-2 text-gray-800 break-words text-left">
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
                    onClick={downloadVideo}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium text-sm"
                  >
                    {t('shared.videoAI.downloadVideo')}
                  </Button>
                )}
                <Button
                  onClick={downloadCsv}
                  className="flex-1 bg-lime-400 hover:bg-lime-500 text-white py-2 rounded-lg font-medium text-sm"
                >
                  {t('shared.videoAI.downloadCsv')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <p className="text-gray-500">{t('shared.videoAI.analysisResultsWillShow')}</p>
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
