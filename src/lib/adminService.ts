import axios from './axios';

export interface AdminProfile {
  _id: string;
  fullName: string;
  email: string;
  brandId?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

class AdminService {
  /**
   * Lấy thông tin profile của admin đang đăng nhập
   */
  async getProfile(): Promise<AdminProfile> {
    try {
      const response = await axios.get('/admin/profile');
      return response.data as AdminProfile;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy brandId của admin đang đăng nhập
   */
  async getBrandId(): Promise<string | null> {
    try {
      const profile = await this.getProfile();
      return profile.brandId || null;
    } catch (error) {
      console.error('Error getting brandId:', error);
      return null;
    }
  }

  /**
   * Xử lý lỗi chung
   */
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

export const adminService = new AdminService();
export default adminService; 