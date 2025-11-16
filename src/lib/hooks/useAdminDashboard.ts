import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  adminDashboardService, 
  DashboardData, 
  DashboardStats, 
  ClubDetail 
} from '../adminDashboardService';

interface UseAdminDashboardReturn {
  dashboardData: DashboardData | null;
  dashboardStats: DashboardStats | null;
  selectedClub: ClubDetail | null;
  
  isLoadingDashboard: boolean;
  isLoadingStats: boolean;
  isLoadingClubDetail: boolean;
  
  dashboardError: string | null;
  statsError: string | null;
  clubDetailError: string | null;
  
  fetchDashboard: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchClubDetail: (clubId: string) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearErrors: () => void;
}

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [selectedClub, setSelectedClub] = useState<ClubDetail | null>(null);
  
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingClubDetail, setIsLoadingClubDetail] = useState(false);
  
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [clubDetailError, setClubDetailError] = useState<string | null>(null);
  
  const realTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const refreshDashboard = useCallback(async () => {
    await Promise.all([fetchDashboard(), fetchStats()]);
  }, [fetchDashboard, fetchStats]);

  const clearErrors = useCallback(() => {
    setDashboardError(null);
    setStatsError(null);
    setClubDetailError(null);
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchStats();
  }, [fetchDashboard, fetchStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);
    
    realTimeIntervalRef.current = interval;
    
    return () => {
      if (realTimeIntervalRef.current) {
        clearInterval(realTimeIntervalRef.current);
        realTimeIntervalRef.current = null;
      }
    };
  }, [fetchStats]);

  return {
    dashboardData,
    dashboardStats,
    selectedClub,
    
    isLoadingDashboard,
    isLoadingStats,
    isLoadingClubDetail,
    
    dashboardError,
    statsError,
    clubDetailError,
    
    fetchDashboard,
    fetchStats,
    fetchClubDetail,
    refreshDashboard,
    clearErrors,
  };
}; 