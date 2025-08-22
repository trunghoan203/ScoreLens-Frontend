"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderHome } from '@/components/shared/HeaderHome';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { MemberIdForm } from '@/components/history/MemberIdForm';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';


export default function HistoryPage() {
    const router = useRouter();
    const [memberId, setMemberId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        const el = document.getElementById('main-content');
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (memberId.trim()) {
            setLoading(true);
            try {
                const response = await userMatchService.getMembershipByPhoneNumber(memberId.trim());

                if (response && typeof response === 'object' && 'success' in response && response.success && 'data' in response && response.data) {
                    const membershipData = response.data as any;
                    router.push(`/history/${membershipData.membershipId}`);
                } else {
                    toast.error('Không tìm thấy hội viên với số điện thoại này');
                    setLoading(false);
                }
            } catch (error: any) {
                console.error('Error finding membership:', error);
                toast.error('Không tìm thấy hội viên với số điện thoại này');
                setLoading(false);
            }
        }
    };

    return (
        <>
            {loading && <ScoreLensLoading text="Đang tải..." />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white min-h-screen pt-16 sm:pt-24 flex flex-col items-center justify-start">
                <div className="w-full max-w-3xl mx-auto mt-4 sm:mt-8 px-4">
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