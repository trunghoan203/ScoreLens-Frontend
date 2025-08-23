import axios from './axios';

interface MatchTeamMember {
  membershipId?: string;
  membershipName?: string;
  guestName?: string;
  phoneNumber?: string;
}

interface MatchTeam {
  teamName: string;
  members: MatchTeamMember[];
}

interface CreateMatchData {
  tableId: string;
  gameType: 'carom' | 'pool-8';
  createdByMembershipId?: string;
  isAiAssisted: boolean;
  teams: MatchTeam[];
}

interface UpdateScoreData {
  teamIndex: number;
  score: number;
}

interface UpdateTeamMembersData {
  teams: MatchTeamMember[][];
}

class ManagerMatchService {
  // Create Match
  async createMatch(matchData: CreateMatchData) {
    try {
      const res = await axios.post('/manager/matches', matchData);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get Match By Code
  async getMatchByCode(matchCode: string) {
    try {
      const res = await axios.get(`/manager/matches/code/${matchCode}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get Match By Id
  async getMatchById(matchId: string) {
    try {
      const res = await axios.get(`/manager/matches/${matchId}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get Match by TableId
  async getMatchesByTable(tableId: string, status?: string, limit = 10, page = 1) {
    try {
      let url = `/manager/matches/table/${tableId}?limit=${limit}&page=${page}`;
      if (status) {
        url += `&status=${status}`;
      }
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get Match History
  async getMatchHistory(membershipId: string, limit = 10, page = 1) {
    try {
      const res = await axios.get(`/manager/matches/history/${membershipId}?limit=${limit}&page=${page}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update Score
  async updateScore(matchId: string, scoreData: UpdateScoreData) {
    try {
      const res = await axios.put(`/manager/matches/${matchId}/score`, scoreData);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update Team Members
  async updateTeamMembers(matchId: string, teamsData: UpdateTeamMembersData) {
    try {
      const res = await axios.put(`/manager/matches/${matchId}/teams`, teamsData);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Start Match
  async startMatch(matchId: string) {
    try {
      const res = await axios.put(`/manager/matches/${matchId}/start`, {});
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // End Match
  async endMatch(matchId: string) {
    try {
      const res = await axios.put(`/manager/matches/${matchId}/end`, {});
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update Video URL
  async updateVideoUrl(matchId: string, videoUrl: string) {
    try {
      const res = await axios.put(`/manager/matches/${matchId}/video-url`, { videoUrl });
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete Match
  async deleteMatch(matchId: string) {
    try {
      const res = await axios.delete(`/manager/matches/${matchId}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError.response?.status ?? 500;
      const message = axiosError.response?.data?.message ?? 'Đã xảy ra lỗi';
      const err = new Error(message) as Error & { status?: number };
      err.status = status;
      return err;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errorWithMessage = error as { message: string };
      const err = new Error(errorWithMessage.message) as Error & { status?: number };
      return err;
    }
    const err = new Error('Đã xảy ra lỗi không xác định') as Error & { status?: number };
    return err;
  }
}

export const managerMatchService = new ManagerMatchService();
export default managerMatchService; 