import axios from './axios';

export interface AdminProfile {
  _id: string;
  fullName: string;
  email: string;
  brandId?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  status: 'approved' | 'pending' | 'rejected';
  rejectedReason?: string;
}

export interface RememberMeData {
  email: string;
  password: string;
  rememberMe: boolean;
}

class AdminService {
  private readonly REMEMBER_ME_KEY = 'adminRememberMe';
  private readonly REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  /**
   * Lấy thông tin profile của admin đang đăng nhập
   */
  async getProfile(): Promise<AdminProfile> {
    try {
      const response = await axios.get('/admin/profile');
      if (response.data && typeof response.data === 'object' && 'admin' in response.data) {
        return (response.data as { admin: AdminProfile }).admin;
      }
      throw new Error('Dữ liệu trả về không hợp lệ');
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
   * Lưu thông tin đăng nhập để nhớ mật khẩu
   */
  saveRememberMeData(data: RememberMeData): void {
    if (typeof window === 'undefined') return;

    if (data.rememberMe) {
      const rememberData = {
        email: data.email,
        password: data.password,
        timestamp: Date.now()
      };
      localStorage.setItem(this.REMEMBER_ME_KEY, JSON.stringify(rememberData));
    } else {
      this.clearRememberMeData();
    }
  }

  /**
   * Lấy thông tin đăng nhập đã lưu
   */
  getRememberMeData(): RememberMeData | null {
    if (typeof window === 'undefined') return null;

    try {
      const savedData = localStorage.getItem(this.REMEMBER_ME_KEY);
      if (!savedData) return null;

      const data = JSON.parse(savedData);
      const now = Date.now();
      
      // Kiểm tra xem dữ liệu có còn hợp lệ không (30 ngày)
      if (now - data.timestamp > this.REMEMBER_ME_DURATION) {
        this.clearRememberMeData();
        return null;
      }

      return {
        email: data.email,
        password: data.password,
        rememberMe: true
      };
    } catch (error) {
      console.error('Error parsing remember me data:', error);
      this.clearRememberMeData();
      return null;
    }
  }

  /**
   * Xóa thông tin đăng nhập đã lưu
   */
  clearRememberMeData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.REMEMBER_ME_KEY);
  }

  /**
   * Kiểm tra xem có dữ liệu nhớ mật khẩu không
   */
  hasRememberMeData(): boolean {
    return this.getRememberMeData() !== null;
  }

  async updateStatus(): Promise<AdminProfile> {
    try {
      const response = await axios.patch('/admin/status/pending');
      if (response.data && typeof response.data === 'object' && 'admin' in response.data) {
        return (response.data as { admin: AdminProfile }).admin;
      }
      throw new Error('Dữ liệu trả về không hợp lệ');
    } catch (error) {
      throw this.handleError(error);
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