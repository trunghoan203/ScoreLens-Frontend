"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { HeaderHome } from '@/components/shared/HeaderHome';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { MatchHistorySection } from '@/components/history/MatchHistorySection';

export default function MemberHistoryPage() {
    const params = useParams();
    const memberId = params?.memberId as string;
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Mock data for match history - có thể thay bằng API call thực tế
    const matches = [
        {
            id: '1',
            time: '13:00 08/07/2025',
            type: 'Pool',
            teamA: ['Cao Trung Hoan', 'Vo Nguyen Kim Ngan'],
            teamB: ['Tran Minh Tuan', 'Nguyen Minh Tuan'],
            score: '3-0',
            vod: '#',
        },
        {
            id: '2',
            time: '14:30 07/07/2025',
            type: 'Pool',
            teamA: ['Cao Trung Hoan', 'Vo Nguyen Kim Ngan'],
            teamB: ['Tran Minh Tuan', 'Nguyen Minh Tuan'],
            score: '2-1',
            vod: '#',
        },
        {
            id: '3',
            time: '16:00 06/07/2025',
            type: 'Pool',
            teamA: ['Cao Trung Hoan', 'Vo Nguyen Kim Ngan'],
            teamB: ['Tran Minh Tuan', 'Nguyen Minh Tuan'],
            score: '3-2',
            vod: '#',
        },
        {
            id: '4',
            time: '10:00 05/07/2025',
            type: 'Pool',
            teamA: ['Cao Trung Hoan', 'Vo Nguyen Kim Ngan'],
            teamB: ['Tran Minh Tuan', 'Nguyen Minh Tuan'],
            score: '1-3',
            vod: '#',
        },
    ];

    const filteredMatches = matches.filter(match =>
        search === '' ||
        match.teamA.join(' ').toLowerCase().includes(search.toLowerCase()) ||
        match.teamB.join(' ').toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        const el = document.getElementById('main-content');
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && <ScoreLensLoading text="Đang tải..." />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white min-h-screen pt-24 flex flex-col items-center justify-start">
                <div className="w-full max-w-7xl mx-auto mt-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-black mb-2">
                            Lịch sử thi đấu - Hội viên: {memberId}
                        </h1>
                        <p className="text-gray-600">
                            Tổng cộng {filteredMatches.length} trận đấu
                        </p>
                    </div>
                    <MatchHistorySection 
                        search={search}
                        setSearch={setSearch}
                        matches={filteredMatches}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
} 