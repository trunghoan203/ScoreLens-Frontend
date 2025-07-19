import axios from './axios';

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
    const res = await axios.get('/manager/camera', {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async createCamera(data: { 
    tableId: string; 
    IPAddress: string; 
    username: string; 
    password: string; 
  }) {
    const res = await axios.post('/manager/camera', data, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async updateCamera(id: string, data: { 
    tableId?: string;
    IPAddress?: string; 
    username?: string; 
    password?: string; 
    isConnect?: boolean; 
  }) {
    const res = await axios.put(`/manager/camera/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async deleteCamera(id: string) {
    const res = await axios.delete(`/manager/camera/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }
}

export const managerCameraService = new ManagerCameraService();
export default managerCameraService; 