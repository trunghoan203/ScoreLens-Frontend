import axios from './axios';

class AdminFeedbackService {
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminAccessToken');
    }
    return null;
  }

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAllFeedbacks() {
    const res = await axios.get('/admin/feedback', {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async getFeedbackDetail(id: string) {
    const res = await axios.get(`/admin/feedback/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async updateFeedback(id: string, data: { 
    note?: string; 
    status?: string; 
    needSupport?: boolean; 
  }) {
    const res = await axios.put(`/admin/feedback/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }
}

export const adminFeedbackService = new AdminFeedbackService();
export default adminFeedbackService; 