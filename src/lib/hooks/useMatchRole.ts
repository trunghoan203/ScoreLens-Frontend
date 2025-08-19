import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { userMatchService } from '../userMatchService';

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
  const [forceUpdate, setForceUpdate] = useState(0);

  // Kiểm tra quyền
  const isHost = role?.role === 'host';
  const isManager = role?.role === 'manager';
  const isParticipant = role?.role === 'participant';
  const canEdit = isHost || isManager;

  // Authenticate với match - Sửa logic để detect role chính xác và tránh conflict
  const authenticateMatch = useCallback(async (matchId: string, sessionToken: string) => {
    if (!matchId || !sessionToken) {
      setError('MatchId và SessionToken là bắt buộc');
      return;
    }

    

    setIsLoading(true);
    setError(null);

    try {
      // 🎯 Logic mới: Detect role dựa trên sessionToken và match data
      // Tránh conflict bằng cách so sánh chính xác token
      
      // 1. Lấy thông tin match từ Backend
      const matchData = await userMatchService.getMatchById(matchId);
      
      if (!matchData || typeof matchData !== 'object' || !('data' in matchData)) {
        setError('Không thể lấy thông tin match');
        setIsLoading(false);
        return;
      }

      const match = matchData.data as any;
      if (!match || !match.teams || !Array.isArray(match.teams)) {
        setError('Dữ liệu match không hợp lệ');
        setIsLoading(false);
        return;
      }

      // 🔍 Debug: Log match data để tìm vấn đề
      
      
      // 2. Tìm member có sessionToken này để xác định role
      // 🚨 QUAN TRỌNG: Không set default role, phải tìm chính xác
      let userRole: 'host' | 'participant' | 'manager' | null = null;
      let foundMember = null;

      for (const team of match.teams) {
        if (team.members && Array.isArray(team.members)) {
  
          foundMember = team.members.find((member: any) => {
            // 🎯 So sánh chính xác token để tránh conflict
            const tokenMatch = member.sessionToken === sessionToken;


            return tokenMatch;
          });
          if (foundMember) {
            userRole = foundMember.role as 'host' | 'participant' | 'manager';

            break;
          }
        }
      }

      // 🚨 QUAN TRỌNG: Nếu không tìm thấy member, không set role mặc định
      if (!foundMember || !userRole) {

        setError('Không tìm thấy thông tin user trong match hoặc role không hợp lệ');
        setIsLoading(false);
        return;
      }

      // 3. Set role chính xác dựa trên Backend data

      
      setRole({
        role: userRole,
        sessionToken,
        matchId
      });
      

      setError(null);
      setIsLoading(false);
      
      // ← Thêm force update để đảm bảo state được apply
      setForceUpdate(prev => prev + 1);



    } catch (err) {
      setError('Lỗi xác thực: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setIsLoading(false);
    }
  }, []); // ← QUAN TRỌNG: Empty dependency array để tránh infinite re-renders

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

  // Force re-render khi cần thiết
  useEffect(() => {
    if (forceUpdate > 0) {
      // Trigger re-render
    }
  }, [forceUpdate]);

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
