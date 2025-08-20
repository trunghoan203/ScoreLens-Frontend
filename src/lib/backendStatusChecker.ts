/**
 * Backend Status Checker
 * Kiểm tra status của Backend APIs và response structure
 */

export interface BackendAPIStatus {
  createMatch: {
    available: boolean;
    hasHostSessionToken: boolean;
    responseStructure: string;
  };
  joinMatch: {
    available: boolean;
    hasUserSessionToken: boolean;
    responseStructure: string;
  };
  getSessionToken: {
    available: boolean;
    endpoint: string;
  };
  overall: {
    sessionTokenSupport: boolean;
    recommendedAction: string;
  };
}

export class BackendStatusChecker {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Kiểm tra response structure của createMatch API
   */
  async checkCreateMatchAPI(): Promise<BackendAPIStatus['createMatch']> {
    try {
      // Test payload
      const testPayload = {
        tableId: 'TB-TEST',
        gameType: 'pool-8',
        isAiAssisted: false,
        teams: [
          { teamName: 'Team A', members: [{ guestName: 'Test Host' }] },
          { teamName: 'Team B', members: [] }
        ]
      };

      const response = await fetch(`${this.baseUrl}/api/membership/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });

      if (response.status === 404 || response.status === 501) {
        return {
          available: false,
          hasHostSessionToken: false,
          responseStructure: 'API not found'
        };
      }

      const data = await response.json();
      
      // Kiểm tra response structure
      const hasHostSessionToken = !!(data.hostSessionToken || data.data?.hostSessionToken);
      const responseStructure = this.analyzeResponseStructure(data);

      return {
        available: true,
        hasHostSessionToken,
        responseStructure
      };

    } catch (error) {
      console.error('Backend Status Checker: createMatch API check failed', error);
      return {
        available: false,
        hasHostSessionToken: false,
        responseStructure: 'Error checking API'
      };
    }
  }

  /**
   * Kiểm tra response structure của joinMatch API
   */
  async checkJoinMatchAPI(): Promise<BackendAPIStatus['joinMatch']> {
    try {
      // Test payload
      const testPayload = {
        matchCode: 'TEST123',
        teamIndex: 0,
        joinerInfo: { guestName: 'Test User' }
      };

      const response = await fetch(`${this.baseUrl}/api/membership/matches/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });

      if (response.status === 404 || response.status === 501) {
        return {
          available: false,
          hasUserSessionToken: false,
          responseStructure: 'API not found'
        };
      }

      const data = await response.json();
      
      // Kiểm tra response structure
      const hasUserSessionToken = !!(data.userSessionToken || data.data?.userSessionToken);
      const responseStructure = this.analyzeResponseStructure(data);

      return {
        available: true,
        hasUserSessionToken,
        responseStructure
      };

    } catch (error) {
      console.error('Backend Status Checker: joinMatch API check failed', error);
      return {
        available: false,
        hasUserSessionToken: false,
        responseStructure: 'Error checking API'
      };
    }
  }

  /**
   * Kiểm tra session-token API
   */
  async checkSessionTokenAPI(): Promise<BackendAPIStatus['getSessionToken']> {
    try {
      const response = await fetch(`${this.baseUrl}/api/membership/matches/TEST/session-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId: 'TEST' })
      });

      const available = response.status !== 404 && response.status !== 501;

      return {
        available,
        endpoint: `${this.baseUrl}/api/membership/matches/:matchId/session-token`
      };

    } catch (error) {
      console.error('Backend Status Checker: session-token API check failed', error);
      return {
        available: false,
        endpoint: `${this.baseUrl}/api/membership/matches/:matchId/session-token`
      };
    }
  }

  /**
   * Phân tích response structure
   */
  private analyzeResponseStructure(data: any): string {
    const keys = Object.keys(data || {});
    const hasSuccess = keys.includes('success');
    const hasData = keys.includes('data');
    const hasHostSessionToken = keys.includes('hostSessionToken');
    const hasUserSessionToken = keys.includes('userSessionToken');
    const hasCreatorGuestToken = keys.includes('creatorGuestToken');

    let structure = '';
    
    if (hasSuccess) structure += 'success: boolean, ';
    if (hasData) structure += 'data: object, ';
    if (hasHostSessionToken) structure += 'hostSessionToken: string, ';
    if (hasUserSessionToken) structure += 'userSessionToken: string, ';
    if (hasCreatorGuestToken) structure += 'creatorGuestToken: string, ';

    return structure.slice(0, -2) || 'unknown';
  }

  /**
   * Kiểm tra toàn bộ Backend status
   */
  async checkFullStatus(): Promise<BackendAPIStatus> {
    const [createMatch, joinMatch, sessionToken] = await Promise.all([
      this.checkCreateMatchAPI(),
      this.checkJoinMatchAPI(),
      this.checkSessionTokenAPI()
    ]);

    const sessionTokenSupport = createMatch.hasHostSessionToken || joinMatch.hasUserSessionToken;
    
    let recommendedAction = '';
    if (!createMatch.available || !joinMatch.available) {
      recommendedAction = 'Backend APIs not available - check if server is running';
    } else if (!sessionTokenSupport) {
      recommendedAction = 'Backend APIs available but sessionToken not implemented - use fallback mode';
    } else {
      recommendedAction = 'Backend fully supports sessionToken - ready for production';
    }

    const status: BackendAPIStatus = {
      createMatch,
      joinMatch,
      getSessionToken: sessionToken,
      overall: {
        sessionTokenSupport,
        recommendedAction
      }
    };

    return status;
  }

  /**
   * Log status summary
   */
  logStatusSummary(status: BackendAPIStatus): void {
    // Silent logging for production
  }
}

// Export singleton instance
export const backendStatusChecker = new BackendStatusChecker();

// Export helper function
export const checkBackendStatus = () => backendStatusChecker.checkFullStatus();
