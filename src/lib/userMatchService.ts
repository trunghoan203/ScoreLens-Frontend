import axios from './axios';

export interface VerifyTableRequest {
  tableId: string;
}
export interface VerifyMembershipRequest {
  phoneNumber: string;
  clubId: string; 
}

export interface VerifyMembershipResponse {
  success: boolean;
  isMember: boolean;
  isBrandCompatible?: boolean;  
  message: string;
  data?: {
    membershipId: string;
    fullName: string;
    phoneNumber: string;
    status: string;
    brandId: string;
  };
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
  members: Array<{
    guestName?: string;
    phoneNumber?: string;
  }>;
}

// Interface mới cho API cập nhật cả 2 teams
export interface UpdateTeamMembersRequestV2 {
  teams: Array<Array<{
    guestName?: string;
    phoneNumber?: string;
  }>>;
  actorGuestToken?: string;
  actorMembershipId?: string;
}

export interface PopupEditMembersProps {
  onClose: () => void;
  onSave: (teamAMembers: string[], teamBMembers: string[]) => void;
  initialTeamA: string[];
  initialTeamB: string[];
  matchId: string | null;
  actorGuestToken: string | null;
  actorMembershipId: string | null;
  clubId: string | null;
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



  async verifyMembership(payload: VerifyMembershipRequest): Promise<VerifyMembershipResponse> {
    try {
      const res = await axios.post('/membership/matches/verify-membership', payload);
      return res.data as VerifyMembershipResponse;
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
      const res = await axios.put(`/membership/matches/${matchId}/teams/${teamIndex}/members`, payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTeamMembersV2(matchId: string, teams: Array<Array<{ guestName?: string; phoneNumber?: string }>>, actorGuestToken?: string, actorMembershipId?: string) {
    try {
      const payload: UpdateTeamMembersRequestV2 = { 
        teams,
        actorGuestToken,
        actorMembershipId
      };
      const res = await axios.put(`/membership/matches/${matchId}/teams`, payload);
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


