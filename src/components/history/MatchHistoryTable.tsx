import React from 'react';
import { useI18n } from '@/lib/i18n/provider';

interface Match {
    id: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    playTime?: string;
    type: string;
    winningTeam: string;
    winningTeamMembers: string[];
    score: string;
    videoUrl: string;
    status?: string;
    matchCode?: string;
    clubName?: string;
    address?: string;
    isAIAssisted?: boolean;
}

interface MatchHistoryTableProps {
    matches: Match[];
    onViewDetail: (match: Match) => void;
}

export function MatchHistoryTable({ matches, onViewDetail }: MatchHistoryTableProps) {
    const { t } = useI18n();

    return (
        <div className="space-y-2 rounded-lg overflow-hidden w-full overflow-x-auto">
            {/* Desktop Table */}
            <div className="hidden lg:block min-w-[1200px] overflow-x-auto">
                <div className="grid grid-cols-10 bg-black text-white font-semibold text-center mb-2" style={{ minWidth: '1200px' }}>
                    <div className="col-span-2 py-3">{t('matchHistory.table.time')}</div>
                    <div className="col-span-2 py-3">{t('matchHistory.table.branch')}</div>
                    <div className="col-span-1 py-3">{t('matchHistory.table.format')}</div>
                    <div className="col-span-2 py-3">{t('matchHistory.table.winningTeam')}</div>
                    <div className="col-span-1 py-3">{t('matchHistory.table.score')}</div>
                </div>
                {matches.map(match => (
                    <div key={match.id} className="grid grid-cols-10 items-center text-center bg-gray-200 rounded-lg hover:bg-lime-50 transition mb-2" style={{ minWidth: '1200px' }}>
                        <div className="col-span-2 py-4 font-semibold text-[#000000]">{match.time}</div>
                        <div className="col-span-2 py-4 font-semibold text-[#000000]">{match.clubName || t('matchHistory.table.unknown')}</div>
                        <div className="col-span-1 py-4 font-semibold text-[#000000]">{match.type}</div>
                        <div className="col-span-2 py-4 text-[#000000]">
                            <div className="font-bold">{match.winningTeam}</div>
                            {match.winningTeamMembers.map((name: string, idx: number) => <div key={idx} className="text-xs">{name}</div>)}
                        </div>
                        <div className="col-span-1 py-4 text-black text-2xl font-bold">{match.score}</div>
                        <div className="col-span-2 py-4 flex justify-center">
                            <button
                                onClick={() => onViewDetail(match)}
                                className="bg-lime-400 hover:bg-lime-500 text-white text-sm font-semibold px-4 py-3 rounded-full cursor-pointer transition"
                            >
                                {t('matchHistory.table.viewDetails')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:hidden space-y-4 mb-8">
                {matches.map(match => (
                    <div key={match.id} className="bg-gray-200 rounded-lg p-4 hover:bg-lime-50 transition">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-center flex-1">
                                <div className="text-sm font-semibold text-[#000000] mb-1">{t('matchHistory.table.time')}</div>
                                <div className="text-sm font-bold text-black">{match.time}</div>
                            </div>
                            <div className="text-center flex-1">
                                <div className="text-sm font-semibold text-[#000000] mb-1">{t('matchHistory.table.branch')}</div>
                                <div className="text-sm text-[#000000]">{match.clubName || t('matchHistory.table.unknown')}</div>
                            </div>
                            <div className="text-center flex-1">
                                <div className="text-sm font-semibold text-[#000000] mb-1">{t('matchHistory.table.format')}</div>
                                <div className="text-sm text-[#000000]">{match.type}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="text-center">
                                <div className="text-xs font-bold text-[#000000] mb-1">{t('matchHistory.table.winningTeam')}</div>
                                {match.winningTeamMembers.map((name: string, idx: number) => (
                                    <div key={idx} className="text-xs text-[#000000]">{name}</div>
                                ))}
                            </div>
                            <div className="text-center flex flex-col justify-center">
                                <div className="text-xs font-bold text-[#000000] mb-1">{t('matchHistory.table.score')}</div>
                                <div className="text-lg sm:text-xl font-extrabold text-black">{match.score}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => onViewDetail(match)}
                            className="bg-lime-400 hover:bg-lime-500 text-white font-bold px-4 py-2 rounded-full transition text-sm"
                        >
                            {t('matchHistory.table.viewDetails')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
} 