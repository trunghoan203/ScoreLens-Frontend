import { useEffect, useRef } from 'react';
import socketService from '@/lib/socketService';

interface UseWebSocketProps {
  matchId: string | null;
  matchStatus: 'pending' | 'ongoing' | 'completed';
  onTimeUpdate: (elapsedTime: string) => void;
  onMatchUpdate?: (matchData: unknown) => void;
  onMatchEnded?: (matchData: unknown) => void;
}

export const useWebSocket = ({
  matchId,
  matchStatus,
  onTimeUpdate,
  onMatchUpdate,
  onMatchEnded
}: UseWebSocketProps) => {
  const isConnected = useRef(false);

  useEffect(() => {
    if (matchId && (matchStatus === 'ongoing' || matchStatus === 'completed') && !isConnected.current) {
      socketService.connect();

      socketService.joinMatchRoom(matchId);

      socketService.onTimeUpdate((data) => {
        const matchData = data as { matchId: string; elapsedTime: string };
        if (matchData.matchId === matchId) {
          onTimeUpdate(matchData.elapsedTime);
        }
      });

      if (onMatchUpdate) {
        socketService.onMatchUpdated((updatedMatch) => {
          const match = updatedMatch as { matchId: string };
          if (match.matchId === matchId) {
            onMatchUpdate(updatedMatch);
          }
        });
      }

      if (onMatchEnded) {
        socketService.onMatchEnded((matchData) => {
          const match = matchData as { matchId: string };
          if (match.matchId === matchId) {
            onMatchEnded(matchData);
          }
        });
      }

      isConnected.current = true;
    }

    return () => {
      if (matchId && isConnected.current) {
        socketService.leaveMatchRoom(matchId);
        socketService.removeAllListeners();
        isConnected.current = false;
      }
    };
  }, [matchId, matchStatus, onMatchUpdate, onTimeUpdate, onMatchEnded]);

  return {
    isConnected: socketService.isSocketConnected(),
    disconnect: () => {
      if (matchId) {
        socketService.leaveMatchRoom(matchId);
        socketService.removeAllListeners();
        isConnected.current = false;
      }
    }
  };
};
