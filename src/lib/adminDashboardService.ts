import axios from './axios';

export interface DashboardSummary {
  totalBranches: number;
  openBranches: number;
  closedBranches: number;
  totalTables: number;
  tablesInUse: number;
  emptyTables: number;
  maintenanceTables: number;
  totalManagers: number;
  workingManagers: number;
  onLeaveManagers: number;
  totalFeedbacks: number;
  pendingFeedbacks: number;
  resolvedFeedbacks: number;
  totalMemberships: number;
  activeMemberships: number;
  inactiveMemberships: number;
}

export interface BranchDetail {
  clubId: string;
  clubName: string;
  status: 'open' | 'closed';
  totalTables: number;
  tablesInUse: number;
  emptyTables: number;
  maintenanceTables: number;
  totalManagers: number;
  workingManagers: number;
  onLeaveManagers: number;
  totalFeedbacks: number;
  pendingFeedbacks: number;
  resolvedFeedbacks: number;
}

export interface BranchComparison {
  branchName: string;
  tables: number;
  managers: number;
}

export interface TableStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  branchDetails: BranchDetail[];
  branchComparison: BranchComparison[];
  tableStatusDistribution: TableStatusDistribution[];
}

export interface DashboardStats {
  branches: {
    total: number;
    open: number;
    closed: number;
    maintenance: number;
  };
  tables: {
    total: number;
    inUse: number;
    empty: number;
    maintenance: number;
  };
  managers: {
    total: number;
    working: number;
    onLeave: number;
  };
  feedbacks: {
    total: number;
    pending: number;
    resolved: number;
  };
  memberships: {
    total: number;
    active: number;
    inactive: number;
  };
}

export interface ClubDetail {
  clubId: string;
  clubName: string;
  status: 'open' | 'closed';
  address: string;
  phoneNumber: string;
  tableNumber: number;
  createdAt: string;
  tables: Array<{
    tableId: string;
    name: string;
    category: string;
    status: string;
    qrCodeData: string;
  }>;
  managers: Array<{
    managerId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    lastLogin: string;
  }>;
  feedbacks: Array<{
    feedbackId: string;
    content: string;
    status: string;
    createdAt: string;
    createdBy: {
      userId: string;
      type: string;
    };
  }>;
  totalTables: number;
  tablesInUse: number;
  emptyTables: number;
  maintenanceTables: number;
  totalManagers: number;
  workingManagers: number;
  onLeaveManagers: number;
  totalFeedbacks: number;
  pendingFeedbacks: number;
  resolvedFeedbacks: number;
  totalMatches: number;
  todayMatches: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class AdminDashboardService {
  private getTranslation(key: string): string {
    // This is a fallback for when useI18n is not available in service files
    // In practice, these error messages should be handled by the calling components
    const translations: Record<string, string> = {
      'shared.services.adminDashboard.cannotLoadDashboardData': 'Cannot load dashboard data',
      'shared.services.adminDashboard.cannotLoadDashboardStats': 'Cannot load dashboard statistics',
      'shared.services.adminDashboard.cannotLoadClubDetail': 'Cannot load club detail information',
      'shared.services.adminDashboard.unknownError': 'An unknown error occurred',
    };
    return translations[key] || key;
  }

  async getDashboard(): Promise<DashboardData> {
    try {
      const response = await axios.get<ApiResponse<DashboardData>>('/admin/dashboard');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || this.getTranslation('shared.services.adminDashboard.cannotLoadDashboardData'));
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || this.getTranslation('shared.services.adminDashboard.cannotLoadDashboardStats'));
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async getClubDetail(clubId: string): Promise<ClubDetail> {
    try {
      const response = await axios.get<ApiResponse<ClubDetail>>(`/admin/dashboard/club/${clubId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || this.getTranslation('shared.services.adminDashboard.cannotLoadClubDetail'));
    } catch (error) {
      throw this.handleError(error);
    }
  }


  private handleError(error: unknown): Error {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        return new Error(axiosError.response.data.message);
      }
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errorWithMessage = error as { message: string };
      return new Error(errorWithMessage.message);
    }
    return new Error(this.getTranslation('shared.services.adminDashboard.unknownError'));
  }
}

export const adminDashboardService = new AdminDashboardService();
export default adminDashboardService; 