import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n/provider';
import axios from '@/lib/axios';
import { managerTableService } from '@/lib/managerTableService';
import { managerMatchService } from '@/lib/managerMatchService';

interface ProcessVideoResponse {
  success: boolean;
  player_url: string;
  cloudinary_url: string;
  public_id: string;
  events_csv: string;
  filename: string;
  analysis_type: 'pool8' | 'carom';
}

interface RecordedClip {
  id: string;
  name: string;
  url: string;
  size: number;
  duration: number;
  createdAt: string;
  tableId?: string;
  tableName?: string;
  jobId?: string;
  fileName?: string;
  filePath?: string;
  modifiedAt?: string;
}

interface CameraData {
  cameraId: string;
  tableId: string;
}

interface TableData {
  id: string;
  tableId?: string;
  name: string;
  type: string;
  category?: string;
  status: string;
}

interface RecordingData {
  jobId: string;
  fileName?: string;
  size?: number;
  createdAt: string;
  filePath?: string;
  modifiedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  cameras?: T[];
  recordings?: T[];
}

interface MatchRecordingsResponse {
  success: boolean;
  recordings?: RecordingData[];
}

interface MatchData {
  success: boolean;
  match?: {
    startedAt: string;
    [key: string]: any;
  };
}

interface VideoAIProps {
  onVideoProcessed?: (result: ProcessVideoResponse) => void;
  onClose?: () => void;
  className?: string;
  analysisType: 'pool8' | 'carom';
  tableId?: string;
  cameraId?: string;
  matchId?: string;
}

