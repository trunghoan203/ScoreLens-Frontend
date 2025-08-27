import axios from './axios';

export interface CameraInfo {
  rtspUrl: string;
  resolution: string;
  fps: number;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  cameraInfo?: CameraInfo;
  error?: string;
  isConnect?: boolean;
  isConnectUpdated?: boolean;
}

export interface RecordResponse {
  success: boolean;
  message: string;
  jobId?: string;
  file?: {
    name: string;
    path: string;
    size: number;
  };
  ai?: {
    success: boolean;
    result?: string;
    score?: number;
    detections?: any[];
    error?: string;
  };
  duration: number;
}

export interface Recording {
  jobId: string;
  fileName: string;
  filePath: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
}

export interface RecordingsResponse {
  success: boolean;
  cameraId: string;
  recordings: Recording[];
}

export interface DeleteRecordingResponse {
  success: boolean;
  message: string;
}

export interface CleanupResponse {
  success: boolean;
  message: string;
  deletedCount: number;
  maxAgeHours: number;
}

export interface TestPingResponse {
  success: boolean;
  message: string;
  ipAddress: string;
  pingResult?: string;
  error?: string;
}

class ManagerCameraService {
  private getTranslation(key: string): string {
    const translations: Record<string, string> = {
      'shared.services.managerCamera.failedToCreateCamera': 'Failed to create camera',
      'shared.services.managerCamera.failedToTestConnection': 'Failed to test camera connection',
      'shared.services.managerCamera.failedToTestPing': 'Failed to test camera ping',
      'shared.services.managerCamera.networkError': 'Network error',
      'shared.services.managerCamera.unknownError': 'Unknown error',
      'shared.services.managerCamera.errorOccurred': 'An error occurred',
    };
    return translations[key] || key;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('managerAccessToken');
    }
    return null;
  }

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAllCameras() {
    try {
      const res = await axios.get('/manager/camera', {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error getting cameras:', error);
      throw error;
    }
  }

  async createCamera(data: {
    tableId: string;
    IPAddress: string;
    username: string;
    password: string;
    isConnect?: boolean;
  }) {
    try {
      const res = await axios.post('/manager/camera', data, {
        headers: this.getAuthHeaders(),
      });

      return res.data;
    } catch (error: any) {
      console.error('Error creating camera:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);

      return {
        success: false,
        message: error.response?.data?.message || error.message || this.getTranslation('shared.services.managerCamera.failedToCreateCamera'),
        error: error.response?.data || error.message
      };
    }
  }

  async updateCamera(id: string, data: {
    tableId?: string;
    IPAddress?: string;
    username?: string;
    password?: string;
    isConnect?: boolean;
  }) {
    try {
      const res = await axios.put(`/manager/camera/${id}`, data, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error updating camera:', error);
      throw error;
    }
  }

  async deleteCamera(id: string) {
    try {
      const res = await axios.delete(`/manager/camera/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error deleting camera:', error);
      throw error;
    }
  }

  async testConnection(data: {
    IPAddress: string;
    username: string;
    password: string;
    port?: string;
  }): Promise<TestConnectionResponse> {
    try {
      const res = await axios.post('/manager/camera/test-connection', data, {
        headers: this.getAuthHeaders(),
      });

      return res.data as TestConnectionResponse;
    } catch (error: any) {
      console.error('Error testing camera connection:', error);
      console.error('Error response:', error.response?.data);

      return {
        success: false,
        message: error.response?.data?.message || error.message || this.getTranslation('shared.services.managerCamera.failedToTestConnection'),
        error: error.response?.data || error.message
      };
    }
  }

  async startVideoStream(cameraId: string) {
    try {
      const res = await axios.post(`/manager/camera/${cameraId}/stream/start`, {}, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error starting video stream:', error);
      throw error;
    }
  }

  async stopVideoStream(cameraId: string) {
    try {
      const res = await axios.post(`/manager/camera/${cameraId}/stream/stop`, {}, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error stopping video stream:', error);
      throw error;
    }
  }

  async recordCamera(cameraId: string, duration?: number): Promise<RecordResponse> {
    try {
      const params = new URLSearchParams();
      if (duration) {
        params.append('duration', duration.toString());
      }

      const response = await axios.post(
        `/manager/camera/${cameraId}/record?${params.toString()}`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response.data as RecordResponse;
    } catch (error: unknown) {
      console.error('Error recording camera:', error);
      throw this.handleError(error);
    }
  }

  async getCameraRecordings(cameraId: string): Promise<RecordingsResponse> {
    try {
      const response = await axios.get(
        `/manager/camera/${cameraId}/recordings`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response.data as RecordingsResponse;
    } catch (error: unknown) {
      console.error('Error getting camera recordings:', error);
      throw this.handleError(error);
    }
  }

  async deleteCameraRecording(cameraId: string, jobId: string): Promise<DeleteRecordingResponse> {
    try {
      const response = await axios.delete(
        `/manager/camera/${cameraId}/recordings/${jobId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response.data as DeleteRecordingResponse;
    } catch (error: unknown) {
      console.error('Error deleting camera recording:', error);
      throw this.handleError(error);
    }
  }

  async cleanupCameraRecordings(cameraId: string, maxAgeHours?: number): Promise<CleanupResponse> {
    try {
      const params = new URLSearchParams();
      if (maxAgeHours) {
        params.append('maxAgeHours', maxAgeHours.toString());
      }

      const response = await axios.post(
        `/manager/camera/${cameraId}/recordings/cleanup?${params.toString()}`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response.data as CleanupResponse;
    } catch (error: unknown) {
      console.error('Error cleaning up camera recordings:', error);
      throw this.handleError(error);
    }
  }
  async testCameraPing(cameraId: string): Promise<TestPingResponse> {
    try {
      const response = await axios.get(
        `/manager/camera/${cameraId}/test-ping`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response.data as TestPingResponse;
    } catch (error: unknown) {
      console.error('Error testing camera ping:', error);

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        if (axiosError.response?.data) {
          const responseData = axiosError.response.data as { message?: string; error?: string };
          return {
            success: false,
            message: responseData.message || this.getTranslation('shared.services.managerCamera.failedToTestPing'),
            error: responseData.error || this.getTranslation('shared.services.managerCamera.unknownError'),
            ipAddress: ''
          };
        }
      }

      return {
        success: false,
        message: this.getTranslation('shared.services.managerCamera.failedToTestPing'),
        error: this.getTranslation('shared.services.managerCamera.networkError'),
        ipAddress: ''
      };
    }
  }
  private handleError(error: unknown): Error {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown } };
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data as { message?: string };
        const enhancedError = new Error(responseData.message || this.getTranslation('shared.services.managerCamera.errorOccurred'));
        (enhancedError as { response?: unknown }).response = axiosError.response;
        return enhancedError;
      }
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errorWithMessage = error as { message: string };
      return new Error(errorWithMessage.message);
    }
    return new Error(this.getTranslation('shared.services.managerCamera.unknownError'));
  }
}

export const managerCameraService = new ManagerCameraService();
export default managerCameraService; 