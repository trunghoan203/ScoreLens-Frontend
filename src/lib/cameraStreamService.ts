import JSMpeg from '@cycjimmy/jsmpeg-player';
import axios from '@/lib/axios';

export interface StreamResponse {
  success: boolean;
  message: string;
  streamUrl?: string;
  streamInfo?: {
    isNewStream: boolean;
    viewerCount: number;
    startTime: Date;
  };
  cameraInfo?: {
    cameraId: string;
    IPAddress: string;
    tableId: string;
  };
}

export interface StreamStatus {
  isActive: boolean;
  viewerCount: number;
  startTime: Date;
  wsUrl: string;
}

export class CameraStreamService {
  private player: any = null;
  private currentCameraId: string | null = null;
  private streamInfo: any = null;

  constructor() {
  }

  private getManagerToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('managerAccessToken');
    }
    return null;
  }

  private getSessionToken(): string | null {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const matchId = urlParams.get('matchId');
      if (matchId) {
        const sessionKey = `sl:session:${matchId}`;
        const session = JSON.parse(localStorage.getItem(sessionKey) || '{}');
        if (session.sessionToken) {
          return session.sessionToken;
        }
        
        const fallbackSession = JSON.parse(localStorage.getItem(`session_${matchId}`) || '{}');
        if (fallbackSession.sessionToken) {
          return fallbackSession.sessionToken;
        }
        
        const directToken = localStorage.getItem(`sessionToken_${matchId}`);
        if (directToken) {
          return directToken;
        }
        
        const globalToken = localStorage.getItem('sessionToken');
        if (globalToken) {
          return globalToken;
        }
      }
    }
    return null;
  }

  async startVideoStream(cameraId: string, canvasElement: HTMLCanvasElement, providedSessionToken?: string): Promise<StreamResponse> {
    try {
      const managerToken = this.getManagerToken();
      const sessionToken = providedSessionToken || this.getSessionToken();
      
      if (!managerToken && !sessionToken) {
        throw new Error('No authentication token found');
      }

      if (this.player) {
        try {
          this.player.destroy();
          this.player = null;
        } catch (error) {
          console.warn('Error destroying existing player:', error);
        }
      }

      const response = await this.connectCamera(cameraId, managerToken, sessionToken);
      await new Promise(resolve => setTimeout(resolve, 200));
      this.createPlayer(canvasElement, cameraId, response.wsUrl);

      this.currentCameraId = cameraId;
      this.streamInfo = response.streamInfo;

      return {
        success: true,
        message: response.message,
        streamInfo: response.streamInfo,
        cameraInfo: response.cameraInfo
      };

    } catch (error) {
      console.error('Error starting video stream:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start video stream'
      };
    }
  }

  private async connectCamera(cameraId: string, managerToken?: string | null, sessionToken?: string | null) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (managerToken) {
        headers['Authorization'] = `Bearer ${managerToken}`;
      } else if (sessionToken) {
        headers['X-Session-Token'] = sessionToken;
      }

      const response = await axios.post(`/manager/camera/${cameraId}/stream/start`, {}, {
        headers
      });

      return response.data as any;

    } catch (error) {
      console.error('Error connecting camera:', error);
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
      throw error;
    }
  }

  private createPlayer(canvasElement: HTMLCanvasElement, cameraId: string, wsUrl: string) {
    try {
      if (this.player) {
        this.player.destroy();
      }

      if (typeof JSMpeg === 'undefined') {
        throw new Error('JSMpeg not loaded');
      }
      
      this.player = new JSMpeg.Player(wsUrl, {
        canvas: canvasElement,
        audio: false,
        autoplay: true,
        onPlay: () => {
        },
        onError: (err: any) => {
          console.error('JSMpeg error:', err);
          throw new Error('Failed to connect to camera stream: ' + (err.message || 'Unknown error'));
        },
        onClose: () => {
          console.log('Camera stream closed');
        }
      });

    } catch (error) {
      console.error('Error creating JSMpeg player:', error);
      throw error;
    }
  }

  async stopVideoStream(cameraId: string): Promise<StreamResponse> {
    try {
      const managerToken = this.getManagerToken();
      const sessionToken = this.getSessionToken();
      
      if (!managerToken && !sessionToken) {
        throw new Error('No authentication token found');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (managerToken) {
        headers['Authorization'] = `Bearer ${managerToken}`;
      } else if (sessionToken) {
        headers['Authorization'] = `Session ${sessionToken}`;
      }

      const response = await axios.post(`/manager/camera/${cameraId}/stream/stop`, {}, {
        headers
      });

      const data = response.data as any;

      if (this.player) {
        this.player.destroy();
        this.player = null;
      }

      this.currentCameraId = null;
      this.streamInfo = null;

      return {
        success: true,
        message: data.message,
        streamInfo: data.streamInfo
      };

    } catch (error) {
      console.error('Error stopping video stream:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to stop video stream'
      };
    }
  }

  isStreaming(): boolean {
    return this.currentCameraId !== null && this.player !== null;
  }

  getCurrentCameraId(): string | null {
    return this.currentCameraId;
  }

  getStreamInfo(): any {
    return this.streamInfo;
  }

  getViewerCount(): number {
    return this.streamInfo?.viewerCount || 0;
  }

  disconnect() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    this.currentCameraId = null;
    this.streamInfo = null;
  }
}

export const cameraStreamService = new CameraStreamService();
export default cameraStreamService;
