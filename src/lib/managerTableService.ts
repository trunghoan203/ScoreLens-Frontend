import axios from './axios';

class ManagerTableService {
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

  async getAllTables() {
    const res = await axios.get('/manager/table', {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async createTable(data: { name: string; category: string; status?: string }) {
    const res = await axios.post('/manager/table', data, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async updateTable(id: string, data: { name: string; category: string; status?: string }) {
    const res = await axios.put(`/manager/table/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async deleteTable(id: string) {
    const res = await axios.delete(`/manager/table/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }
}

export const managerTableService = new ManagerTableService();
export default managerTableService; 