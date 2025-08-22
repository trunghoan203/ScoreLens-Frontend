"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeaderHome } from '@/components/shared/HeaderHome';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { MatchHistorySection } from '@/components/history/MatchHistorySection';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';

export default function MemberHistoryPage() {
    const params = useParams();
    const router = useRouter();
    const membershipId = params?.memberId as string;
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [matches, setMatches] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [membershipInfo, setMembershipInfo] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMatches, setTotalMatches] = useState(0);
    const itemPage = 10;

    interface MatchData {
        matchId: string;
        matchCode: string;
        gameType: string;
        status: string;
        startTime?: string;
        endTime?: string;
        createdAt: string;
        tableId: string;
        clubInfo?: {
            clubId: string;
            clubName: string;
        };
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
            if (!membershipId) {
                setError('Không tìm thấy mã hội viên');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await userMatchService.getMatchHistory(membershipId, itemPage, currentPage);

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
                toast.error('Không thể tải lịch sử trận đấu');
            } finally {
                setLoading(false);
            }
        };

        fetchMatchHistory();
    }, [membershipId, currentPage]);

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
                time: match.startTime ? new Date(match.startTime).toLocaleString('vi-VN') :
                    match.createdAt ? new Date(match.createdAt).toLocaleString('vi-VN') : 'N/A',
                type: gameType,
                winningTeam: winningTeam,
                winningTeamMembers: winningTeamMembers,
                score: score,
                vod: '#',
                status: match.status,
                matchCode: match.matchCode,
                clubName: match.clubInfo?.clubName || 'Không xác định'
            };
        });
    };

    const transformedMatches = transformMatches(matches);
    const filteredMatches = transformedMatches.filter(match =>
        search === '' ||
        match.winningTeamMembers.join(' ').toLowerCase().includes(search.toLowerCase()) ||
        match.type.toLowerCase().includes(search.toLowerCase()) ||
        match.clubName.toLowerCase().includes(search.toLowerCase())
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {loading && <ScoreLensLoading text="Đang tải..." />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white min-h-screen pt-16 sm:pt-20 md:pt-24 flex flex-col items-center justify-start">
                <div className="w-full max-w-7xl mx-auto mt-4 sm:mt-6 md:mt-8 px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 sm:mb-6 text-center">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2">
                            Lịch sử thi đấu - Hội viên: {membershipInfo?.fullName || membershipId}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            {membershipInfo && (
                                <span className="block mb-1">
                                    Mã hội viên: {membershipInfo.phoneNumber}
                                </span>
                            )}
                            Tổng cộng {totalMatches} trận đấu
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
                                matches={filteredMatches}
                            />

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
        </>
    );
} 