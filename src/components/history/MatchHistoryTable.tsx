import React from 'react';
import Image from 'next/image';

interface Match {
    id: string;
    time: string;
    type: string;
    teamA: string[];
    teamB: string[];
    score: string;
    vod: string;
}

interface MatchHistoryTableProps {
    matches: Match[];
}

export function MatchHistoryTable({ matches }: MatchHistoryTableProps) {
    return (
        <div className="space-y-2 rounded-lg overflow-hidden w-full">
            {/* Desktop Table */}
            <div className="hidden lg:block min-w-[1200px]">
                <div className="grid grid-cols-12 bg-black text-white font-semibold text-center mb-2">
                    <div className="col-span-2 py-3">THỜI GIAN</div>
                    <div className="col-span-2 py-3">THỂ THỨC</div>
                    <div className="col-span-2 py-3">TEAM A</div>
                    <div className="col-span-2 py-3">TỶ SỐ</div>
                    <div className="col-span-2 py-3">TEAM B</div>
                    <div className="col-span-2 py-3">VIDEO</div>
                </div>
                {matches.map(match => (
                    <div key={match.id} className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg hover:bg-lime-50 transition mb-2">
                        <div className="col-span-2 py-4 font-semibold text-black">{match.time}</div>
                        <div className="col-span-2 py-4 text-gray-700">{match.type}</div>
                        <div className="col-span-2 py-4 text-gray-700">
                            <div className="font-bold">TEAM A</div>
                            {match.teamA.map((name, idx) => <div key={idx} className="text-xs">{name}</div>)}
                        </div>
                        <div className="col-span-2 py-4 text-black text-2xl font-extrabold">{match.score}</div>
                        <div className="col-span-2 py-4 text-gray-700">
                            <div className="font-bold">TEAM B</div>
                            {match.teamB.map((name, idx) => <div key={idx} className="text-xs">{name}</div>)}
                        </div>
                        <div className="col-span-2 py-4 flex justify-center">
                            <a href={match.vod} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#8ADB10] hover:bg-lime-500 text-white font-bold px-4 py-2 rounded-lg transition">
                                <Image key="playVideo" src="/icon/playVideo.svg" alt="Play Video" width={20} height={20} className="w-5 h-5" />
                                VOD
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:hidden space-y-4 mb-8">
                {matches.map(match => (
                    <div key={match.id} className="bg-gray-200 rounded-lg p-4 hover:bg-lime-50 transition">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-center flex-2">
                                <div className="text-sm font-semibold text-gray-600 mb-1">THỜI GIAN</div>
                                <div className="text-sm font-bold text-black">{match.time}</div>
                            </div>
                            <div className="text-center flex-2 ml-35">
                                <div className="text-sm font-semibold text-gray-600 mb-1">THỂ THỨC</div>
                                <div className="text-sm text-gray-700">{match.type}</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center">
                                <div className="text-xs font-bold text-gray-700 mb-1">TEAM A</div>
                                {match.teamA.map((name, idx) => (
                                    <div key={idx} className="text-xs text-gray-700">{name}</div>
                                ))}
                            </div>
                            <div className="text-center flex flex-col justify-center">
                                <div className="text-xs font-bold text-gray-600 mb-1">TỶ SỐ</div>
                                <div className="text-lg sm:text-xl font-extrabold text-black">{match.score}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-gray-700 mb-1">TEAM B</div>
                                {match.teamB.map((name, idx) => (
                                    <div key={idx} className="text-xs text-gray-700">{name}</div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex justify-center">
                            <a href={match.vod} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#8ADB10] hover:bg-lime-500 text-white font-bold px-3 sm:px-4 py-2 rounded-lg transition text-sm">
                                <Image key="playVideo" src="/icon/playVideo.svg" alt="Play Video" width={16} height={16} className="w-4 h-4" />
                                VOD
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 