import axios from './axios';

export interface Club {
  clubName: string;
  address: string;
  phoneNumber: string;
  tableNumber: number;
  status?: 'open' | 'closed' | 'maintenance';
}

export interface ClubResponse {
  _id: string;
  clubId: string;
  brandId: string;
  clubName: string;
  address: string;
  phoneNumber: string;
  tableNumber: number;
  status: 'open' | 'closed' | 'maintenance';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ClubsApiResponse {
  success: boolean;
  clubs: ClubResponse[];
}

class ClubsService {
  private baseUrl = '/admin/clubs';

  /**
   * Lấy tất cả clubs
   */
  async getAllClubs(): Promise<ClubResponse[]> {
    try {
      const response = await axios.get(this.baseUrl);
      const apiResponse = response.data as ClubsApiResponse;
      return apiResponse.clubs || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy clubs theo brandId
   */
  async getClubsByBrandId(brandId: string): Promise<ClubResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}?brandId=${brandId}`);
      const apiResponse = response.data as ClubsApiResponse;
      return apiResponse.clubs || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy chi tiết một club theo clubId
   */
  async getClubDetails(clubId: string): Promise<ClubResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/${clubId}`);
      const apiResponse = response.data as { success: boolean; club: ClubResponse };
      return apiResponse.club;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tạo một club mới
   */
  async createClub(clubData: Club): Promise<ClubResponse> {
    try {
      const response = await axios.post(this.baseUrl, clubData);
      return response.data as ClubResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tạo nhiều clubs cùng lúc
   */
  async createMultipleClubs(clubsData: Club[]): Promise<ClubResponse[]> {
    try {
      const response = await axios.post(this.baseUrl, clubsData);
      return response.data as ClubResponse[];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cập nhật thông tin club
   */
  async updateClub(clubId: string, clubData: Partial<Club>): Promise<ClubResponse> {
    try {
      const response = await axios.put(`${this.baseUrl}/${clubId}`, clubData);
      const apiResponse = response.data as { success: boolean; club: ClubResponse };
      return apiResponse.club;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Xóa club
   */
  async deleteClub(clubId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${clubId}`);
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

export const clubsService = new ClubsService();
export default clubsService; 