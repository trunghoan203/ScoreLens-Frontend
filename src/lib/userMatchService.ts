import axios from './axios';

export interface VerifyTableRequest {
  tableId: string;
}



export interface VerifyMembershipRequest {
  phoneNumber: string;
}

export type GameType = 'pool-8' | 'carom';

export interface CreateMatchTeamMember {
  membershipId?: string;
  guestName?: string;
}

export interface CreateMatchRequest {
  tableId: string;
  gameType: GameType;
  createdByMembershipId?: string;
  isAiAssisted: boolean;
  teams: Array<{
    teamName: string;
    members: CreateMatchTeamMember[];
  }>;
}

export interface JoinMatchRequest {
  matchCode: string;
  teamIndex: number;
  joinerInfo: {
    phoneNumber?: string;
    guestName?: string;
  };
}

export interface LeaveMatchRequest {
  matchCode: string;
  leaverInfo: {
    phoneNumber?: string;
    guestName?: string;
  };
}

export interface UpdateScoreRequest {
  teamIndex: number;
  score: number;
  actorGuestToken?: string;
  actorMembershipId?: string;
}

export interface UpdateTeamMembersRequest {
  actorGuestToken?: string;
  actorMembershipId?: string;
  members: CreateMatchTeamMember[];
}

export interface StartOrEndMatchRequest {
  actorGuestToken?: string;
  actorMembershipId?: string;
}

class UserMatchService {
  private handleError(error: unknown): Error {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as any).response?.data?.message
    ) {
      return new Error((error as any).response.data.message);
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return new Error((error as any).message);
    }
    return new Error('Đã xảy ra lỗi không xác định');
  }

  async verifyTable(payload: VerifyTableRequest) {
    try {
      const res = await axios.post('/membership/matches/verify-table', payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }



  async verifyMembership(payload: VerifyMembershipRequest) {
    try {
      const res = await axios.post('/membership/matches/verify-membership', payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMatch(payload: CreateMatchRequest) {
    try {
      const res = await axios.post('/membership/matches', payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async joinMatch(payload: JoinMatchRequest) {
    try {
      const res = await axios.post('/membership/matches/join', payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async leaveMatch(payload: LeaveMatchRequest) {
    try {
      const res = await axios.post('/membership/matches/leave', payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchByCode(matchCode: string) {
    try {
      const res = await axios.get(`/membership/matches/code/${matchCode}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchById(matchId: string) {
    try {
      const res = await axios.get(`/membership/matches/${matchId}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateScore(matchId: string, payload: UpdateScoreRequest) {
    try {
      const res = await axios.put(`/membership/matches/${matchId}/score`, payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTeamMembers(matchId: string, teamIndex: number, payload: UpdateTeamMembersRequest) {
    try {
      // Lấy thông tin match hiện tại để có đủ 2 teams
      const currentMatch = await this.getMatchById(matchId) as Record<string, any>;
      
      const currentTeams = currentMatch?.data?.teams || currentMatch?.teams || [];
      
      // Cập nhật team được chỉ định
      const updatedTeams = [...currentTeams];
      updatedTeams[teamIndex] = {
        ...updatedTeams[teamIndex],
        members: payload.members
      };
      
      // Backend expect teams là mảng các mảng members, không phải mảng các object team
      const teamsForBackend = updatedTeams.map(team => team.members);
      
      const requestBody = {
        teams: teamsForBackend,
        actorGuestToken: payload.actorGuestToken,
        actorMembershipId: payload.actorMembershipId
      };
      
      // Gửi cả 2 teams theo format backend expect
      const res = await axios.put(`/membership/matches/${matchId}/teams`, requestBody);
      
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async startMatch(matchId: string, payload: StartOrEndMatchRequest) {
    try {
      const res = await axios.put(`/membership/matches/${matchId}/start`, payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async endMatch(matchId: string, payload: StartOrEndMatchRequest) {
    try {
      const res = await axios.put(`/membership/matches/${matchId}/end`, payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMatch(matchId: string, payload: StartOrEndMatchRequest) {
    try {
      const res = await axios.delete(`/membership/matches/${matchId}`, { 
        data: payload 
      } as any);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchByTableId(tableId: string) {
    try {
      const res = await axios.get(`/membership/matches/table/${tableId}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchHistory(membershipId: string) {
    try {
      const res = await axios.get(`/membership/matches/history/${membershipId}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const userMatchService = new UserMatchService();
export default userMatchService;


