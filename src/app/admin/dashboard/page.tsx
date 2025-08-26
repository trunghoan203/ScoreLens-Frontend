'use client';
import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Table2, 
  AlertCircle,

} from 'lucide-react';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import EmptyState from '@/components/ui/EmptyState';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAdminDashboard } from '@/lib/hooks/useAdminDashboard';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const {
    dashboardData,
    dashboardStats,
    isLoadingDashboard,
    dashboardError,
    refreshDashboard,
    clearErrors,
  } = useAdminDashboard();


  const stats = dashboardData?.summary || dashboardStats ? {
    totalBranches: dashboardStats?.branches.total || 0,
    activeBranches: dashboardStats?.branches.open || 0,
    closedBranches: dashboardStats?.branches.closed || 0,
    totalTables: dashboardStats?.tables.total || 0,
    activeTables: dashboardStats?.tables.inUse || 0,
    availableTables: dashboardStats?.tables.empty || 0,
    maintenanceTables: dashboardStats?.tables.maintenance || 0,
    totalManagers: dashboardStats?.managers.total || 0,
    activeManagers: dashboardStats?.managers.working || 0,
    pendingFeedbacks: dashboardStats?.feedbacks.pending || 0,
    totalFeedbacks: dashboardStats?.feedbacks.total || 0,
    resolvedFeedbacks: dashboardStats?.feedbacks.resolved || 0,
  } : null;

  const branchChartData = dashboardData?.branchComparison?.map((branch) => ({
    name: branch.branchName,
    tables: branch.tables,
    managers: branch.managers,
  })) || [];

  const tableStatusData = dashboardData?.tableStatusDistribution?.map((item) => ({
    name: item.status,
    value: item.count,
    color: item.status === 'Đang sử dụng' ? '#10B981' : 
           item.status === 'Trống' ? '#6B7280' : '#F59E0B',
  })) || [];

  if (isLoadingDashboard && !dashboardData) {
    return (
      <>
        <ScoreLensLoading text="Đang tải..." />
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
          <Sidebar />
          <main className="flex-1 bg-white min-h-screen lg:ml-0">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300 shadow-sm">
              <HeaderAdminPage />
            </div>
            <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
              <div className="w-full mx-auto">
                <LoadingSkeleton type="card" />
                <div className="mt-8">
                  <LoadingSkeleton type="card" lines={3} className="w-full" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (dashboardError && !stats) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen lg:ml-0">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300 shadow-sm">
            <HeaderAdminPage />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
            <div className="w-full mx-auto">
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
                  <p className="text-gray-600 mb-6">{dashboardError}</p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={clearErrors}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Xóa lỗi
                    </Button>
                    <Button 
                      onClick={refreshDashboard}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Thử lại
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!stats) return null;

  const hasData = stats.totalBranches > 0 || stats.totalTables > 0 || stats.totalManagers > 0;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <main className="flex-1 bg-white min-h-screen lg:ml-0">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300 shadow-sm">
          <HeaderAdminPage />
        </div>

        <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
          <div className="w-full mx-auto">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6 sm:mb-8 ">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-widest flex items-center gap-2 sm:gap-3">
                BẢNG ĐIỀU KHIỂN
              </span>
      </div>
            
            {!hasData ? (
              <EmptyState
                icon={
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="Chưa có dữ liệu"
                description="Hệ thống chưa có chi nhánh hoặc dữ liệu để hiển thị"
                showAdditionalInfo={true}
              />
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Tổng chi nhánh</h3>
                        <div className="text-6xl font-bold text-blue-900 leading-none">{stats.totalBranches}</div>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="flex justify-center gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-700">{stats.activeBranches}</div>
                          <div className="text-xs text-blue-600 font-medium mt-1">Đang mở</div>
                        </div>
                        <div className="w-px bg-blue-200"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-700">{stats.closedBranches}</div>
                          <div className="text-xs text-blue-600 font-medium mt-1">Đóng cửa</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bàn */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Tổng bàn</h3>
                        <div className="text-6xl font-bold text-green-900 leading-none">{stats.totalTables}</div>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="flex justify-center gap-3 mt-6">
                        <div className="text-center flex-1">
                          <div className="text-xl font-bold text-green-700">{stats.activeTables}</div>
                          <div className="text-xs text-green-600 font-medium mt-1">Sử dụng</div>
                        </div>
                        <div className="w-px bg-green-200"></div>
                        <div className="text-center flex-1">
                          <div className="text-xl font-bold text-gray-700">{stats.availableTables}</div>
                          <div className="text-xs text-gray-600 font-medium mt-1">Trống</div>
                        </div>
                        <div className="w-px bg-green-200"></div>
                        <div className="text-center flex-1">
                          <div className="text-xl font-bold text-yellow-700">{stats.maintenanceTables}</div>
                          <div className="text-xs text-yellow-600 font-medium mt-1">Bảo trì</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quản lý */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-purple-800 mb-2">Quản lý</h3>
                        <div className="text-6xl font-bold text-purple-900 leading-none">{stats.totalManagers}</div>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="flex justify-center gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-700">{stats.activeManagers}</div>
                          <div className="text-xs text-purple-600 font-medium mt-1">Làm việc</div>
                        </div>
                        <div className="w-px bg-purple-200"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-700">{stats.totalManagers - stats.activeManagers}</div>
                          <div className="text-xs text-gray-600 font-medium mt-1">Tạm nghỉ</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phản hồi */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-orange-800 mb-2">Phản hồi</h3>
                        <div className="text-6xl font-bold text-orange-900 leading-none">{stats.totalFeedbacks}</div>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="flex justify-center gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-700">{stats.pendingFeedbacks}</div>
                          <div className="text-xs text-orange-600 font-medium mt-1">Cần xử lý</div>
                        </div>
                        <div className="w-px bg-orange-200"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-700">{Math.floor(stats.resolvedFeedbacks)}</div>
                          <div className="text-xs text-gray-600 font-medium mt-1">Đã xử lý</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Branch Comparison Chart */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">So sánh chi nhánh</h3>
                          <p className="text-sm text-gray-600">Số lượng bàn và quản lý theo chi nhánh</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {branchChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                                                 <BarChart data={branchChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                           <XAxis dataKey="name" stroke="#6b7280" />
                           <YAxis stroke="#6b7280" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar dataKey="tables" fill="#10B981" radius={[4, 4, 0, 0]} name="Bàn" />
                          <Bar dataKey="managers" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Quản lý" />
                        </BarChart>
                      </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                          <div className="text-center">
                            <Table2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Chưa có dữ liệu biểu đồ</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table Status Pie Chart */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="p-6 pb-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Trạng thái bàn</h3>
                          <p className="text-sm text-gray-600">Phân bố bàn đang sử dụng và trống</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {tableStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                                                     <Pie
                             data={tableStatusData}
                             cx="50%"
                             cy="50%"
                             labelLine={false}
                             label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                             outerRadius={80}
                             fill="#8884d8"
                             dataKey="value"
                           >
                            {tableStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                          <div className="text-center">
                            <Table2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Chưa có dữ liệu biểu đồ</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Branch Statistics */}
                {dashboardData?.branchDetails && dashboardData.branchDetails.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="p-6 pb-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Thống kê chi tiết theo chi nhánh
                      </h3>
                        <p className="text-sm text-gray-600 mt-1">Xem chi tiết hoạt động của từng chi nhánh</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                        {dashboardData.branchDetails.map((branch, index: number) => (
                        <div 
                            key={branch.clubId} 
                          className="group relative overflow-hidden border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-lime-300 transition-all duration-300 cursor-pointer bg-gradient-to-r from-white to-gray-50/50 hover:from-lime-50/30 hover:to-white"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-lime-100 group-hover:to-lime-200 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md">
                                  <Building2 className="h-6 w-6 text-gray-600 group-hover:text-lime-600 transition-colors duration-300" />
                              </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-lime-700 transition-colors duration-300">
                                      {branch.clubName}
                              </h3>
                                  <p className="text-sm text-gray-500 mt-1">Chi nhánh #{index + 1}</p>
                                </div>
                            </div>
                              <div className="flex flex-wrap gap-3">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 transition-all duration-200 shadow-sm">
                                  <Table2 className="h-3 w-3 mr-2" />
                                    {branch.totalTables} bàn
                              </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100 transition-all duration-200 shadow-sm">
                                  <Users className="h-3 w-3 mr-2" />
                                    {branch.totalManagers} quản lý
                              </Badge>
                            </div>
                          </div>
                          
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Table Status */}
                              <div className="group/table relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:border-green-300 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover/table:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                  <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                      <Table2 className="h-4 w-4 text-gray-600" />
                                </div>
                                Trạng thái bàn
                              </h4>
                                  <div className="flex justify-between items-center">
                                <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{branch.tablesInUse}</div>
                                      <div className="text-xs text-gray-500 font-medium">Đang sử dụng</div>
                                </div>
                                    <div className="w-px h-12 bg-gray-300"></div>
                                <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-600">{branch.emptyTables}</div>
                                      <div className="text-xs text-gray-500 font-medium">Trống</div>
                                    </div>
                                    <div className="w-px h-12 bg-gray-300"></div>
                                <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-600">{branch.maintenanceTables}</div>
                                      <div className="text-xs text-gray-500 font-medium">Bảo trì</div>
                                      </div>
                                    </div>
                                  </div>
                            </div>

                            {/* Manager Status */}
                              <div className="group/manager relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/manager:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                  <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                      <Users className="h-4 w-4 text-gray-600" />
                                </div>
                                Trạng thái quản lý
                              </h4>
                                  <div className="flex justify-between items-center">
                                <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{branch.workingManagers}</div>
                                      <div className="text-xs text-gray-500 font-medium">Đang làm việc</div>
                                </div>
                                    <div className="w-px h-12 bg-gray-300"></div>
                                <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-600">{branch.onLeaveManagers}</div>
                                      <div className="text-xs text-gray-500 font-medium">Tạm nghỉ</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}