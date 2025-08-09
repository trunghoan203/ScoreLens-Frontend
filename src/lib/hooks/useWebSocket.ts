import { useEffect, useRef } from 'react';
import socketService from '@/lib/socketService';

interface UseWebSocketProps {
  matchId: string | null;
  matchStatus: 'pending' | 'ongoing' | 'completed';
  onTimeUpdate: (elapsedTime: string) => void;
  onMatchUpdate?: (matchData: any) => void;
}

export const useWebSocket = ({ 
  matchId, 
  matchStatus, 
  onTimeUpdate, 
  onMatchUpdate 
}: UseWebSocketProps) => {
  const isConnected = useRef(false);

  useEffect(() => {
    if (matchId && matchStatus === 'ongoing' && !isConnected.current) {
      // Connect to WebSocket
      const socket = socketService.connect();
      
      // Join match room
      socketService.joinMatchRoom(matchId);
      
      // Listen for time updates from server
      socketService.onTimeUpdate((data) => {
        if (data.matchId === matchId) {
          onTimeUpdate(data.elapsedTime);
        }
      });
      
      // Listen for match updates
      if (onMatchUpdate) {
        socketService.onMatchUpdated((updatedMatch) => {
          if (updatedMatch.matchId === matchId) {
            onMatchUpdate(updatedMatch);
          }
        });
      }
      
      isConnected.current = true;
    }

    // Cleanup on unmount or when matchId/matchStatus changes
    return () => {
      if (matchId && isConnected.current) {
        socketService.leaveMatchRoom(matchId);
        socketService.removeAllListeners();
        isConnected.current = false;
      }
    };
  }, [matchId, matchStatus]);

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
