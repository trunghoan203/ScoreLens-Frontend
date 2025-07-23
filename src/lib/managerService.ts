import axios from './axios';

class ManagerService {
  async login(email: string) {
    try {
      const res = await axios.post('/manager/login', { email });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyLogin(email: string, activationCode: string) {
    try {
      const res = await axios.post('/manager/login/verify', { email, activationCode });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      const res = await axios.post('/manager/logout');
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resendLoginCode(email: string) {
    try {
      const res = await axios.post('/manager/resend-login-code', { email });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy danh sách manager theo brandId (hoặc tất cả nếu không có brandId)
   */
  async getManagers(brandId?: string | null) {
    try {
      const params = brandId ? { brandId } : {};
      const res = await axios.get('/admin/managers', { params });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tạo mới manager
   */
  async createManager(manager: {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    citizenCode: string;
    address: string;
    clubId: string;
  }) {
    try {
      const res = await axios.post('/admin/managers', manager);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy chi tiết manager theo managerId
   */
  async getManagerDetail(managerId: string) {
    try {
      const res = await axios.get(`/admin/managers/${managerId}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cập nhật thông tin manager
   */
  async updateManager(managerId: string, data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    citizenCode: string;
    address: string;
    clubId: string;
  }) {
    try {
      const res = await axios.put(`/admin/managers/${managerId}`, data);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Xóa manager
   */
  async deleteManager(managerId: string) {
    try {
      const res = await axios.delete(`/admin/managers/${managerId}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  private handleError(error: unknown): Error {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        return new Error(axiosError.response.data.message);
      }
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errorWithMessage = error as { message: string };
      return new Error(errorWithMessage.message);
    }
    return new Error('Đã xảy ra lỗi không xác định');
  }
}

export const managerService = new ManagerService();
export default managerService; 