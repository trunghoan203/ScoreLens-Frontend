'use client';

import { useState } from 'react';
import { userMatchService } from '@/lib/userMatchService';
import { toast } from 'react-hot-toast';

interface SessionTokenSyncProps {
  matchId: string;
  currentSessionToken: string | null;
  onTokenUpdate: (newToken: string) => void;
  matchInfo?: any;
  actorGuestToken?: string | null;
}

export default function SessionTokenSync({
  matchId,
  currentSessionToken,
  onTokenUpdate,
  matchInfo,
  actorGuestToken
}: SessionTokenSyncProps) {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);

  const syncSessionToken = async () => {
    if (!matchId) {
      toast.error('Không có matchId để sync');
      return;
    }

    setSyncing(true);
    try {
  

      // Xác định payload cho session token API
      let sessionTokenPayload: { membershipId?: string; guestName?: string } = {};
      
      // Nếu có membershipId thì dùng membershipId
      if (matchInfo?.createdByMembershipId) {
        sessionTokenPayload.membershipId = matchInfo.createdByMembershipId;

      } 
      // Nếu không có membershipId thì dùng guestName từ actorGuestToken
      else if (actorGuestToken) {
        // Tìm guestName từ teams data
        const currentTeams = matchInfo?.teams || [];
        const allMembers = currentTeams.flatMap((t: any) => t.members);
        const currentMember = allMembers.find((m: any) => 
          m.guestName && m.guestName.includes(actorGuestToken.slice(-6))
        );
        if (currentMember?.guestName) {
          sessionTokenPayload.guestName = currentMember.guestName;

        }
      }

      if (Object.keys(sessionTokenPayload).length === 0) {
        toast.error('Không thể xác định người dùng để lấy phiên làm việc');
        return;
      }

      
      
      // Gọi API để lấy sessionToken mới nhất
      const sessionResponse = await userMatchService.getSessionToken(matchId, sessionTokenPayload);
      
      
      const responseData = sessionResponse as any;
      setLastSyncResult(responseData);

      if (responseData.success && responseData.data?.sessionToken) {
        const newSessionToken = responseData.data.sessionToken;
        
        // So sánh token cũ vs mới
        if (newSessionToken !== currentSessionToken) {

          
          // Cập nhật token mới
          onTokenUpdate(newSessionToken);

          toast.success('Đã cập nhật phiên làm việc mới!');
        } else {

          toast.success('Phiên làm việc đã đồng bộ');
        }
      } else {

        toast.error('Không thể lấy phiên làm việc mới');
      }
      
    } catch (error) {

      toast.error('Không thể đồng bộ phiên làm việc');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        🔄 SessionToken Synchronization
      </h3>
      
      <div className="space-y-3">
        <div className="text-sm">
          <p><strong>Match ID:</strong> {matchId}</p>
          <p><strong>Current Token:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              currentSessionToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {currentSessionToken || 'None'}
            </span>
          </p>
          <p><strong>User Identity:</strong> 
            {matchInfo?.createdByMembershipId ? 
              `Membership ID: ${matchInfo.createdByMembershipId}` : 
              `Guest Token: ${actorGuestToken?.slice(-6)}...`
            }
          </p>
        </div>

        <button
          onClick={syncSessionToken}
          disabled={syncing}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            syncing 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {syncing ? '🔄 Syncing...' : '🔄 Sync SessionToken'}
        </button>

        {lastSyncResult && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Last Sync Result:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(lastSyncResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
