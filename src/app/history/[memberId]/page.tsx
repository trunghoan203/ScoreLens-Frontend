"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeaderHome } from '@/components/shared/HeaderHome';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { MatchHistorySection } from '@/components/history/MatchHistorySection';
import { MatchDetailPopup } from '@/components/history/MatchDetailPopup';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';
import EmptyState from '@/components/ui/EmptyState';
import { Search, RotateCcw } from 'lucide-react';

export default function MemberHistoryPage() {
    const params = useParams();
    const router = useRouter();
    const phoneNumber = params?.memberId as string;
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [matches, setMatches] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [membershipInfo, setMembershipInfo] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMatches, setTotalMatches] = useState(0);
    const [selectedMatch, setSelectedMatch] = useState<any>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const itemPage = 10;

    const formatPlayTime = (milliseconds: number): string => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            const el = document.getElementById('main-content');
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    interface MatchData {
        matchId: string;
        matchCode: string;
        gameType: string;
        status: string;
        startTime?: string;
        endTime?: string;
        tableId: string;
        clubInfo?: {
            clubId: string;
            clubName: string;
            address: string;
        };
        isAIAssisted?: boolean;
        teams: Array<{
            teamName: string;
            score: number;
            isWinner: boolean;
            members: Array<{
                membershipId?: string;
                membershipName?: string;
                guestName?: string;
                role: string;
            }>;
        }>;
    }

    useEffect(() => {
        const fetchMatchHistory = async () => {
            if (!phoneNumber) {
                setError('Không tìm thấy số điện thoại');
                return;
            }

            try {
                const response = await userMatchService.getMatchHistory(phoneNumber, itemPage, currentPage);

                if (response && typeof response === 'object' && 'success' in response && response.success && 'data' in response && response.data) {
                    const matchHistory = response.data as MatchData[];
                    setMatches(matchHistory);

                    if (response && typeof response === 'object' && 'membershipInfo' in response && response.membershipInfo) {
                        setMembershipInfo(response.membershipInfo);
                    }

                    if (response && typeof response === 'object' && 'pagination' in response && response.pagination) {
                        const pagination = response.pagination as any;
                        setTotalPages(pagination.pages || 1);
                        setTotalMatches(pagination.total || 0);
                    }
                } else {
                    setError('Không thể tải lịch sử trận đấu');
                    toast.error('Không thể tải lịch sử trận đấu');
                }
            } catch (error: any) {
                console.error('Error fetching match history:', error);
                setError('Không thể tải lịch sử trận đấu');
            }
        };

        fetchMatchHistory();
    }, [phoneNumber, currentPage]);

    const transformMatches = (apiMatches: MatchData[]) => {
        return apiMatches.map(match => {
            const teamAMembers = match.teams[0]?.members.map(m =>
                m.membershipName || m.guestName || 'Unknown'
            ) || [];
            const teamBMembers = match.teams[1]?.members.map(m =>
                m.membershipName || m.guestName || 'Unknown'
            ) || [];

            const score = `${match.teams[0]?.score || 0}-${match.teams[1]?.score || 0}`;
            const gameType = match.gameType === 'pool-8' ? 'Pool' : 'Carom';

            let winningTeam = 'Hòa';
            let winningTeamMembers: string[] = [];

            if (match.teams[0]?.isWinner) {
                winningTeam = 'ĐỘI A';
                winningTeamMembers = teamAMembers;
            } else if (match.teams[1]?.isWinner) {
                winningTeam = 'ĐỘI B';
                winningTeamMembers = teamBMembers;
            }

            return {
                id: match.matchId,
                time: match.endTime ? new Date(match.endTime).toLocaleString('vi-VN') : 'N/A',
                startTime: match.startTime ? new Date(match.startTime).toLocaleString('vi-VN') : 'N/A',
                endTime: match.endTime ? new Date(match.endTime).toLocaleString('vi-VN') : 'N/A',
                playTime: match.startTime && match.endTime ?
                    formatPlayTime(new Date(match.endTime).getTime() - new Date(match.startTime).getTime()) : 'N/A',
                type: gameType,
                winningTeam: winningTeam,
                winningTeamMembers: winningTeamMembers,
                score: score,
                vod: '#',
                status: match.status,
                matchCode: match.matchCode,
                clubName: match.clubInfo?.clubName || 'Không xác định',
                address: match.clubInfo?.address || 'Không xác định',
                isAIAssisted: match.isAIAssisted,
                teams: match.teams
            };
        });
    };

    const dateFilteredMatches = dateFilter ? matches.filter(match => {
        if (match.endTime) {
            const matchDate = new Date(match.endTime);
            const filterDate = new Date(dateFilter);
            return matchDate.toDateString() === filterDate.toDateString();
        }
        return false;
    }) : matches;

    const transformedMatches = transformMatches(dateFilteredMatches);
    const filteredMatches = transformedMatches.filter(match => {
        return search === '' ||
            match.winningTeamMembers.join(' ').toLowerCase().includes(search.toLowerCase()) ||
            match.type.toLowerCase().includes(search.toLowerCase()) ||
            match.clubName.toLowerCase().includes(search.toLowerCase());
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewDetail = (match: any) => {
        setSelectedMatch(match);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedMatch(null);
    };

    return (
        <>
            {loading && <ScoreLensLoading text="Đang tải..." />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white min-h-screen pt-16 sm:pt-12 md:pt-16 flex flex-col items-center justify-start">
                <div className="w-full max-w-7xl mx-auto sm:mt-6 md:mt-8 px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 sm:mb-6 text-center">
                        <h1 className="text-3xl sm:text-2xl lg:text-6xl font-bold text-black mb-10">
                            LỊCH SỬ ĐẤU
                        </h1>
                        <p className="text-sm sm:text-base text-black">
                            {membershipInfo && (
                                <span className="block mb-2">
                                    Mã Hội viên: <span className="text-xl font-bold">{membershipInfo.phoneNumber}</span>
                                </span>
                            )}
                            Tổng cộng <span className="text-xl font-bold">{totalMatches}</span> trận đấu
                        </p>
                    </div>
                    {error ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 mb-4">{error}</div>
                            <button
                                onClick={() => router.push('/history')}
                                className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-6 py-2 rounded-lg transition"
                            >
                                Quay lại trang tìm kiếm
                            </button>
                        </div>
                    ) : (
                        <>
                            <MatchHistorySection
                                search={search}
                                setSearch={setSearch}
                                dateFilter={dateFilter}
                                setDateFilter={setDateFilter}
                                matches={filteredMatches}
                                onViewDetail={handleViewDetail}
                            />

                            {/* Empty State khi không có kết quả tìm kiếm hoặc lọc */}
                            {filteredMatches.length === 0 && (
                                <EmptyState
                                    icon={
                                        <Search className="w-14 h-14 text-white" strokeWidth={1.5} />
                                    }
                                    title={
                                        search || dateFilter
                                            ? 'Không tìm thấy trận đấu phù hợp'
                                            : 'Chưa có trận đấu nào'
                                    }
                                    description={
                                        search && dateFilter
                                            ? 'Thử thay đổi từ khóa tìm kiếm hoặc ngày tháng để tìm thấy trận đấu phù hợp'
                                            : search
                                                ? 'Thử thay đổi từ khóa tìm kiếm để tìm thấy trận đấu phù hợp'
                                                : dateFilter
                                                    ? 'Thử thay đổi ngày tháng để tìm thấy trận đấu phù hợp'
                                                    : 'Hội viên này chưa có trận đấu nào trong hệ thống'
                                    }
                                    secondaryAction={
                                        search || dateFilter ? {
                                            label: 'Xem tất cả',
                                            onClick: () => {
                                                setSearch('');
                                                setDateFilter('');
                                            },
                                            icon: (
                                                <RotateCcw className="w-5 h-5" />
                                            )
                                        } : undefined
                                    }
                                />
                            )}

                            {totalPages > 1 && (
                                <div className="mt-10 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-3 w-16 rounded-lg font-medium transition flex items-center justify-center ${currentPage === 1
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-lime-400 hover:bg-lime-500 text-white'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-2 w-10 rounded-lg font-medium transition flex items-center justify-center ${currentPage === page
                                                ? 'bg-lime-500 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-3 w-16 rounded-lg font-medium transition flex items-center justify-center ${currentPage === totalPages
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-lime-400 hover:bg-lime-500 text-white'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="mt-4 text-center text-gray-400 italic text-xs">
                                    Hiển thị {((currentPage - 1) * itemPage) + 1}-{Math.min(currentPage * itemPage, totalMatches)} trong tổng số {totalMatches} trận đấu
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
            <MatchDetailPopup
                match={selectedMatch}
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
            />
        </>
    );
} 