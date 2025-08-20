import { io, Socket } from 'socket.io-client';
import { config } from './config';

export interface MatchAuthData {
  matchId: string;
  sessionToken: string;
}

export interface AuthResult {
  success: boolean;
  role: 'host' | 'participant' | 'manager';
  message?: string;
}

export interface PermissionDeniedData {
  message: string;
  requiredRole: string;
  currentRole: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private isAuthenticated = false;
  private currentRole: string | null = null;

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(config.socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.isAuthenticated = false;
      this.currentRole = null;
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.isAuthenticated = false;
      this.currentRole = null;
    });

    this.socket.on('connect_error', () => {
      this.isConnected = false;
      this.isAuthenticated = false;
      this.currentRole = null;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.isAuthenticated = false;
      this.currentRole = null;
    }
  }

  authenticateMatch(matchId: string, sessionToken: string) {
    if (this.socket) {
      this.socket.emit('authenticate_match', {
        matchId,
        sessionToken
      });
    }
  }

  onAuthResult(callback: (data: AuthResult) => void) {
    if (this.socket) {
      this.socket.on('auth_result', (data: AuthResult) => {
        this.isAuthenticated = data.success;
        this.currentRole = data.role;
        callback(data);
      });
    }
  }

  onPermissionDenied(callback: (data: PermissionDeniedData) => void) {
    if (this.socket) {
      this.socket.on('permission_denied', callback);
    }
  }

  joinMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit('join_match_room', matchId);
    }
  }

  joinMatchRoom(matchId: string) {
    if (this.socket) {
      this.socket.emit('join_match_room', matchId);
    }
  }

  leaveMatchRoom(matchId: string) {
    if (this.socket) {
      this.socket.emit('leave_match', { matchId });
      this.isAuthenticated = false;
      this.currentRole = null;
    }
  }

  onMatchUpdated(callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on('match_updated', (data) => {
        callback(data);
      });
    }
  }

  onMatchDeleted(callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on('match_deleted', callback);
    }
  }

  onMatchEnded(callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on('match_ended', callback);
    }
  }

  onTimeUpdate(callback: (data: { matchId: string; elapsedTime: string }) => void) {
    if (this.socket) {
      this.socket.on('time_update', callback);
    }
  }

  emitScoreUpdate(matchId: string, teamIndex: number, score: number) {
    if (this.socket && this.isAuthenticated) {
      if (this.currentRole === 'host' || this.currentRole === 'manager') {
        this.socket.emit('score_updated', {
          matchId,
          teamIndex,
          score
        });
      } else {
        console.warn('Bạn không có quyền cập nhật điểm. Chỉ người tạo trận đấu mới có thể thực hiện.');
      }
    } else {
      console.warn('Socket chưa được authenticate hoặc chưa kết nối.');
    }
  }

  emitMatchEnd(matchId: string, matchData: {
    matchId?: string;
    tableName?: string;
    matchCode?: string;
    scoreA?: number;
    scoreB?: number;
    teamA?: string[];
    teamB?: string[];
    tableId?: string;
    endTime?: string;
  }) {
    if (this.socket && this.isAuthenticated) {

      if (this.currentRole === 'host' || this.currentRole === 'manager') {
        this.socket.emit('match_ended', {
          matchId,
          ...matchData
        });
      } else {
        console.warn('Bạn không có quyền kết thúc trận đấu. Chỉ người tạo trận đấu mới có thể thực hiện.');
      }
    } else {
      console.warn('Socket chưa được authenticate hoặc chưa kết nối.');
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.isAuthenticated = false;
      this.currentRole = null;
    }
  }

  isSocketConnected() {
    return this.isConnected;
  }


  isMatchAuthenticated() {
    return this.isAuthenticated;
  }


  getCurrentRole() {
    return this.currentRole;
  }


  isHost() {
    return this.currentRole === 'host';
  }


  isManager() {
    return this.currentRole === 'manager';
  }


  canEdit() {
    return this.currentRole === 'host' || this.currentRole === 'manager';
  }
}

export const socketService = new SocketService();
export default socketService;
