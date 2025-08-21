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

class ManagerCameraService {
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
        message: error.response?.data?.message || error.message || 'Failed to create camera',
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
        message: error.response?.data?.message || error.message || 'Failed to test camera connection',
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
}

export const managerCameraService = new ManagerCameraService();
export default managerCameraService; 