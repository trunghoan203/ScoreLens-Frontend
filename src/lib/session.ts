
export const SKEY = (matchId: string) => `sl:session:${matchId}`;
export const IKEY = (matchId: string) => `sl:identity:${matchId}`;

export type UserIdentity = { 
  membershipId?: string; 
  guestName?: string; 
  fullName?: string;
  actorGuestToken?: string;
};

export type UserSession = { 
  sessionToken: string;
  role?: 'host' | 'participant' | 'manager';
};

export const getIdentity = (matchId: string): UserIdentity | null => {
  try { 
    return JSON.parse(localStorage.getItem(IKEY(matchId)) || 'null'); 
  } catch { 
    return null; 
  }
};

export const setIdentity = (matchId: string, v: UserIdentity) => {
  localStorage.setItem(IKEY(matchId), JSON.stringify(v));
};

export const getSession = (matchId: string): UserSession | null => {
  try { 
    return JSON.parse(localStorage.getItem(SKEY(matchId)) || 'null'); 
  } catch { 
    return null; 
  }
};

export const setSession = (matchId: string, v: UserSession) => {
  localStorage.setItem(SKEY(matchId), JSON.stringify(v));
};

export const clearSession = (matchId: string) => localStorage.removeItem(SKEY(matchId));

export const clearIdentity = (matchId: string) => localStorage.removeItem(IKEY(matchId));

export const clearMatchData = (matchId: string) => {
  clearSession(matchId);
  clearIdentity(matchId);
};
