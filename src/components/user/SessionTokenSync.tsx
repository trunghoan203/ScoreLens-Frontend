'use client';

import { useState } from 'react';
import { userMatchService } from '@/lib/userMatchService';
import { toast } from 'react-hot-toast';
import { useI18n } from '@/lib/i18n/provider';

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
  const { t } = useI18n();
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);

  const syncSessionToken = async () => {
    if (!matchId) {
      toast.error(t('shared.sessionTokenSync.noMatchId'));
      return;
    }
    setSyncing(true);
    try {
      const sessionTokenPayload: { membershipId?: string; guestName?: string } = {};
      if (matchInfo?.createdByMembershipId) {
        sessionTokenPayload.membershipId = matchInfo.createdByMembershipId;

      }
      else if (actorGuestToken) {
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
        toast.error(t('shared.sessionTokenSync.cannotDetermineUser'));
        return;
      }
      const sessionResponse = await userMatchService.getSessionToken(matchId, sessionTokenPayload);
      const responseData = sessionResponse as any;
      setLastSyncResult(responseData);

      if (responseData.success && responseData.data?.sessionToken) {
        const newSessionToken = responseData.data.sessionToken;
        if (newSessionToken !== currentSessionToken) {
          onTokenUpdate(newSessionToken);

          toast.success(t('shared.sessionTokenSync.sessionUpdated'));
        } else {

          toast.success(t('shared.sessionTokenSync.sessionSynced'));
        }
      } else {

        toast.error(t('shared.sessionTokenSync.cannotGetNewSession'));
      }

    } catch (error) {

      toast.error(t('shared.sessionTokenSync.cannotSyncSession'));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        {t('shared.sessionTokenSync.title')}
      </h3>

      <div className="space-y-3">
        <div className="text-sm">
          <p><strong>{t('shared.sessionTokenSync.matchId')}</strong> {matchId}</p>
          <p><strong>{t('shared.sessionTokenSync.currentToken')}</strong>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${currentSessionToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {currentSessionToken || t('shared.sessionTokenSync.none')}
            </span>
          </p>
          <p><strong>{t('shared.sessionTokenSync.userIdentity')}</strong>
            {matchInfo?.createdByMembershipId ?
              `${t('shared.sessionTokenSync.membershipId')} ${matchInfo.createdByMembershipId}` :
              `${t('shared.sessionTokenSync.guestToken')} ${actorGuestToken?.slice(-6)}...`
            }
          </p>
        </div>

        <button
          onClick={syncSessionToken}
          disabled={syncing}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${syncing
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {syncing ? t('shared.sessionTokenSync.syncing') : t('shared.sessionTokenSync.syncSessionToken')}
        </button>

        {lastSyncResult && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">{t('shared.sessionTokenSync.lastSyncResult')}</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(lastSyncResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
