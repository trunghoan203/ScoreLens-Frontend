import axios from './axios';

class ManagerMemberService {
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

  async getAllMembers() {
    const res = await axios.get('/manager/membership', {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async createMember(data: { fullName: string; phoneNumber: string }) {
    const res = await axios.post('/manager/membership', data, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async updateMember(id: string, data: { fullName: string; phoneNumber: string }) {
    const res = await axios.put(`/manager/membership/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async deleteMember(id: string) {
    const res = await axios.delete(`/manager/membership/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }
}

export const managerMemberService = new ManagerMemberService();
export default managerMemberService; 