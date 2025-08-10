import axios from './axios';

interface MatchData {
  tableId: string;
  gameType: string;
  createdByMembershipId: string;
  isAiAssisted: boolean;
  teams: Array<{
    teamName: string;
    members: Array<{ guestName: string }>;
  }>;
}

class ManagerMatchService {
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

  async createMatch(matchData: MatchData) {
    try {
      const res = await axios.post('/api/membership/matches', matchData, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatches() {
    try {
      const res = await axios.get('/api/membership/matches', {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchById(matchId: string) {
    try {
      const res = await axios.get(`/api/membership/matches/${matchId}`, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMatch(matchId: string, matchData: Partial<MatchData>) {
    try {
      const res = await axios.put(`/api/membership/matches/${matchId}`, matchData, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMatch(matchId: string) {
    try {
      const res = await axios.delete(`/api/membership/matches/${matchId}`, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async endMatch(matchId: string) {
    try {
      const res = await axios.post(`/api/membership/matches/${matchId}/end`, {}, {
        headers: this.getAuthHeaders(),
      });
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

export const managerMatchService = new ManagerMatchService();
export default managerMatchService; 