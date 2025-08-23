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
  membershipName?: string;
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

export interface CreateMatchResponse {
  success: boolean;
  data: {
    matchId: string;
    matchCode: string;
  };
  creatorGuestToken?: string;
  hostSessionToken: string;
  message?: string;
}

export interface JoinMatchRequest {
  matchCode: string;
  teamIndex: number;
  joinerInfo: {
    phoneNumber?: string;
    guestName?: string;
    membershipId?: string;
    membershipName?: string;
  };
}

export interface JoinMatchResponse {
  success: boolean;
  data: {
    matchId: string;
  };
  userSessionToken: string;
  role?: 'host' | 'participant';
  message?: string;
}

export interface LeaveMatchRequest {
  matchCode: string;
  leaverInfo: {
    phoneNumber?: string;
    guestName?: string;
    membershipId?: string;
    membershipName?: string;
  };
}

export interface UpdateScoreRequest {
  teamIndex: number;
  score: number;
  actorGuestToken?: string;
  actorMembershipId?: string;
  sessionToken: string;
}

export interface UpdateTeamMembersRequest {
  actorGuestToken?: string;
  actorMembershipId?: string;
  sessionToken: string;
  members: Array<{
    guestName?: string;
    phoneNumber?: string;
    membershipId?: string;
    membershipName?: string;
  }>;
}

export interface UpdateTeamMembersRequestV2 {
  teams: Array<Array<{
    guestName?: string;
    phoneNumber?: string;
  }>>;
  sessionToken: string;
}

export interface TeamMembersProps {
  onClose: () => void;
  onSave: (teamAMembers: string[], teamBMembers: string[]) => void;
  initialTeamA: string[];
  initialTeamB: string[];
  matchId: string | null;
  actorGuestToken: string | null;
  actorMembershipId: string | null;
  clubId: string | null;
  sessionToken?: string | null;
}

export interface StartOrEndMatchRequest {
  actorGuestToken?: string;
  actorMembershipId?: string;
  sessionToken: string;
}

export interface MatchMember {
  membershipId?: string;
  membershipName?: string;
  guestName?: string;
  role: 'host' | 'participant';
  sessionToken: string;
}

export interface MatchResponse {
  matchId: string;
  matchCode: string;
  tableId: string;
  gameType: GameType;
  status: 'pending' | 'ongoing' | 'completed';
  teams: Array<{
    teamName: string;
    score: number;
    isWinner: boolean;
    members: MatchMember[];
  }>;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

class UserMatchService {
  private handleError(error: unknown): Error {


    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as { response?: { data?: { message?: string; code?: string } } }).response?.data
    ) {
      const responseData = (error as { response?: { data?: { message?: string; code?: string } } }).response!.data!;



      if (responseData.code === 'FORBIDDEN') {
        return new Error('Bạn không có quyền thực hiện thao tác này. Chỉ người tạo trận đấu mới có thể chỉnh sửa.');
      }
      if (responseData.code === 'UNAUTHORIZED') {
        return new Error('Vui lòng cung cấp sessionToken hợp lệ để thực hiện thao tác này.');
      }
      if (responseData.code === 'INVALID_SESSION') {
        return new Error('SessionToken không hợp lệ hoặc đã hết hạn. Vui lòng tham gia lại trận đấu.');
      }
      if (responseData.code === 'HOST_REQUIRED') {
        return new Error('Chỉ người tạo trận đấu mới có thể thực hiện thao tác này.');
      }

      return new Error(responseData.message || 'Đã xảy ra lỗi không xác định');
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return new Error((error as { message?: string }).message || 'Đã xảy ra lỗi không xác định');
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

  async getMatchById(matchId: string, queryParams?: { membershipId?: string; guestName?: string }) {
    try {
      let url = `/membership/matches/${matchId}`;
      if (queryParams) {
        const params = new URLSearchParams();
        if (queryParams.membershipId) params.append('membershipId', queryParams.membershipId);
        if (queryParams.guestName) params.append('guestName', queryParams.guestName);
        if (params.toString()) url += `?${params.toString()}`;
      }
      const res = await axios.get(url);
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

  async updateTeamMembersV2(matchId: string, teams: Array<Array<{ guestName?: string; phoneNumber?: string }>>, sessionToken: string, actorGuestToken?: string, actorMembershipId?: string) {
    try {

      const payload = {
        teams,
        sessionToken
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

      if (typeof window !== 'undefined') {
        localStorage.removeItem(`sl:session:${matchId}`);
        localStorage.removeItem(`sl:identity:${matchId}`);
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes(`sl:session:${matchId}`) || key.includes(`sl:identity:${matchId}`))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }

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

  async getMembershipByPhoneNumber(phoneNumber: string) {
    try {
      const res = await axios.get(`/membership/phone/${phoneNumber}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchHistory(phoneNumber: string, limit = 10, page = 1) {
    try {
      const res = await axios.get(`/membership/matches/history/${phoneNumber}?limit=${limit}&page=${page}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async getSessionToken(matchId: string, payload: { membershipId?: string; guestName?: string }) {
    try {
      const res = await axios.post(`/membership/matches/${matchId}/session-token`, payload);
      return res.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const userMatchService = new UserMatchService();
export default userMatchService;


