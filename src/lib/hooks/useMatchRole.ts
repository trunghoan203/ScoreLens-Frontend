import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface MatchRole {
  role: 'host' | 'participant' | 'manager';
  sessionToken: string;
  matchId: string;
}

export interface UseMatchRoleReturn {
  role: MatchRole | null;
  isHost: boolean;
  isManager: boolean;
  isParticipant: boolean;
  canEdit: boolean;
  authenticateMatch: (matchId: string, sessionToken: string) => void;
  leaveMatch: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useMatchRole = (matchId?: string, existingSocket?: Socket | null): UseMatchRoleReturn => {
  const [role, setRole] = useState<MatchRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(existingSocket || null);

  // Kiểm tra quyền
  const isHost = role?.role === 'host';
  const isManager = role?.role === 'manager';
  const isParticipant = role?.role === 'participant';
  const canEdit = isHost || isManager;

  // Authenticate với match
  const authenticateMatch = useCallback((matchId: string, sessionToken: string) => {
    if (!matchId || !sessionToken) {
      setError('MatchId và SessionToken là bắt buộc');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Tạm thời: Tự động set role là 'host' cho creator
      // Vì BE chưa implement authenticate_match event
      setTimeout(() => {
        setRole({
          role: 'host', // Creator luôn là host
          sessionToken,
          matchId
        });
        setError(null);
        setIsLoading(false);
      }, 1000); // Delay 1s để giả lập BE response

      // TODO: Khi BE implement authenticate_match, uncomment code bên dưới
      /*
      // Sử dụng existing socket hoặc tạo mới
      let currentSocket = socket;
      if (!currentSocket) {
        const socketUrl = 'http://localhost:8000';
        currentSocket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          timeout: 10000
        });
        setSocket(currentSocket);
      }

      // Lắng nghe kết quả authentication
      currentSocket.on('auth_result', (authResult: { success: boolean; role?: string; message?: string }) => {
        console.log('🔐 useMatchRole: auth_result received:', authResult);
        if (authResult.success && authResult.role) {
          setRole({
            role: authResult.role as 'host' | 'participant' | 'manager',
            sessionToken,
            matchId
          });
          setError(null);
        } else {
          setError(authResult.message || 'Xác thực thất bại');
          setRole(null);
        }
        setIsLoading(false);
      });

      // Lắng nghe permission denied
      currentSocket.on('permission_denied', (permissionData: { message: string }) => {
        setError(permissionData.message);
        setIsLoading(false);
      });

      // Thực hiện authentication
      if (currentSocket.connected) {
        console.log('🔐 useMatchRole: Socket already connected, emitting authenticate_match');
        currentSocket.emit('authenticate_match', { matchId, sessionToken });
      } else {
        currentSocket.on('connect', () => {
          console.log('🔐 useMatchRole: WebSocket connected, emitting authenticate_match');
          currentSocket.emit('authenticate_match', { matchId, sessionToken });
        });
        currentSocket.connect();
      }
      */

    } catch (err) {
      setError('Lỗi kết nối socket');
      setIsLoading(false);
    }
  }, [socket]);

  // Rời khỏi match
  const leaveMatch = useCallback(() => {
    if (socket && matchId) {
      socket.emit('leave_match_room', matchId);
      socket.disconnect();
      setRole(null);
      setError(null);
    }
  }, [socket, matchId]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Reset role khi matchId thay đổi
  useEffect(() => {
    if (matchId && role?.matchId !== matchId) {
      setRole(null);
      setError(null);
    }
  }, [matchId, role?.matchId]);

  return {
    role,
    isHost,
    isManager,
    isParticipant,
    canEdit,
    authenticateMatch,
    leaveMatch,
    isLoading,
    error
  };
};
