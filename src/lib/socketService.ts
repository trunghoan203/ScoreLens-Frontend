import { io, Socket } from 'socket.io-client';
import { config } from './config';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

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
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', () => {
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
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
    if (this.socket) {
      this.socket.emit('score_updated', {
        matchId,
        teamIndex,
        score
      });
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
    if (this.socket) {
      this.socket.emit('match_ended', {
        matchId,
        ...matchData
      });
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  isSocketConnected() {
    return this.isConnected;
  }


}

export const socketService = new SocketService();
export default socketService;