export default function VideoAI({ onVideoProcessed, onClose, className = '', analysisType, tableId, cameraId, matchId }: VideoAIProps) {
  const { t } = useI18n();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<Partial<ProcessVideoResponse>>({});
  const [isDragOver, setIsDragOver] = useState(false);

  const [recordedClips, setRecordedClips] = useState<RecordedClip[]>([]);


  const [loadingClips, setLoadingClips] = useState(false);
  const [selectedClip, setSelectedClip] = useState<RecordedClip | null>(null);
  const [showClipsList, setShowClipsList] = useState(false);
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [nextRefreshTime, setNextRefreshTime] = useState<Date>(new Date(Date.now() + 20000));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const MAX_VIDEO_SIZE_GB = 2;

  const fetchTables = async () => {
    try {
      const tablesData = await managerTableService.getAllTables();
      const tablesArray = Array.isArray(tablesData) ? tablesData : (tablesData as { tables?: TableData[] })?.tables || [];

      const transformedTables: TableData[] = tablesArray.map((table: TableData) => {
        const tableType = table.category || table.type || '';
        return {
          id: table.tableId || table.id || '',
          tableId: table.tableId,
          name: table.name,
          type: tableType,
          status: table.status
        };
      });

      setTables(transformedTables);
      return transformedTables;
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
    return [];
  };

  const fetchCamerasForTable = async () => {
    try {
      const response = await axios.get('/manager/camera');
      const data = response.data as unknown;

      if ((data as { success: boolean; cameras: unknown[] }).success && (data as { success: boolean; cameras: unknown[] }).cameras) {
        const tableCameras = (data as ApiResponse<CameraData>).cameras?.filter((cam: CameraData) =>
          !tableId || cam.tableId === tableId
        ) || [];
        setCameras(tableCameras);
        return tableCameras;
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
    return [];
  };

  const fetchRecordedClips = useCallback(async () => {
    try {
      setLoadingClips(true);
      setLastRefreshTime(new Date());
      setNextRefreshTime(new Date(Date.now() + 20000));

      const allTables = await fetchTables();

      if (matchId) {
        try {
          const data = await managerMatchService.getMatchRecordings(matchId, cameraId) as MatchRecordingsResponse;

          if (data.success && data.recordings && data.recordings.length > 0) {
            const clips: RecordedClip[] = data.recordings.map((recording: unknown) => {
              const rec = recording as {
                jobId: string;
                fileName?: string;
                size?: number;
                createdAt: string;
                filePath?: string;
                modifiedAt?: string;
                cameraId?: string;
                tableId?: string;
              };
              const tableInfo = allTables.find(table => table.id === rec.tableId || table.tableId === rec.tableId);
              const tableName = tableInfo ?
                (tableInfo.type ? `${tableInfo.name} (${tableInfo.type})` : tableInfo.name) :
                `Bàn ${rec.tableId || tableId}`;
              return {
                id: rec.jobId,
                name: rec.fileName || `Recording_${rec.jobId}`,
                url: `/manager/camera/${rec.cameraId}/recordings/${rec.jobId}/stream`,
                size: rec.size || 0,
                duration: 0,
                createdAt: rec.createdAt,
                tableId: rec.tableId,
                tableName: tableName,
                jobId: rec.jobId,
                fileName: rec.fileName,
                filePath: rec.filePath,
                modifiedAt: rec.modifiedAt
              };
            });
            setRecordedClips(clips);
            return;
          } else {
            try {
              const matchData = await managerMatchService.getMatchById(matchId) as MatchData;

              const match = (matchData as any).data || matchData.match;

              if (matchData.success && (match?.startedAt || match?.createdAt || match?.startTime)) {
                const startTime = match?.startedAt || match?.createdAt || match?.startTime;
                const matchStartTime = new Date(startTime);

                const tableCameras = await fetchCamerasForTable();
                const allRecordings: RecordedClip[] = [];

                for (const camera of tableCameras) {
                  try {
                    const response = await axios.get(`/manager/camera/${camera.cameraId}/recordings`);
                    const data = response.data as ApiResponse<RecordingData>;

                    if (data.success && data.recordings) {
                      const clips: RecordedClip[] = data.recordings
                        .filter((recording: RecordingData) => {
                          const recordingTime = new Date(recording.createdAt);
                          const isAfterMatchStart = recordingTime >= matchStartTime;
                          return isAfterMatchStart;
                        })
                        .map((recording: RecordingData) => {
                          const tableInfo = allTables.find(table => table.id === camera.tableId || table.tableId === camera.tableId);
                          const tableName = tableInfo ?
                            (tableInfo.type ? `${tableInfo.name} (${tableInfo.type})` : tableInfo.name) :
                            `Bàn ${camera.tableId}`;

                          return {
                            id: `${camera.cameraId}_${recording.jobId}`,
                            name: recording.fileName || `Recording_${recording.jobId}`,
                            url: `/manager/camera/${camera.cameraId}/recordings/${recording.jobId}/stream`,
                            size: recording.size || 0,
                            duration: 0,
                            createdAt: recording.createdAt,
                            tableId: camera.tableId,
                            tableName: tableName,
                            jobId: recording.jobId,
                            fileName: recording.fileName,
                            filePath: recording.filePath,
                            modifiedAt: recording.modifiedAt
                          };
                        });
                      allRecordings.push(...clips);
                    }
                  } catch (error) {
                    console.error(`Error fetching recordings for camera ${camera.cameraId}:`, error);
                  }
                }

                allRecordings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setRecordedClips(allRecordings);
                return;
              }
            } catch (matchError) {
              console.error('Error fetching match data for filtering:', matchError);
              toast.error('Không thể tải danh sách video của trận đấu');
            }
          }
        } catch (error) {
          console.error('Match recordings API error:', error);
          try {
            const matchData = await managerMatchService.getMatchById(matchId) as MatchData;

            const match = (matchData as any).data || matchData.match;

            if (matchData.success && (match?.startedAt || match?.createdAt || match?.startTime)) {
              const startTime = match?.startedAt || match?.createdAt || match?.startTime;
              const matchStartTime = new Date(startTime);


              const tableCameras = await fetchCamerasForTable();
              const allRecordings: RecordedClip[] = [];

              for (const camera of tableCameras) {
                try {
                  const response = await axios.get(`/manager/camera/${camera.cameraId}/recordings`);
                  const data = response.data as ApiResponse<RecordingData>;

                  if (data.success && data.recordings) {
                    const clips: RecordedClip[] = data.recordings
                      .filter((recording: RecordingData) => {
                        const recordingTime = new Date(recording.createdAt);
                        const isAfterMatchStart = recordingTime >= matchStartTime;
                        return isAfterMatchStart;
                      })
                      .map((recording: RecordingData) => {
                        const tableInfo = allTables.find(table => table.id === camera.tableId || table.tableId === camera.tableId);
                        const tableName = tableInfo ?
                          (tableInfo.type ? `${tableInfo.name} (${tableInfo.type})` : tableInfo.name) :
                          `Bàn ${camera.tableId}`;

                        return {
                          id: `${camera.cameraId}_${recording.jobId}`,
                          name: recording.fileName || `Recording_${recording.jobId}`,
                          url: `/manager/camera/${camera.cameraId}/recordings/${recording.jobId}/stream`,
                          size: recording.size || 0,
                          duration: 0,
                          createdAt: recording.createdAt,
                          tableId: camera.tableId,
                          tableName: tableName,
                          jobId: recording.jobId,
                          fileName: recording.fileName,
                          filePath: recording.filePath,
                          modifiedAt: recording.modifiedAt
                        };
                      });
                    allRecordings.push(...clips);
                  }
                } catch (error) {
                  console.error(`Error fetching recordings for camera ${camera.cameraId}:`, error);
                }
              }

              allRecordings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setRecordedClips(allRecordings);
              return;
            }
          } catch (matchError) {
            console.error('Error fetching match data for filtering:', matchError);
            toast.error('Không thể tải danh sách video của trận đấu');
          }
        }
      }

      if (cameraId) {
        try {
          const response = await axios.get(`/manager/camera/${cameraId}/recordings`);
          const data = response.data as unknown;

          if ((data as { success: boolean; recordings: unknown[] }).success && (data as { success: boolean; recordings: unknown[] }).recordings) {
            const clips: RecordedClip[] = (data as { success: boolean; recordings: unknown[] }).recordings.map((recording: unknown) => {
              const rec = recording as {
                jobId: string;
                fileName?: string;
                size?: number;
                createdAt: string;
                filePath?: string;
                modifiedAt?: string;
              };
              const tableInfo = allTables.find(table => table.id === tableId || table.tableId === tableId);
              const tableName = tableInfo ?
                (tableInfo.type ? `${tableInfo.name} (${tableInfo.type})` : tableInfo.name) :
                `Bàn ${tableId}`;
              return {
                id: rec.jobId,
                name: rec.fileName || `Recording_${rec.jobId}`,
                url: `/manager/camera/${cameraId}/recordings/${rec.jobId}/stream`,
                size: rec.size || 0,
                duration: 0,
                createdAt: rec.createdAt,
                tableId: tableId,
                tableName: tableName,
                jobId: rec.jobId,
                fileName: rec.fileName,
                filePath: rec.filePath,
                modifiedAt: rec.modifiedAt
              };
            });
            setRecordedClips(clips);
            return;
          }
        } catch (error) {
          console.error('Recordings API error for camera:', cameraId, error);
        }
      }

      const tableCameras = await fetchCamerasForTable();
      if (tableCameras.length === 0) {
        setRecordedClips([]);
        return;
      }

      const allRecordings: RecordedClip[] = [];

      for (const camera of tableCameras) {
        try {
          const response = await axios.get(`/manager/camera/${camera.cameraId}/recordings`);
          const data = response.data as ApiResponse<RecordingData>;

          if (data.success && data.recordings) {
            const clips: RecordedClip[] = data.recordings.map((recording: RecordingData) => {
              const tableInfo = allTables.find(table => table.id === camera.tableId || table.tableId === camera.tableId);
              const tableName = tableInfo ?
                (tableInfo.type ? `${tableInfo.name} (${tableInfo.type})` : tableInfo.name) :
                `Bàn ${camera.tableId}`;

              return {
                id: `${camera.cameraId}_${recording.jobId}`,
                name: recording.fileName || `Recording_${recording.jobId}`,
                url: `/manager/camera/${camera.cameraId}/recordings/${recording.jobId}/stream`,
                size: recording.size || 0,
                duration: 0,
                createdAt: recording.createdAt,
                tableId: camera.tableId,
                tableName: tableName,
                jobId: recording.jobId,
                fileName: recording.fileName,
                filePath: recording.filePath,
                modifiedAt: recording.modifiedAt
              };
            });
            allRecordings.push(...clips);
          }
        } catch (error) {
          console.error(`Error fetching recordings for camera ${camera.cameraId}:`, error);
        }
      }

      allRecordings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecordedClips(allRecordings);

    } catch (error) {
      console.error('Error fetching recorded clips:', error);
      toast.error(t('shared.videoAI.cannotLoadClips'));
    } finally {
      setLoadingClips(false);
    }
  }, [tableId, cameraId, matchId]);

  useEffect(() => {
    fetchRecordedClips();
  }, [fetchRecordedClips]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRecordedClips();
      setLastRefreshTime(new Date());
      setNextRefreshTime(new Date(Date.now() + 20000));
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchRecordedClips]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = Math.max(0, Math.ceil((nextRefreshTime.getTime() - now.getTime()) / 1000));

      if (timeLeft === 0) {
        setNextRefreshTime(new Date(Date.now() + 20000));
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [nextRefreshTime]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClipSelect = async (clip: RecordedClip) => {
    try {
      setSelectedClip(clip);
      setShowClipsList(false);

      const mockFile = new File([], clip.name, {
        type: 'video/mp4',
        lastModified: new Date(clip.createdAt).getTime()
      });

      const videoUrl = `http://localhost:8000/api${clip.url}`;

      setVideoFile(mockFile);
      setVideoUrl(videoUrl);

      toast.success(t('shared.videoAI.clipSelectedSuccess').replace('{name}', clip.name));
    } catch (error) {
      console.error('Error selecting clip:', error);
      toast.error(t('shared.videoAI.cannotSelectClip'));
    }
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('video/')) {
      toast.error(t('shared.videoAI.pleaseSelectVideoFormat'));
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
    setSelectedClip(null);
  };

  const processVideo = async () => {
    if (!videoFile && !selectedClip) {
      toast.error(t('shared.videoAI.pleaseSelectVideo'));
      return;
    }

    try {
      setProcessing(true);

      if (selectedClip) {
        toast.success(t('shared.videoAI.analyzingClip').replace('{name}', selectedClip.name));

        const formData = new FormData();
        formData.append('analysis_type', analysisType);
        if (selectedClip.filePath) {
          try {
            const videoUrl = `http://localhost:8000/api${selectedClip.url}`;
            const response = await fetch(videoUrl);
            
            if (!response.ok) {
              throw new Error('Failed to fetch video file');
            }
            
            const videoBlob = await response.blob();
            const fileName = selectedClip.fileName || 'video.mp4';
            const videoFile = new File([videoBlob], fileName, {
              type: 'video/mp4',
              lastModified: new Date(selectedClip.createdAt).getTime()
            });
            
            formData.append('video', videoFile);
          } catch (error) {
            console.error('Error fetching video file:', error);
            toast.error('Không thể tải file video từ server');
            return;
          }
        }

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
      } else {
        const formData = new FormData();
        formData.append('video', videoFile!);
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
    setSelectedClip(null);
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h5 className="text-base font-semibold text-gray-700">
              {t('shared.videoAI.recordedClips')} ({recordedClips.length})
              {tableId && !matchId && <span className="text-sm text-gray-500 ml-2">{t('shared.videoAI.tableInfo').replace('{tableId}', tableId)}</span>}
              {cameraId && !matchId && <span className="text-sm text-gray-500 ml-2">{t('shared.videoAI.cameraInfo').replace('{cameraId}', cameraId)}</span>}
            </h5>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-400">
                {t('shared.videoAI.lastUpdate')}: {lastRefreshTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchRecordedClips}
              disabled={loadingClips}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              {loadingClips ? (
                <div className="flex items-center gap-1">
                  <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                  {t('shared.videoAI.refreshing')}
                </div>
              ) : (
                t('shared.videoAI.refresh')
              )}
            </Button>
            <Button
              onClick={() => setShowClipsList(!showClipsList)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              {showClipsList ? t('shared.videoAI.hideList') : t('shared.videoAI.showList')}
            </Button>
          </div>
        </div>

        {showClipsList && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
            {loadingClips ? (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">{t('shared.videoAI.loadingClips')}</p>
              </div>
            ) : recordedClips.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">{t('shared.videoAI.noClipsRecorded')}</p>
                {tableId && (
                  <p className="text-xs text-gray-400 mt-1">
                    {t('shared.videoAI.useRecordButton')}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {recordedClips.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => handleClipSelect(clip)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-300 ${selectedClip?.id === clip.id
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-white border-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{clip.name}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{clip.tableName || t('shared.videoAI.unknown')}</span>
                          <span>{formatFileSize(clip.size)}</span>
                          {clip.duration > 0 && <span>{formatDuration(clip.duration)}</span>}
                          <span>{formatDate(clip.createdAt)}</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedClip && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">{t('shared.videoAI.clipSelected').replace('{name}', selectedClip.name)}</p>
                <p className="text-sm text-green-600">
                  {selectedClip.tableName} • {formatFileSize(selectedClip.size)}
                  {selectedClip.duration > 0 && ` • ${formatDuration(selectedClip.duration)}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedClip(null);
                  clearVideo();
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                {t('shared.videoAI.deselect')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          {!videoUrl && !selectedClip ? (
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
                    {recordedClips.length > 0 && (
                      <p className="text-xs text-blue-600 mt-2">
                        {t('shared.videoAI.orSelectFromList')}
                      </p>
                    )}
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
              {selectedClip ? (
                <div className="space-y-3">
                  <video
                    src={videoUrl ?? ''}
                    controls
                    className="w-full rounded-lg border"
                    crossOrigin="anonymous"
                    preload="metadata"
                  >
                    {t('shared.videoAI.yourBrowserNotSupport')}
                  </video>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="font-medium text-gray-800">{selectedClip.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedClip.tableName} • {formatFileSize(selectedClip.size)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('shared.videoAI.createdAt')} {formatDate(selectedClip.createdAt)}
                    </p>
                  </div>
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">
                      {t('shared.videoAI.clipSelectedFromRecordings')}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {t('shared.videoAI.readyForAnalysis')}
                    </p>
                  </div>
                </div>
              ) : videoFile && videoUrl ? (
                <>
                  <video src={videoUrl ?? ''} controls className="w-full rounded-lg border">
                    {t('shared.videoAI.yourBrowserNotSupport')}
                  </video>
                  <p className="text-sm text-gray-600 mt-2">
                    {videoFile?.name} ({(videoFile?.size / (1024 * 1024 * 1024)).toFixed(1)}GB)
                  </p>
                </>
              ) : null}
            </div>
          )}

          <div className="mt-4">
            <Button
              onClick={processVideo}
              disabled={processing || (!videoFile && !selectedClip)}
              className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${!videoFile && !selectedClip
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

      {onClose && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            {t('common.close')}
          </Button>
        </div>
      )}
    </div>
  );
}
