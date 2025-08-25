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
  actualTableCount?: number;
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

  async getAllClubs(): Promise<ClubResponse[]> {
    try {
      const response = await axios.get(this.baseUrl);
      const apiResponse = response.data as ClubsApiResponse;
      return apiResponse.clubs || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClubsByBrandId(brandId: string): Promise<ClubResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}?brandId=${brandId}`);
      const apiResponse = response.data as ClubsApiResponse;
      return apiResponse.clubs || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClubDetails(clubId: string): Promise<ClubResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/${clubId}`);
      const apiResponse = response.data as { success: boolean; club: ClubResponse };
      return apiResponse.club;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createClub(clubData: Club): Promise<ClubResponse> {
    try {
      const response = await axios.post(this.baseUrl, clubData);
      return response.data as ClubResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMultipleClubs(clubsData: Club[]): Promise<ClubResponse[]> {
    try {
      const response = await axios.post(this.baseUrl, clubsData);
      return response.data as ClubResponse[];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateClub(clubId: string, clubData: Partial<Club>): Promise<ClubResponse> {
    try {
      const response = await axios.put(`${this.baseUrl}/${clubId}`, clubData);
      const apiResponse = response.data as { success: boolean; club: ClubResponse };
      return apiResponse.club;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteClub(clubId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${clubId}`);
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

export const clubsService = new ClubsService();
export default clubsService; 