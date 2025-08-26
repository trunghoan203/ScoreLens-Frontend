import axios from './axios';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

class ManagerMemberService {
  private getTranslation(key: string): string {
    const translations: Record<string, string> = {
      'shared.services.managerMember.phoneNumberAlreadyUsed': 'Phone number is already used by another member',
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

  async getAllMembers() {
    const res = await axios.get('/manager/membership', {
      headers: this.getAuthHeaders(),
    });
    return res.data;
  }

  async createMember(data: { fullName: string; phoneNumber: string }) {
    try {
      const res = await axios.post('/manager/membership', data, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.message === 'Số điện thoại đã được sử dụng bởi hội viên khác') {
        throw new Error(this.getTranslation('shared.services.managerMember.phoneNumberAlreadyUsed'));
      }
      throw error;
    }
  }

  async updateMember(id: string, data: { fullName: string; phoneNumber: string; status?: 'active' | 'inactive' }) {
    try {
      const res = await axios.put(`/manager/membership/${id}`, data, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.message === 'Số điện thoại đã được sử dụng bởi hội viên khác') {
        throw new Error(this.getTranslation('shared.services.managerMember.phoneNumberAlreadyUsed'));
      }
      throw error;
    }
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