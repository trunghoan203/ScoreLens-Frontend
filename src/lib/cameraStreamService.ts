import JSMpeg from '@cycjimmy/jsmpeg-player';

export interface StreamResponse {
  success: boolean;
  message: string;
  streamUrl?: string;
}

export class CameraStreamService {
  private player: any = null;
  private currentCameraId: string | null = null;

  constructor() {
  }

  private getManagerToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('managerAccessToken');
    }
    return null;
  }

  async startVideoStream(cameraId: string, canvasElement: HTMLCanvasElement): Promise<StreamResponse> {
    try {
      const managerToken = this.getManagerToken();
      if (!managerToken) {
        throw new Error('Manager token not found');
      }

      await this.connectCamera(cameraId, managerToken);

      this.createPlayer(canvasElement, cameraId);

      this.currentCameraId = cameraId;

      return {
        success: true,
        message: 'Video stream started successfully'
      };

    } catch (error) {
      console.error('Error starting video stream:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start video stream'
      };
    }
  }

  private async connectCamera(cameraId: string, managerToken: string) {
    try {
      const response = await fetch(`http://localhost:8000/api/manager/camera/${cameraId}/stream/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${managerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to connect camera: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error connecting camera:', error);
      throw error;
    }
  }

  private createPlayer(canvasElement: HTMLCanvasElement, cameraId: string) {
    try {
      if (this.player) {
        this.player.destroy();
      }
      const wsUrl = `ws://${window.location.hostname}:8000/api/stream?cameraId=${cameraId}`;

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
        },
        onClose: () => {
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
      if (!managerToken) {
        throw new Error('Manager token not found');
      } 
      await fetch(`http://localhost:8000/api/manager/camera/${cameraId}/stream/stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${managerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (this.player) {
        this.player.destroy();
        this.player = null;
      }

      this.currentCameraId = null;

      return {
        success: true,
        message: 'Video stream stopped successfully'
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

  disconnect() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    this.currentCameraId = null;
  }
}

export const cameraStreamService = new CameraStreamService();
export default cameraStreamService;
