import axios from './axios';

class ManagerFeedbackService {
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

  async getAllFeedbacks() {
    const res = await axios.get('/manager/feedback', {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async getFeedbackDetail(id: string) {
    const res = await axios.get(`/manager/feedback/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async updateFeedback(id: string, data: { 
    note?: string; 
    status?: string; 
    needSupport?: boolean; 
  }) {
    const res = await axios.put(`/manager/feedback/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }
}

export const managerFeedbackService = new ManagerFeedbackService();
export default managerFeedbackService; 