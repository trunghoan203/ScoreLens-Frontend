import { io, Socket } from 'socket.io-client';
import { config } from './config';

// ← MỚI: Interface cho authentication
export interface MatchAuthData {
  matchId: string;
  sessionToken: string;
}

// ← MỚI: Interface cho authentication result
export interface AuthResult {
  success: boolean;
  role: 'host' | 'participant' | 'manager';
  message?: string;
}

// ← MỚI: Interface cho permission denied event
export interface PermissionDeniedData {
  message: string;
  requiredRole: string;
  currentRole: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private isAuthenticated = false; // ← MỚI: Trạng thái authentication
  private currentRole: string | null = null; // ← MỚI: Role hiện tại của user

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
      this.isAuthenticated = false; // Reset authentication khi reconnect
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

  // ← MỚI: Authenticate với match room
  authenticateMatch(matchId: string, sessionToken: string) {
    if (this.socket) {
      this.socket.emit('authenticate_match', {
        matchId,
        sessionToken
      });
    }
  }

  // ← MỚI: Lắng nghe kết quả authentication
  onAuthResult(callback: (data: AuthResult) => void) {
    if (this.socket) {
      this.socket.on('auth_result', (data: AuthResult) => {
        this.isAuthenticated = data.success;
        this.currentRole = data.role;
        callback(data);
      });
    }
  }

  // ← MỚI: Lắng nghe permission denied
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
      this.isAuthenticated = false; // Reset authentication khi rời room
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

  // ← MỚI: Kiểm tra quyền trước khi emit score update
  emitScoreUpdate(matchId: string, teamIndex: number, score: number) {
    if (this.socket && this.isAuthenticated) {
      // Chỉ cho phép host hoặc manager cập nhật điểm
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

  // ← MỚI: Kiểm tra quyền trước khi emit match end
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
      // Chỉ cho phép host hoặc manager kết thúc trận
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

  // ← MỚI: Kiểm tra trạng thái authentication
  isMatchAuthenticated() {
    return this.isAuthenticated;
  }

  // ← MỚI: Lấy role hiện tại
  getCurrentRole() {
    return this.currentRole;
  }

  // ← MỚI: Kiểm tra có phải host không
  isHost() {
    return this.currentRole === 'host';
  }

  // ← MỚI: Kiểm tra có phải manager không
  isManager() {
    return this.currentRole === 'manager';
  }

  // ← MỚI: Kiểm tra có quyền chỉnh sửa không
  canEdit() {
    return this.currentRole === 'host' || this.currentRole === 'manager';
  }
}

export const socketService = new SocketService();
export default socketService;
