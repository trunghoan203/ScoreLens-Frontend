import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface MatchDetail {
    matchId?: string;
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
    clubName?: string;
    address?: string;
    isAIAssisted?: boolean;
    teams?: Array<{
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

interface MatchDetailPopupProps {
    match: MatchDetail | null;
    isOpen: boolean;
    onClose: () => void;
}

export function MatchDetailPopup({ match, isOpen, onClose }: MatchDetailPopupProps) {
    const { t } = useI18n();

    if (!isOpen || !match) return null;

    const isValidVideoUrl = (url: string): boolean => {
        return Boolean(url && url !== '#' && url.startsWith('http') && url.length > 10);
    };

    const canShowVOD = (match: MatchDetail): boolean => {
        return Boolean(
            match.isAIAssisted &&
            isValidVideoUrl(match.videoUrl)
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="w-full rounded-xl bg-lime-400 shadow-lg py-4 flex items-center justify-center mb-8">
                        <span className="text-2xl font-extrabold text-white text-center tracking-widest flex items-center gap-3">
                            {t('matchDetailPopup.title')}
                        </span>
                    </div>
                    <div className="space-y-4">
                        {/* Match Information Header */}
                        <div className="bg-white rounded-lg p-2">
                            <div className="space-y-1 text-base">
                                <div className="flex justify-between">
                                    <span className="text-[#000000]">{t('matchDetailPopup.branch')}</span>
                                    <span className="font-medium text-[#000000] text-right">{match.clubName || t('matchDetailPopup.unknown')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#000000]">{t('matchDetailPopup.location')}</span>
                                    <span className="font-medium text-[#000000] text-right">{match.address || t('matchDetailPopup.unknownLocation')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#000000]">{t('matchDetailPopup.gameType')}</span>
                                    <span className="font-medium capitalize text-[#000000]">{match.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#000000]">{t('matchDetailPopup.startTime')}</span>
                                    <span className="font-medium text-[#000000] text-right">{match.startTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#000000]">{t('matchDetailPopup.endTime')}</span>
                                    <span className="font-medium text-[#000000] text-right">{match.endTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#000000]">{t('matchDetailPopup.playTime')}</span>
                                    <span className="font-medium font-mono text-base text-[#000000]">{match.playTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#000000]">{t('matchDetailPopup.aiMatch')}</span>
                                    <span className="font-medium font-mono text-base text-[#000000]">{match.isAIAssisted ? t('matchDetailPopup.yes') : t('matchDetailPopup.no')}</span>
                                </div>

                            </div>
                        </div>

                        {/* Teams */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
                            {match.teams && match.teams.map((team, teamIndex) => (
                                <div key={teamIndex} className="bg-white rounded-lg p-3">
                                    <h3 className="font-semibold text-xl mb-2 text-[#000000]">
                                        {team.teamName}
                                        {team.isWinner && <span className="ml-1 text-lime-600">🏆</span>}
                                    </h3>
                                    <div className={`p-2 rounded-lg ${team.isWinner ? 'bg-lime-100 border-lime-300' : 'bg-gray-100'}`}>
                                        <div className="text-center mb-2">
                                            <span className={`text-2xl font-bold ${team.isWinner ? 'text-lime-600' : 'text-[#000000]'}`}>
                                                {team.score}
                                            </span>
                                        </div>
                                        <div className="text-xs text-[#000000]">
                                            {team.members && team.members.length > 0 ? (
                                                team.members.map((member, memberIndex) => (
                                                    <div key={memberIndex} className="truncate mb-1 text-center font-semibold">
                                                        {t('matchDetailPopup.player')} {memberIndex + 1}: {member.membershipName || member.guestName || t('matchDetailPopup.unknown')}
                                                        {member.role === 'host' && <span className="ml-1 text-blue-600">{t('matchDetailPopup.host')}</span>}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="truncate mb-1 text-center font-semibold text-[#000000]">
                                                    {t('matchDetailPopup.noMembers')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Winner Announcement */}
                        {match.teams && match.teams.find(team => team.isWinner) && (
                            <div className="text-center p-2 bg-lime-50 rounded-lg border border-lime-200">
                                <div className="text-xl mb-1">🎉</div>
                                <div className="text-lg font-bold text-[#000000] mb-1">
                                    {match.teams.find(team => team.isWinner)?.teamName} {t('matchDetailPopup.winnerAnnouncement')}
                                </div>
                            </div>
                        )}

                        {/* VOD Button - Only show if isAIAssisted is true */}
                        {canShowVOD(match) && (
                            <div className="bg-gray-100 p-4 rounded-lg text-center">
                                <div className="text-sm text-[#000000] mb-2">{t('matchDetailPopup.matchVideo')}</div>
                                <a
                                    href={match.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#8ADB10] hover:bg-lime-500 text-white font-bold px-6 py-3 rounded-lg transition"
                                >
                                    <Image
                                        src="/icon/playVideo.svg"
                                        alt="Play Video"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6"
                                    />
                                    {t('matchDetailPopup.vod')}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                            {t('matchDetailPopup.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
