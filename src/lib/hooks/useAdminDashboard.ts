import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  adminDashboardService, 
  DashboardData, 
  DashboardStats, 
  ClubDetail 
} from '../adminDashboardService';

interface UseAdminDashboardReturn {
  // Data states
  dashboardData: DashboardData | null;
  dashboardStats: DashboardStats | null;
  selectedClub: ClubDetail | null;
  
  // Loading states
  isLoadingDashboard: boolean;
  isLoadingStats: boolean;
  isLoadingClubDetail: boolean;
  
  // Error states
  dashboardError: string | null;
  statsError: string | null;
  clubDetailError: string | null;
  
  // Actions
  fetchDashboard: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchClubDetail: (clubId: string) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearErrors: () => void;
}

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [selectedClub, setSelectedClub] = useState<ClubDetail | null>(null);
  
  // Loading states
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingClubDetail, setIsLoadingClubDetail] = useState(false);
  
  // Error states
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [clubDetailError, setClubDetailError] = useState<string | null>(null);
  
  // Use useRef to avoid infinite loop with real-time updates
  const realTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dashboard data (full data)
  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoadingDashboard(true);
      setDashboardError(null);
      const data = await adminDashboardService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải dữ liệu dashboard';
      setDashboardError(errorMessage);
      console.error('Error fetching dashboard:', error);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, []);

  // Fetch stats (quick data for real-time updates)
  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      setStatsError(null);
      const stats = await adminDashboardService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải thống kê';
      setStatsError(errorMessage);
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Fetch club detail
  const fetchClubDetail = useCallback(async (clubId: string) => {
    try {
      setIsLoadingClubDetail(true);
      setClubDetailError(null);
      const clubDetail = await adminDashboardService.getClubDetail(clubId);
      setSelectedClub(clubDetail);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải thông tin chi tiết club';
      setClubDetailError(errorMessage);
      console.error('Error fetching club detail:', error);
    } finally {
      setIsLoadingClubDetail(false);
    }
  }, []);

  // Refresh dashboard (fetch both dashboard and stats)
  const refreshDashboard = useCallback(async () => {
    await Promise.all([fetchDashboard(), fetchStats()]);
  }, [fetchDashboard, fetchStats]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setDashboardError(null);
    setStatsError(null);
    setClubDetailError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboard();
    fetchStats();
  }, [fetchDashboard, fetchStats]);

  // Start real-time updates when component mounts
  useEffect(() => {
    // Start real-time updates - update stats every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);
    
    realTimeIntervalRef.current = interval;
    
    // Cleanup on unmount
    return () => {
      if (realTimeIntervalRef.current) {
        clearInterval(realTimeIntervalRef.current);
        realTimeIntervalRef.current = null;
      }
    };
  }, [fetchStats]);

  return {
    // Data states
    dashboardData,
    dashboardStats,
    selectedClub,
    
    // Loading states
    isLoadingDashboard,
    isLoadingStats,
    isLoadingClubDetail,
    
    // Error states
    dashboardError,
    statsError,
    clubDetailError,
    
    // Actions
    fetchDashboard,
    fetchStats,
    fetchClubDetail,
    refreshDashboard,
    clearErrors,
  };
}; 