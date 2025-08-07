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
        <div className="space-y-2 rounded-lg overflow-hidden w-full min-w-[1200px]">
            <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
                <div className="col-span-2 py-3">THỜI GIAN</div>
                <div className="col-span-2 py-3">THỂ THỨC</div>
                <div className="col-span-2 py-3">TEAM A</div>
                <div className="col-span-2 py-3">TỶ SỐ</div>
                <div className="col-span-2 py-3">TEAM B</div>
                <div className="col-span-2 py-3">VIDEO</div>
            </div>
            {matches.map(match => (
                <div key={match.id} className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg hover:bg-lime-50 transition">
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
    );
} 