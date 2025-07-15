import axios from './axios';

class ManagerService {
  async login(citizenCode: string) {
    try {
      const res = await axios.post('/manager/login', { citizenCode });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyLogin(citizenCode: string, activationCode: string) {
    try {
      const res = await axios.post('/manager/login/verify', { citizenCode, activationCode });
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

  async resendLoginCode(citizenCode: string) {
    try {
      const res = await axios.post('/manager/resend-login-code', { citizenCode });
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