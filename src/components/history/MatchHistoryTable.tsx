import React from 'react';
import Image from 'next/image';

interface Match {
    id: string;
    time: string;
    type: string;
    winningTeam: string;
    winningTeamMembers: string[];
    score: string;
    vod: string;
    status?: string;
    matchCode?: string;
    clubName?: string;
}

interface MatchHistoryTableProps {
    matches: Match[];
}

export function MatchHistoryTable({ matches }: MatchHistoryTableProps) {
    return (
        <div className="space-y-2 rounded-lg overflow-hidden w-full overflow-x-auto">
            {/* Desktop Table */}
            <div className="hidden lg:block min-w-[1200px] overflow-x-auto">
                <div className="grid grid-cols-10 bg-black text-white font-semibold text-center mb-2" style={{ minWidth: '1200px' }}>
                    <div className="col-span-2 py-3">THỜI GIAN</div>
                    <div className="col-span-2 py-3">CHI NHÁNH</div>
                    <div className="col-span-1 py-3">THỂ THỨC</div>
                    <div className="col-span-2 py-3">ĐỘI THẮNG</div>
                    <div className="col-span-1 py-3">TỶ SỐ</div>
                    <div className="col-span-2 py-3">TRẠNG THÁI</div>
                </div>
                {matches.map(match => (
                    <div key={match.id} className="grid grid-cols-10 items-center text-center bg-gray-200 rounded-lg hover:bg-lime-50 transition mb-2" style={{ minWidth: '1200px' }}>
                        <div className="col-span-2 py-4 font-semibold text-black">{match.time}</div>
                        <div className="col-span-2 py-4 text-gray-700">{match.clubName || 'Không xác định'}</div>
                        <div className="col-span-1 py-4 text-gray-700">{match.type}</div>
                        <div className="col-span-2 py-4 text-gray-700">
                            <div className="font-bold">{match.winningTeam}</div>
                            {match.winningTeamMembers.map((name: string, idx: number) => <div key={idx} className="text-xs">{name}</div>)}
                        </div>
                        <div className="col-span-1 py-4 text-black text-2xl font-extrabold">{match.score}</div>
                        <div className="col-span-2 py-4 flex justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className={`text-xs px-2 py-1 rounded-full font-semibold ${match.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    match.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {match.status === 'completed' ? 'Hoàn thành' :
                                        match.status === 'ongoing' ? 'Đang diễn ra' :
                                            match.status === 'pending' ? 'Chờ bắt đầu' : 'N/A'}
                                </div>
                                <a href={match.vod} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#8ADB10] hover:bg-lime-500 text-white font-bold px-4 py-2 rounded-lg transition">
                                    <Image key="playVideo" src="/icon/playVideo.svg" alt="Play Video" width={20} height={20} className="w-5 h-5" />
                                    VOD
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:hidden space-y-4 mb-8">
                {matches.map(match => (
                    <div key={match.id} className="bg-gray-200 rounded-lg p-4 hover:bg-lime-50 transition">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-center flex-1">
                                <div className="text-sm font-semibold text-gray-600 mb-1">THỜI GIAN</div>
                                <div className="text-sm font-bold text-black">{match.time}</div>
                            </div>
                            <div className="text-center flex-1">
                                <div className="text-sm font-semibold text-gray-600 mb-1">CHI NHÁNH</div>
                                <div className="text-sm text-gray-700">{match.clubName || 'Không xác định'}</div>
                            </div>
                            <div className="text-center flex-1">
                                <div className="text-sm font-semibold text-gray-600 mb-1">THỂ THỨC</div>
                                <div className="text-sm text-gray-700">{match.type}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="text-center">
                                <div className="text-xs font-bold text-gray-700 mb-1">ĐỘI THẮNG</div>
                                {match.winningTeamMembers.map((name: string, idx: number) => (
                                    <div key={idx} className="text-xs text-gray-700">{name}</div>
                                ))}
                            </div>
                            <div className="text-center flex flex-col justify-center">
                                <div className="text-xs font-bold text-gray-600 mb-1">TỶ SỐ</div>
                                <div className="text-lg sm:text-xl font-extrabold text-black">{match.score}</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className={`text-xs px-2 py-1 rounded-full font-semibold ${match.status === 'completed' ? 'bg-green-100 text-green-800' :
                                match.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {match.status === 'completed' ? 'Hoàn thành' :
                                    match.status === 'ongoing' ? 'Đang diễn ra' :
                                        match.status === 'pending' ? 'Chờ bắt đầu' : 'N/A'}
                            </div>
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