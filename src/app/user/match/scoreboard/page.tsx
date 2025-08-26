'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ScoreEditor from '@/components/user/ScoreEditor';
import MatchEnd from '@/components/user/MatchEnd';
import EditOption from '@/components/user/EditOption';
import TeamMembers from '@/components/user/TeamMembers';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import socketService from '@/lib/socketService';
import { useMatchRole } from '@/lib/hooks/useMatchRole';
import { cameraStreamService } from '@/lib/cameraStreamService';
import { getIdentity, getSession, setSession } from '@/lib/session';
import { useI18n } from '@/lib/i18n/provider';

interface CameraInfo {
  cameraId?: string;
  IPAddress?: string;
  username?: string;
  password?: string;
  port?: string;
  isConnect?: boolean;
  hasCamera?: boolean;
  rtspUrl?: string;
}

interface MatchData {
  status?: 'pending' | 'ongoing' | 'completed';
  tableId?: string;
  isAiAssisted?: boolean;
  createdByMembershipId?: string;
  creatorGuestToken?: string;
  teams?: Array<{
    score?: number;
    members?: Array<{
      guestName?: string;
      membershipName?: string;
      fullName?: string;
      role?: 'host' | 'participant';
      sessionToken?: string;
    }>;
  }>;
  camera?: CameraInfo;
}

function ScoreboardPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [showEditChoicePopup, setShowEditChoicePopup] = useState(false);
  const [showEditMembersPopup, setShowEditMembersPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [matchId, setMatchId] = useState<string>('');
  const [matchCode, setMatchCode] = useState<string | null>(null);
  const [actorGuestToken, setActorGuestToken] = useState<string | null>(null);
  const [actorMembershipId, setActorMembershipId] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string>('');

  const [matchInfo, setMatchInfo] = useState<MatchData | null>(null);
  const [tableInfo, setTableInfo] = useState<{
    name?: string;
    category?: string;
    clubId?: string;
  } | null>(null);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);

  const [aiResults] = useState<string[]>([]);
  const [matchStartTime, setMatchStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [showCamera, setShowCamera] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`camera_${matchId}`);
      return saved === 'true';
    }
    return false;
  });
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamInfo, setStreamInfo] = useState<any>(null);
  const videoRef = useRef<HTMLCanvasElement>(null);

  const {
    role: matchRole,
    isHost,
    isManager,
    canEdit,
    authenticateMatch,
    error: authError
  } = useMatchRole(matchId);

  const handleStartCamera = async () => {
    if (!matchInfo?.camera?.cameraId) {
      toast.error(t('scoreboard.error.noCameraInfo'));
      return;
    }

    if (!videoRef.current) {
      setTimeout(() => {
        handleStartCamera();
      }, 200);
      return;
    }

    try {
      setIsCameraLoading(true);
      setCameraError(null);
      setIsStreaming(false);

      if (!matchInfo.camera?.isConnect) {
        setCameraError(t('scoreboard.error.cameraNotConnected'));
        setIsCameraLoading(false);
        return;
      }

      const result = await cameraStreamService.startVideoStream(matchInfo.camera.cameraId, videoRef.current, sessionToken);

      if (result.success) {
        setIsStreaming(true);
        setViewerCount(result.streamInfo?.viewerCount || 0);
        setStreamInfo(result.streamInfo);

        const message = result.streamInfo?.isNewStream
          ? t('scoreboard.success.streamStarted')
          : `${t('scoreboard.success.joinedStream')} (${result.streamInfo?.viewerCount || 0} ${t('scoreboard.peopleWatching')})`;
        toast.success(message);
      } else {
        setCameraError(result.message);
        toast.error(t('scoreboard.error.cannotStartStream') + ': ' + result.message);

        if (showCamera) {
          setTimeout(() => {
            if (showCamera && !isStreaming) {
              handleStartCamera();
            }
          }, 3000);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('scoreboard.error.unknownError');
      setCameraError(errorMessage);
      toast.error(t('scoreboard.error.streamError') + ': ' + errorMessage);

      if (showCamera) {
        setTimeout(() => {
          if (showCamera && !isStreaming) {
            handleStartCamera();
          }
        }, 3000);
      }
    } finally {
      setIsCameraLoading(false);
    }
  };

  const handleToggleCamera = () => {
    if (!showCamera) {
      setShowCamera(true);
      if (typeof window !== 'undefined' && matchId) {
        localStorage.setItem(`camera_${matchId}`, 'true');
      }
      setTimeout(() => {
        handleStartCamera();
      }, 100);
    } else {
      handleStopCamera();
      setShowCamera(false);
      if (typeof window !== 'undefined' && matchId) {
        localStorage.setItem(`camera_${matchId}`, 'false');
      }
    }
  };

  const handleStopCamera = () => {
    if (matchInfo?.camera?.cameraId && isStreaming) {
      cameraStreamService.stopVideoStream(matchInfo.camera.cameraId);
    }
    setIsStreaming(false);
    setIsCameraLoading(false);
    setCameraError(null);
    setViewerCount(0);
    setStreamInfo(null);
  };

  const { isConnected } = useWebSocket({
    matchId,
    matchStatus: matchInfo?.status || 'pending',
    onTimeUpdate: (elapsedTime: string) => {
      setElapsedTime(elapsedTime);
    },
    onMatchUpdate: (updatedMatch: unknown) => {
      const matchData = updatedMatch as {
        createdByMembershipId?: string;
        creatorGuestToken?: string;
        teams?: Array<{
          score?: number;
          members?: Array<{
            guestName?: string;
            membershipName?: string;
            fullName?: string;
            role?: 'host' | 'participant';
            sessionToken?: string;
          }>;
        }>;
      };

      if (matchData?.teams) {
        const newScoreA = matchData.teams[0]?.score ?? scoreA;
        const newScoreB = matchData.teams[1]?.score ?? scoreB;

        if (newScoreA !== scoreA) {
          setScoreA(newScoreA);
        }
        if (newScoreB !== scoreB) {
          setScoreB(newScoreB);
        }

        if (matchData.teams[0]?.members) {
          const teamAMembers = matchData.teams[0].members.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
            member.guestName || member.membershipName || member.fullName || ''
          );
          setTeamA(teamAMembers);
        }

        if (matchData.teams[1]?.members) {
          const teamBMembers = matchData.teams[1].members.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
            member.guestName || member.membershipName || member.fullName || ''
          );
          setTeamB(teamBMembers);
        }

        setMatchInfo(prev => {
          if (prev && matchData) {
            const updatedMatchInfo = {
              ...matchData,
              camera: prev.camera,
              isAiAssisted: prev.isAiAssisted
            };

            if (showCamera && prev.camera?.hasCamera && !isStreaming && !isCameraLoading) {
              setTimeout(() => {
                if (videoRef.current) {
                  handleStartCamera();
                } else {
                  setTimeout(() => {
                    if (videoRef.current) {
                      handleStartCamera();
                    }
                  }, 200);
                }
              }, 100);
            }

            return updatedMatchInfo;
          }
          return matchData;
        });
      }
    },
    onMatchEnded: (matchData: unknown) => {
      const matchInfo = matchData as {
        matchId?: string;
        tableName?: string;
        matchCode?: string;
        scoreA?: number;
        scoreB?: number;
        teamA?: string[];
        teamB?: string[];
        tableId?: string;
      };
      if (matchInfo && matchInfo.matchId === matchId) {
        const params = new URLSearchParams();
        if (matchInfo.matchId) params.set('matchId', matchInfo.matchId);
        if (matchInfo.tableName) params.set('tableName', matchInfo.tableName);
        if (matchInfo.matchCode) params.set('matchCode', matchInfo.matchCode);
        if (matchInfo.scoreA !== undefined) params.set('scoreA', matchInfo.scoreA.toString());
        if (matchInfo.scoreB !== undefined) params.set('scoreB', matchInfo.scoreB.toString());
        if (matchInfo.teamA) params.set('teamA', matchInfo.teamA.join(','));
        if (matchInfo.teamB) params.set('teamB', matchInfo.teamB.join(','));
        if (matchInfo.tableId) params.set('tableId', matchInfo.tableId);

        if (elapsedTime) params.set('elapsedTime', elapsedTime);
        router.push(`/user/match/end?${params.toString()}`);
      }
    }
  });

  useEffect(() => {
    const performAuth = async () => {
      if (!matchId || matchId.trim() === '') return;

      try {
        const session = getSession(matchId);

        if (session?.sessionToken) {
          try {
            await authenticateMatch(matchId, session.sessionToken);
            setSessionToken(session.sessionToken);
          } catch (error) {
          }
          return;
        }

        if (sessionToken && sessionToken.trim() !== '') {
          try {
            await authenticateMatch(matchId, sessionToken);
          } catch (error) {
          }
          return;
        }

        const identity = getIdentity(matchId);

        if (identity && (identity.membershipId || identity.guestName)) {
          const sessionTokenPayload: { membershipId?: string; guestName?: string } = {};
          if (identity.membershipId) {
            sessionTokenPayload.membershipId = identity.membershipId;
          } else if (identity.guestName) {
            sessionTokenPayload.guestName = identity.guestName;
          }

          if (Object.keys(sessionTokenPayload).length > 0) {
            const sessionResponse = await userMatchService.getSessionToken(matchId, sessionTokenPayload);
            const responseData = sessionResponse as any;

            if (responseData.success && responseData.data?.sessionToken) {
              const userSessionToken = responseData.data.sessionToken;

              setSession(matchId, {
                sessionToken: userSessionToken,
                role: 'participant'
              });

              setSessionToken(userSessionToken);

              try {
                await authenticateMatch(matchId, userSessionToken);
              } catch (error) {
              }
            } else {
              toast.error(t('scoreboard.error.cannotAuthenticateJoin'));
            }
          } else {
            toast.error(t('scoreboard.error.missingAuthInfo'));
          }
        } else {
        }
      } catch (error) {
      }
    };

    performAuth();
  }, [matchId, sessionToken, t]);

  useEffect(() => {
    if (authError) {

      toast.error(`Lỗi xác thực: ${authError}`);
    }
  }, [authError]);

  useEffect(() => {
    if (matchRole) {

    }
  }, [matchRole, isHost, isManager, canEdit, sessionToken]);

  useEffect(() => {
    if (matchInfo?.teams) {
      const teamAMembers = matchInfo.teams[0]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
        member.guestName || member.membershipName || member.fullName || ''
      ) || [''];
      const teamBMembers = matchInfo.teams[1]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
        member.guestName || member.membershipName || member.fullName || ''
      ) || [''];

      setTeamA(teamAMembers);
      setTeamB(teamBMembers);
    }

    if (matchInfo && !matchInfo.camera && matchInfo.tableId) {
      const restoreCameraInfo = async () => {
        try {
          const tableData = await userMatchService.verifyTable({ tableId: matchInfo.tableId! });
          const tableResponseData = (tableData as { data?: { camera?: CameraInfo } })?.data || tableData;
          const tableInfoData = tableResponseData as { camera?: CameraInfo };

          if (tableInfoData?.camera) {
            setMatchInfo(prev => prev ? {
              ...prev,
              camera: tableInfoData.camera,
              isAiAssisted: prev.isAiAssisted
            } : null);

            if (showCamera && tableInfoData.camera?.hasCamera) {
              setTimeout(() => {
                if (videoRef.current) {
                  handleStartCamera();
                } else {
                  setTimeout(() => {
                    if (videoRef.current) {
                      handleStartCamera();
                    }
                  }, 200);
                }
              }, 100);
            }
          }
        } catch (error) {
        }
      };

      restoreCameraInfo();
    }
  }, [matchInfo]);

  useEffect(() => {
    if (matchId && matchId.trim() !== '' && isConnected) {
      socketService.joinMatchRoom(matchId);
    }
  }, [matchId, isConnected]);

  useEffect(() => {
    if (matchId && matchId.trim() !== '' && socketService.isSocketConnected()) {
      const handleMatchEnded = (data: unknown) => {
        const matchData = data as {
          matchId?: string;
          tableName?: string;
          matchCode?: string;
          scoreA?: number;
          scoreB?: number;
          teamA?: string[];
          teamB?: string[];
          tableId?: string;
        };
        if (matchData && matchData.matchId === matchId) {
          const params = new URLSearchParams();
          if (matchData.matchId) params.set('matchId', matchData.matchId);
          if (matchData.tableName) params.set('tableName', matchData.tableName);
          if (matchData.matchCode) params.set('matchCode', matchData.matchCode);
          if (matchData.scoreA !== undefined) params.set('scoreA', matchData.scoreA.toString());
          if (matchData.scoreB !== undefined) params.set('scoreB', matchData.scoreB.toString());
          if (matchData.teamA) params.set('teamA', matchData.teamA.join(','));
          if (matchData.teamB) params.set('teamB', matchData.teamB.join(','));
          if (matchData.tableId) params.set('tableId', matchData.tableId);

          router.push(`/user/match/end?${params.toString()}`);
        }
      };

      socketService.onMatchEnded(handleMatchEnded);

      return () => {
        if (socketService.isSocketConnected()) {
          socketService.removeAllListeners();
        }
      };
    }
  }, [matchId, router, searchParams]);

  const exampleResults = [
    'Đội A - Bi số 5 vào đúng lỗ giữa.',
    'Đội B - Lỗi, đánh bi trắng vào lỗ.',
    'Không xác định được tình huống – vui lòng kiểm tra lại video.',
  ];

  useEffect(() => {
    const mId = searchParams?.get('matchId');
    const code = searchParams?.get('room');
    const guestToken = searchParams?.get('guestToken');
    const creatorGuestToken = searchParams?.get('creatorGuestToken');
    const tId = searchParams?.get('tableId');
    const sessionToken = searchParams?.get('sessionToken') || '';

    setMatchId(mId || '');
    if (code) setMatchCode(code);
    if (creatorGuestToken) {
      setActorGuestToken(creatorGuestToken);
    } else if (guestToken) {
      setActorGuestToken(guestToken);
    }
    if (tId) setTableId(tId);
    setSessionToken(sessionToken);



    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const init = async () => {
      try {
        if (mId) {
          const matchData = await userMatchService.getMatchById(mId);
          const responseData = (matchData as { data?: { teams?: Array<{ score?: number; members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }>; tableId?: string; startTime?: string; createdByMembershipId?: string; creatorGuestToken?: string; camera?: CameraInfo; isAiAssisted?: boolean } })?.data || matchData;
          const matchInfoData = responseData as { teams?: Array<{ score?: number; members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }>; tableId?: string; startTime?: string; createdByMembershipId?: string; creatorGuestToken?: string; camera?: CameraInfo; isAiAssisted?: boolean };

          setMatchInfo(matchInfoData);

          if (matchInfoData?.tableId) {
            try {
              const tableData = await userMatchService.verifyTable({ tableId: matchInfoData.tableId });
              const tableResponseData = (tableData as { data?: { name?: string; category?: string; clubId?: string; camera?: CameraInfo } })?.data || tableData;
              const tableInfoData = tableResponseData as { name?: string; category?: string; clubId?: string; camera?: CameraInfo };

              if (tableInfoData?.camera) {
                setMatchInfo(prev => prev ? {
                  ...prev,
                  camera: tableInfoData.camera,
                  isAiAssisted: prev.isAiAssisted
                } : null);
              }
            } catch (error) {

            }
          }

          if (matchInfoData?.creatorGuestToken && !actorGuestToken) {
            setActorGuestToken(matchInfoData.creatorGuestToken);
          }

          const sA = matchInfoData?.teams?.[0]?.score ?? 0;
          const sB = matchInfoData?.teams?.[1]?.score ?? 0;
          setScoreA(sA);
          setScoreB(sB);

          const teamAMembers = matchInfoData?.teams?.[0]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
            member.guestName || member.membershipName || member.fullName || 'Unknown'
          ) || [];
          const teamBMembers = matchInfoData?.teams?.[1]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
            member.guestName || member.membershipName || member.fullName || 'Unknown'
          ) || [];

          setTeamA(teamAMembers);
          setTeamB(teamBMembers);

          if (!tId && matchInfoData?.tableId) {
            setTableId(matchInfoData.tableId);
          }

          if (matchInfoData?.startTime) {
            setMatchStartTime(new Date(matchInfoData.startTime));
          }
        } else if (code) {
          const matchData = await userMatchService.getMatchByCode(code);
          const responseData = (matchData as { data?: { matchId?: string; id?: string; teams?: Array<{ score?: number }> } })?.data || matchData;
          const matchInfoData = responseData as { matchId?: string; id?: string; teams?: Array<{ score?: number }> };
          const id = matchInfoData?.matchId || matchInfoData?.id;
          setMatchId(id || '');

          const sA = matchInfoData?.teams?.[0]?.score ?? 0;
          const sB = matchInfoData?.teams?.[1]?.score ?? 0;
          setScoreA(sA);
          setScoreB(sB);
        }
      } catch (error) {
        toast.error(t('scoreboard.error.cannotLoadMatch'));
      } finally {
        timer = setTimeout(() => setLoading(false), 800);
      }
    };
    void init();

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [searchParams, actorGuestToken]);

  useEffect(() => {
    const verifyTableInfo = async () => {
      if (tableId || matchInfo?.tableId) {
        const currentTableId = tableId || matchInfo?.tableId || '';
        try {
          const tableData = await userMatchService.verifyTable({ tableId: currentTableId });
          const tableResponseData = (tableData as { data?: { name?: string; category?: string; clubId?: string } })?.data || tableData;
          const tableInfoData = tableResponseData as { name?: string; category?: string; clubId?: string };
          setTableInfo(tableInfoData);
        } catch {
          toast.error(t('scoreboard.error.cannotLoadTable'));
        }
      }
    };

    verifyTableInfo();
  }, [tableId, matchInfo?.tableId]);

  useEffect(() => {
    return () => {
      if (matchInfo?.camera?.cameraId && isStreaming) {
        cameraStreamService.stopVideoStream(matchInfo.camera.cameraId);
      }
    };
  }, [matchInfo?.camera?.cameraId, isStreaming]);

  useEffect(() => {
    if (showCamera && matchInfo?.camera?.cameraId && !isStreaming && !isCameraLoading) {
      const timer = setTimeout(() => {
        handleStartCamera();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [matchInfo?.camera?.cameraId, showCamera, isStreaming, isCameraLoading]);

  useEffect(() => {
    if (showCamera && matchInfo?.camera?.cameraId && !isStreaming && !isCameraLoading) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          handleStartCamera();
        } else {
          setTimeout(() => {
            if (videoRef.current) {
              handleStartCamera();
            }
          }, 200);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [matchInfo]);

  useEffect(() => {
    if (!matchStartTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - matchStartTime.getTime();

      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setElapsedTime(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, [matchStartTime]);

  const handleEditScore = () => {
    setShowEditChoicePopup(true);
  };
  const handleEndMatch = () => {
    setShowEndPopup(true);
  };

  const validatePermissions = () => {
    if (!matchId || matchId.trim() === '') {
      toast.error(t('scoreboard.error.noMatchInfo'));
      return false;
    }

    if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
      toast.error(t('scoreboard.error.noEditPermission'));
      return false;
    }

    if (!sessionToken || sessionToken.trim() === '') {
      toast.error(t('scoreboard.error.noValidSessionToken'));
      return false;
    }

    return true;
  };

  const persistScores = async (newA: number, newB: number) => {
    if (!matchId || matchId.trim() === '' || !sessionToken || sessionToken.trim() === '') {
      return;
    }
    setUpdating(true);

    try {
      await userMatchService.updateScore(matchId, {
        teamIndex: 0,
        score: newA,
        actorGuestToken: actorGuestToken || undefined,
        actorMembershipId: matchInfo?.createdByMembershipId || undefined,
        sessionToken: sessionToken,
      });

      await userMatchService.updateScore(matchId, {
        teamIndex: 1,
        score: newB,
        actorGuestToken: actorGuestToken || undefined,
        actorMembershipId: matchInfo?.createdByMembershipId || undefined,
        sessionToken: sessionToken,
      });
      return true;

    } catch (error) {
      if ((error as Error).message?.includes('SessionToken không hợp lệ')) {
        try {
          await syncSessionTokenWithBackend();

          return await persistScores(newA, newB);

        } catch (syncError) {
        }
      }

      toast.error(t('scoreboard.error.updateScoreFailed'));
      throw new Error(t('scoreboard.error.updateScoreFailed'));
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (matchId && matchInfo?.createdByMembershipId) {
      syncSessionTokenWithBackend();
    }
  }, [matchId, matchInfo?.createdByMembershipId]);



  const syncSessionTokenWithBackend = async () => {
    if (matchId) {
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

        if (Object.keys(sessionTokenPayload).length > 0) {
          const sessionResponse = await userMatchService.getSessionToken(matchId, sessionTokenPayload);

          const responseData = sessionResponse as any;
          if (responseData.success && responseData.data?.sessionToken) {
            const newSessionToken = responseData.data.sessionToken;

            if (newSessionToken !== sessionToken) {
              setSessionToken(newSessionToken);
            } else {
              toast.success(t('scoreboard.success.sessionSynced'));
            }
          } else {
            toast.error(t('scoreboard.error.cannotGetNewSession'));
          }
        } else {
          toast.error(t('scoreboard.error.cannotDetermineUser'));
        }

      } catch (error) {
        toast.error(t('scoreboard.error.cannotSyncSession'));
      }
    } else {
      toast.error(t('scoreboard.error.noMatchIdToSync'));
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('sessionToken')) {
      url.searchParams.delete('sessionToken');
      window.history.replaceState({}, '', url.toString());

    }
  }, []);

  return (
    <>
      {loading && <ScoreLensLoading text={t('scoreboard.loading')} />}
      {!loading && (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
          <HeaderUser showBack={true} />
          <div className="h-25"></div>
          <main className="flex-1 flex flex-col px-4 py-2 overflow-y-auto scroll-smooth">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] text-center">
                {(tableInfo?.name || t('scoreboard.title')).toUpperCase()} - {tableInfo?.category ? (tableInfo.category === 'pool-8' ? t('scoreboard.pool8') : ` ${tableInfo.category.toUpperCase()}`) : (tableId ? t('scoreboard.loading') : 'Pool 8 Ball')}
              </h1>
              <div className="flex items-center justify-center mb-2">
                {matchRole && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-300">
                    {matchRole.role === 'host' ? t('scoreboard.host') : t('scoreboard.member')}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-3">
                <p className="text-sm sm:text-base text-[#000000] font-medium">{t('scoreboard.scoreboard')}</p>
              </div>
            </div>

            <div className="bg-lime-400 text-white rounded-2xl px-2 py-8 space-y-2 shadow-md w-full mt-2">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-white mb-2">{t('scoreboard.joinCode')}</p>
                <div className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 mx-auto inline-block">
                  <div className="flex items-center justify-center gap-2 select-all">
                    {(matchCode || '000000').split('').map((ch, idx) => (
                      <span
                        key={idx}
                        className="w-5 sm:w-6 text-center font-mono tabular-nums font-extrabold text-xl sm:text-2xl text-white leading-none"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-center flex flex-col items-center w-30 flex-shrink-0">
                  <div className="text-4xl font-bold mb-2">{updating ? '...' : scoreA}</div>
                  <p className="text-sm font-semibold">{t('scoreboard.teamA')}</p>
                  <div className="min-h-[60px] mt-1 text-center space-y-1">
                    {teamA.length > 0 ? (
                      teamA.map((member, index) => (
                        <p key={index} className="text-xs">
                          {member && member.length > 12
                            ? `${member.substring(0, 12)}...`
                            : (member || t('scoreboard.playerPlaceholder').replace('{index}', (index + 1).toString()))
                          }
                        </p>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">{t('scoreboard.noMembers')}</p>
                    )}
                  </div>
                </div>

                <div className="text-center flex flex-col items-center flex-shrink-0">
                  <div className="text-2xl font-bold mb-2">{t('scoreboard.vs')}</div>
                  <div className="min-h-[30px] flex items-center justify-center">
                    {matchStartTime ? (
                      <div className="text-[#FFFFFF] font-bold text-[#8ADB10]">{elapsedTime}</div>
                    ) : (
                      <div className="text-[#FFFFFF] font-bold text-[#8ADB10]">{t('scoreboard.loading')}</div>
                    )}
                  </div>
                </div>

                <div className="text-center flex flex-col items-center w-30 flex-shrink-0">
                  <div className="text-4xl font-bold mb-2">{updating ? '...' : scoreB}</div>
                  <p className="text-sm font-semibold">{t('scoreboard.teamB')}</p>
                  <div className="min-h-[60px] mt-1 text-center space-y-1">
                    {teamB.length > 0 ? (
                      teamB.map((member, index) => (
                        <p key={index} className="text-xs">
                          {member && member.length > 12
                            ? `${member.substring(0, 12)}...`
                            : (member || t('scoreboard.playerPlaceholder').replace('{index}', (index + 1).toString()))
                          }
                        </p>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">{t('scoreboard.noMembers')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left w-full space-y-4 mt-2">

              {matchInfo?.isAiAssisted && matchInfo?.camera?.hasCamera && showCamera && (
                <div className="relative mb-4">
                  <canvas
                    ref={videoRef}
                    className="w-full h-64 bg-black rounded-lg"
                    width={854}
                    height={480}
                    style={{
                      background: '#000',
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />

                  {isCameraLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-white text-sm">{t('scoreboard.connectingCamera')}</p>
                        {matchInfo.camera?.IPAddress && (
                          <p className="text-white text-xs mt-1">IP: {matchInfo.camera.IPAddress}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50 rounded-lg">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-white font-medium">{t('scoreboard.cameraError')}</p>
                        <p className="text-white text-sm">{cameraError}</p>
                        {matchInfo.camera?.IPAddress && (
                          <p className="text-white text-xs mt-1">IP: {matchInfo.camera.IPAddress}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {isStreaming && !isCameraLoading && !cameraError && (
                    <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                  )}
                </div>
              )}

              {matchInfo?.isAiAssisted && showCamera && !matchInfo?.camera?.hasCamera && (
                <div className="relative mb-4 bg-gray-100 rounded-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
                  <div className="text-gray-500">Đang khôi phục thông tin camera...</div>
                </div>
              )}

              {matchInfo?.isAiAssisted && matchInfo?.camera?.hasCamera && (
                <>
                  <p className="text-sm font-semibold text-[#000000] mb-1">Kết Quả AI</p>
                  <div className="border border-gray-300 rounded-md p-3 text-sm text-[#000000] bg-white shadow-sm space-y-1">
                    {(aiResults.length > 0 ? aiResults : exampleResults).map((item: string, index: number) => (
                      <p key={index}>[AI]: {item}</p>
                    ))}
                  </div>

                </>
              )}

              {(!matchInfo?.isAiAssisted || !matchInfo?.camera?.hasCamera) && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#000000] mb-2">{t('scoreboard.quickActions')}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!canEdit) {
                          toast.error('Bạn không có quyền chỉnh sửa');
                          return;
                        }
                        if (!validatePermissions()) return;

                        const newScore = scoreA + 1;
                        setScoreA(newScore);
                        try {
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 0,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                            sessionToken: sessionToken,
                          });

                          socketService.emitScoreUpdate(matchId, 0, newScore);
                        } catch (error) {

                          if ((error as Error).message?.includes('SessionToken không hợp lệ')) {
                            try {
                              await syncSessionTokenWithBackend();

                              await userMatchService.updateScore(matchId, {
                                teamIndex: 0,
                                score: newScore,
                                actorGuestToken: actorGuestToken || undefined,
                                actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                                sessionToken: sessionToken,
                              });

                              socketService.emitScoreUpdate(matchId, 0, newScore);
                              return;
                            } catch (retryError) {

                            }
                          }

                          toast.error('Cập nhật điểm Đội A thất bại');
                          setScoreA(scoreA);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      {t('scoreboard.plus1TeamA')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!canEdit) {
                          toast.error('Bạn không có quyền chỉnh sửa');
                          return;
                        }
                        if (!validatePermissions()) return;

                        const newScore = scoreB + 1;
                        setScoreB(newScore);
                        try {
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 1,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                            sessionToken: sessionToken,
                          });

                          socketService.emitScoreUpdate(matchId, 1, newScore);
                        } catch (error) {
                          toast.error('Cập nhật điểm Đội B thất bại');
                          setScoreB(scoreB);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      {t('scoreboard.plus1TeamB')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!canEdit) {
                          toast.error('Bạn không có quyền chỉnh sửa');
                          return;
                        }
                        if (!validatePermissions()) return;

                        const newScore = Math.max(0, scoreA - 1);
                        setScoreA(newScore);
                        try {
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 0,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                            sessionToken: sessionToken,
                          });

                          socketService.emitScoreUpdate(matchId, 0, newScore);
                        } catch (error) {
                          toast.error('Cập nhật điểm Đội A thất bại');
                          setScoreA(scoreA);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      {t('scoreboard.minus1TeamA')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!canEdit) {
                          toast.error('Bạn không có quyền chỉnh sửa');
                          return;
                        }
                        if (!validatePermissions()) return;

                        const newScore = Math.max(0, scoreB - 1);
                        setScoreB(newScore);
                        try {
                          await userMatchService.updateScore(matchId, {
                            teamIndex: 1,
                            score: newScore,
                            actorGuestToken: actorGuestToken || undefined,
                            actorMembershipId: matchInfo?.createdByMembershipId || undefined,
                            sessionToken: sessionToken,
                          });

                          socketService.emitScoreUpdate(matchId, 1, newScore);
                        } catch (error) {
                          toast.error('Cập nhật điểm Đội B thất bại');
                          setScoreB(scoreB);
                        }
                      }}
                      className="text-[#000000]"
                    >
                      {t('scoreboard.minus1TeamB')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
          <div className="h-20"></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
            <div className="flex flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
              {matchInfo?.isAiAssisted && matchInfo?.camera?.hasCamera && (
                <Button
                  onClick={handleToggleCamera}
                  style={{ backgroundColor: showCamera ? '#FF6B6B' : '#055EC8' }}
                  className="w-1/3 hover:bg-blue-700 hover:bg-red-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center"
                >
                  {showCamera ? t('scoreboard.hideCamera') : t('scoreboard.showCamera')}
                </Button>
              )}

              <Button
                onClick={() => {
                  if (!canEdit) {
                    toast.error('Bạn không có quyền chỉnh sửa');
                    return;
                  }
                  handleEditScore();
                }}
                style={{ backgroundColor: '#8ADB10' }}
                className={`${matchInfo?.isAiAssisted && matchInfo?.camera?.hasCamera ? 'w-1/3' : 'w-1/2'} hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center`}
              >
                {t('scoreboard.edit')}
              </Button>

              <Button
                onClick={() => {
                  if (!canEdit) {
                    toast.error('Bạn không có quyền chỉnh sửa');
                    return;
                  }
                  handleEndMatch();
                }}
                style={{ backgroundColor: '#FF0000' }}
                className={`${matchInfo?.isAiAssisted && matchInfo?.camera?.hasCamera ? 'w-1/3' : 'w-1/2'} hover:bg-red-700 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center`}
              >
                {t('scoreboard.end')}
              </Button>
            </div>
          </div>

          {showEditPopup && (
            <ScoreEditor
              onClose={() => setShowEditPopup(false)}
              onSave={async (newScoreA, newScoreB) => {
                setScoreA(newScoreA);
                setScoreB(newScoreB);
                try {
                  await persistScores(newScoreA, newScoreB);
                } catch {
                  toast.error(t('scoreboard.error.updateScoreFailed'));
                }
                setShowEditPopup(false);
              }}
              initialScoreA={scoreA}
              initialScoreB={scoreB}
              canEdit={canEdit}
              userRole={matchRole?.role}
            />
          )}

          {showEditChoicePopup && (
            <EditOption
              onClose={() => setShowEditChoicePopup(false)}
              onEditScore={() => {
                if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                  toast.error('Bạn không có quyền chỉnh sửa');
                  setShowEditChoicePopup(false);
                  return;
                }
                setShowEditChoicePopup(false);
                setShowEditPopup(true);
              }}
              onEditMembers={() => {
                if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                  toast.error('Bạn không có quyền chỉnh sửa');
                  setShowEditChoicePopup(false);
                  return;
                }
                if (!tableInfo?.clubId) {
                  toast.error(t('scoreboard.error.cannotDetermineClub'));
                  return;
                }
                setShowEditChoicePopup(false);
                setShowEditMembersPopup(true);
              }}
            />
          )}

          {showEditMembersPopup && (
            <TeamMembers
              onClose={() => setShowEditMembersPopup(false)}
              onSave={async (newTeamA, newTeamB) => {
                setTeamA(newTeamA);
                setTeamB(newTeamB);
                setShowEditMembersPopup(false);

                if (matchId && matchId.trim() !== '') {
                  setTimeout(async () => {
                    try {
                      const updatedMatchInfo = await userMatchService.getMatchById(matchId);
                      const responseData = (updatedMatchInfo as { data?: { teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }> } })?.data || updatedMatchInfo;
                      const matchInfoData = responseData as { teams?: Array<{ members?: Array<{ guestName?: string; membershipName?: string; fullName?: string }> }> };

                      if (matchInfoData?.teams) {
                        const teamAMembers = matchInfoData.teams[0]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
                          member.guestName || member.membershipName || member.fullName || ''
                        ) || [''];
                        const teamBMembers = matchInfoData.teams[1]?.members?.map((member: { guestName?: string; membershipName?: string; fullName?: string }) =>
                          member.guestName || member.membershipName || member.fullName || ''
                        ) || [''];

                        setTeamA(teamAMembers);
                        setTeamB(teamBMembers);
                      }
                    } catch (error) {
                    }
                  }, 500);
                }
              }}
              initialTeamA={teamA}
              initialTeamB={teamB}
              matchId={matchId}
              actorGuestToken={actorGuestToken}
              actorMembershipId={matchInfo?.createdByMembershipId || null}
              clubId={tableInfo?.clubId || null}
              sessionToken={sessionToken || ''}
            />
          )}

          {showEndPopup && (
            <MatchEnd
              onClose={() => setShowEndPopup(false)}
              onConfirm={async () => {
                if (!matchId || matchId.trim() === '') {
                  toast.error(t('scoreboard.error.noMatchInfo'));
                  setShowEndPopup(false);
                  return;
                }

                if (!actorGuestToken && !matchInfo?.createdByMembershipId) {
                  toast.error(t('scoreboard.error.cannotAuthenticateEndMatch'));
                  setShowEndPopup(false);
                  return;
                }

                try {
                  const endMatchPayload: { actorGuestToken?: string; actorMembershipId?: string; sessionToken: string } = { sessionToken: sessionToken || '' };
                  if (actorGuestToken) {
                    endMatchPayload.actorGuestToken = actorGuestToken;
                  } else if (matchInfo?.createdByMembershipId) {
                    endMatchPayload.actorMembershipId = matchInfo.createdByMembershipId;
                  } else {
                    toast.error(t('scoreboard.error.cannotAuthenticateEndMatch'));
                    setShowEndPopup(false);
                    return;
                  }

                  await userMatchService.endMatch(matchId, endMatchPayload);
                  const params = new URLSearchParams();
                  if (matchId) params.set('matchId', matchId);
                  if (tableInfo?.name) params.set('tableName', tableInfo.name);
                  if (matchCode) params.set('matchCode', matchCode);
                  if (scoreA !== undefined) params.set('scoreA', scoreA.toString());
                  if (scoreB !== undefined) params.set('scoreB', scoreB.toString());
                  if (teamA.length > 0) params.set('teamA', teamA.join(','));
                  if (teamB.length > 0) params.set('teamB', teamB.join(','));
                  if (tableId) params.set('tableId', tableId);
                  if (elapsedTime) params.set('elapsedTime', elapsedTime);

                  router.push(`/user/match/end?${params.toString()}`);
                } catch (error) {
                  toast.error(t('scoreboard.error.cannotEndMatch'));
                }
              }}
            />
          )}
        </div>
      )}
    </>
  );
}

function LoadingFallback() {
  const { t } = useI18n();
  return <ScoreLensLoading text={t('scoreboard.loading')} />;
}

export default function ScoreboardPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScoreboardPage />
    </Suspense>
  );
}