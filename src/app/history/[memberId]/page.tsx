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
import { useI18n } from '@/lib/i18n/provider';

export default function MemberHistoryPage() {
    const { t } = useI18n();
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
        videoUrl?: string;
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
                setError(t('history.detailPage.phoneNotFound'));
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
                    setError(t('history.detailPage.cannotLoadHistory'));
                    toast.error(t('history.detailPage.cannotLoadHistory'));
                }
            } catch (error: any) {
                console.error('Error fetching match history:', error);
                setError(t('history.detailPage.cannotLoadHistory'));
            }
        };

        fetchMatchHistory();
    }, [phoneNumber, currentPage]);

    const transformMatches = (apiMatches: MatchData[]) => {
        return apiMatches.map(match => {
            const teamAMembers = match.teams[0]?.members.map(m =>
                m.membershipName || m.guestName || t('history.detailPage.unknown')
            ) || [];
            const teamBMembers = match.teams[1]?.members.map(m =>
                m.membershipName || m.guestName || t('history.detailPage.unknown')
            ) || [];

            const score = `${match.teams[0]?.score || 0}-${match.teams[1]?.score || 0}`;
            const gameType = match.gameType === 'pool-8' ? t('history.detailPage.pool') : t('history.detailPage.carom');

            let winningTeam = t('history.detailPage.draw');
            let winningTeamMembers: string[] = [];

            if (match.teams[0]?.isWinner) {
                winningTeam = t('history.detailPage.teamA');
                winningTeamMembers = teamAMembers;
            } else if (match.teams[1]?.isWinner) {
                winningTeam = t('history.detailPage.teamB');
                winningTeamMembers = teamBMembers;
            }

            return {
                id: match.matchId,
                time: match.endTime ? new Date(match.endTime).toLocaleString('vi-VN') : t('history.detailPage.notAvailable'),
                startTime: match.startTime ? new Date(match.startTime).toLocaleString('vi-VN') : t('history.detailPage.notAvailable'),
                endTime: match.endTime ? new Date(match.endTime).toLocaleString('vi-VN') : t('history.detailPage.notAvailable'),
                playTime: match.startTime && match.endTime ?
                    formatPlayTime(new Date(match.endTime).getTime() - new Date(match.startTime).getTime()) : t('history.detailPage.notAvailable'),
                type: gameType,
                winningTeam: winningTeam,
                winningTeamMembers: winningTeamMembers,
                score: score,
                videoUrl: match.videoUrl && match.videoUrl.trim() !== '' && match.matchId ? match.videoUrl : '#',
                status: match.status,
                matchCode: match.matchCode,
                clubName: match.clubInfo?.clubName || t('history.detailPage.notDetermined'),
                address: match.clubInfo?.address || t('history.detailPage.notDetermined'),
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
            {loading && <ScoreLensLoading text={t('history.loading')} />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white min-h-screen pt-16 sm:pt-12 md:pt-16 flex flex-col items-center justify-start">
                <div className="w-full max-w-7xl mx-auto sm:mt-6 md:mt-8 px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 sm:mb-6 text-center">
                        <h1 className="text-3xl sm:text-2xl lg:text-6xl font-bold text-black mb-10">
                            {t('history.detailPage.title')}
                        </h1>
                        <p className="text-sm sm:text-base text-black">
                            {membershipInfo && (
                                <span className="block mb-2">
                                    {t('history.detailPage.memberIdLabel')} <span className="text-xl font-bold">{membershipInfo.phoneNumber}</span>
                                </span>
                            )}
                            {t('history.detailPage.totalMatches')} <span className="text-xl font-bold">{totalMatches}</span> {t('history.detailPage.matches')}
                        </p>
                    </div>
                    {error ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 mb-4">{error}</div>
                            <button
                                onClick={() => router.push('/history')}
                                className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-6 py-2 rounded-lg transition"
                            >
                                {t('history.detailPage.backToSearch')}
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
                                            ? t('history.detailPage.noMatchesFound')
                                            : t('history.detailPage.noMatchesYet')
                                    }
                                    description={
                                        search && dateFilter
                                            ? t('history.detailPage.tryDifferentKeywords')
                                            : search
                                                ? t('history.detailPage.tryDifferentSearch')
                                                : dateFilter
                                                    ? t('history.detailPage.tryDifferentDate')
                                                    : t('history.detailPage.noMatchesInSystem')
                                    }
                                    secondaryAction={
                                        search || dateFilter ? {
                                            label: t('history.detailPage.viewAll'),
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
                                    {t('history.detailPage.showingResults')
                                        .replace('{start}', String(((currentPage - 1) * itemPage) + 1))
                                        .replace('{end}', String(Math.min(currentPage * itemPage, totalMatches)))
                                        .replace('{total}', String(totalMatches))}
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