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

  const isHost = role?.role === 'host';
  const isManager = role?.role === 'manager';
  const isParticipant = role?.role === 'participant';
  const canEdit = isHost || isManager;

  const authenticateMatch = useCallback(async (matchId: string, sessionToken: string) => {
    if (!matchId || !sessionToken) {
      setError('MatchId và SessionToken là bắt buộc');
      return;
    }



    setIsLoading(true);
    setError(null);

    try {
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
      let userRole: 'host' | 'participant' | 'manager' | null = null;
      let foundMember = null;

      for (const team of match.teams) {
        if (team.members && Array.isArray(team.members)) {

          foundMember = team.members.find((member: any) => {
            const tokenMatch = member.sessionToken === sessionToken;


            return tokenMatch;
          });
          if (foundMember) {
            userRole = foundMember.role as 'host' | 'participant' | 'manager';

            break;
          }
        }
      }

      if (!foundMember || !userRole) {

        setError('Không tìm thấy thông tin user trong match hoặc role không hợp lệ');
        setIsLoading(false);
        return;
      }



      setRole({
        role: userRole,
        sessionToken,
        matchId
      });


      setError(null);
      setIsLoading(false);

      setForceUpdate(prev => prev + 1);



    } catch (err) {
      setError('Lỗi xác thực: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setIsLoading(false);
    }
  }, []);


  const leaveMatch = useCallback(() => {
    if (socket && matchId) {
      socket.emit('leave_match_room', matchId);
      socket.disconnect();
      setRole(null);
      setError(null);
    }
  }, [socket, matchId]);


  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);


  useEffect(() => {
    if (matchId && role?.matchId !== matchId) {
      setRole(null);
      setError(null);
    }
  }, [matchId, role?.matchId]);


  useEffect(() => {
    if (forceUpdate > 0) {

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
