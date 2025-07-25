"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderHome } from '@/components/shared/HeaderHome';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { MemberIdForm } from '@/components/history/MemberIdForm';


export default function HistoryPage() {
    const router = useRouter();
    const [memberId, setMemberId] = useState('');
    const [loading, setLoading] = useState(true);
    // const [search, setSearch] = useState('');

    // Mock data for match history
    // const matches = [
    //     {
    //         id: '1',
    //         time: '13:00 08/07/2025',
    //         type: 'Pool',
    //         teamA: ['Cao Trung Hoan', 'Vo Nguyen Kim Ngan'],
    //         teamB: ['Tran Minh Tuan', 'Nguyen Minh Tuan'],
    //         score: '3-0',
    //         vod: '#',
    //     },
    //     {
    //         id: '2',
    //         time: '13:00 08/07/2025',
    //         type: 'Pool',
    //         teamA: ['Cao Trung Hoan', 'Vo Nguyen Kim Ngan'],
    //         teamB: ['Tran Minh Tuan', 'Nguyen Minh Tuan'],
    //         score: '3-0',
    //         vod: '#',
    //     },
    //     {
    //         id: '3',
    //         time: '13:00 08/07/2025',
    //         type: 'Pool',
    //         teamA: ['Cao Trung Hoan', 'Vo Nguyen Kim Ngan'],
    //         teamB: ['Tran Minh Tuan', 'Nguyen Minh Tuan'],
    //         score: '3-0',
    //         vod: '#',
    //     },
    //     {
    //         id: '4',
    //         time: '13:00 08/07/2025',
    //         type: 'Pool',
    //         teamA: ['Cao Trung Hoan', 'Vo Nguyen Kim Ngan'],
    //         teamB: ['Tran Minh Tuan', 'Nguyen Minh Tuan'],
    //         score: '3-0',
    //         vod: '#',
    //     },
    // ];

    // const filteredMatches = matches.filter(match =>
    //     search === '' ||
    //     match.teamA.join(' ').toLowerCase().includes(search.toLowerCase()) ||
    //     match.teamB.join(' ').toLowerCase().includes(search.toLowerCase())
    // );

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        const el = document.getElementById('main-content');
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (memberId.trim()) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                router.push(`/history/${memberId.trim()}`);
            }, 1000);
        }
    };

    return (
        <>
            {loading && <ScoreLensLoading text="Đang tải..." />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white min-h-screen pt-24 flex flex-col items-center justify-start">
                <div className="w-full max-w-3xl mx-auto mt-8">
                    <MemberIdForm
                        memberId={memberId}
                        setMemberId={setMemberId}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
} 