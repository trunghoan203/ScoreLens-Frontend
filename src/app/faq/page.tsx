"use client";
import React, { useState, useEffect } from 'react';
import { HeaderHome } from '@/components/shared/HeaderHome';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { useI18n } from '@/lib/i18n/provider';

const getFAQContent = (category: string, t: any) => {
    const content = {
        general: [
            {
                question: t('faq.general.whatIsScoreLens.question'),
                answer: t('faq.general.whatIsScoreLens.answer')
            },
            {
                question: t('faq.general.needAccount.question'),
                answer: t('faq.general.needAccount.answer')
            },
            {
                question: t('faq.general.isFree.question'),
                answer: t('faq.general.isFree.answer')
            }
        ],
        usage: [
            {
                question: t('faq.usage.howToUse.question'),
                answer: t('faq.usage.howToUse.answer')
            },
            {
                question: t('faq.usage.phoneCompatibility.question'),
                answer: t('faq.usage.phoneCompatibility.answer')
            },
            {
                question: t('faq.usage.editScores.question'),
                answer: t('faq.usage.editScores.answer')
            },
            {
                question: t('faq.usage.endMatch.question'),
                answer: t('faq.usage.endMatch.answer')
            }
        ],
        membership: [
            {
                question: t('faq.membership.howToBecome.question'),
                answer: t('faq.membership.howToBecome.answer')
            },
            {
                question: t('faq.membership.benefits.question'),
                answer: t('faq.membership.benefits.answer')
            },
            {
                question: t('faq.membership.viewHistory.question'),
                answer: t('faq.membership.viewHistory.answer')
            },
            {
                question: t('faq.membership.convertToMember.question'),
                answer: t('faq.membership.convertToMember.answer')
            }
        ],
        technical: [
            {
                question: t('faq.technical.technology.question'),
                answer: t('faq.technical.technology.answer')
            },
            {
                question: t('faq.technical.accuracy.question'),
                answer: t('faq.technical.accuracy.answer')
            },
            {
                question: t('faq.technical.security.question'),
                answer: t('faq.technical.security.answer')
            },
            {
                question: t('faq.technical.offline.question'),
                answer: t('faq.technical.offline.answer')
            }
        ]
    };

    return content[category as keyof typeof content] || [];
};

export default function FAQPage() {
    const { t } = useI18n();
    const [category, setCategory] = useState<'general' | 'usage' | 'membership' | 'technical'>('general');
    const [loading, setLoading] = useState(true);

    const FAQ_CATEGORIES = [
        { key: 'general', label: t('faq.categories.general') },
        { key: 'usage', label: t('faq.categories.usage') },
        { key: 'membership', label: t('faq.categories.membership') },
        { key: 'technical', label: t('faq.categories.technical') },
    ];

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const el = document.getElementById('main-content');
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    const faqs = getFAQContent(category, t);

    return (
        <>
            {loading && <ScoreLensLoading text={t('faq.loading')} />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white text-[#000000] min-h-screen pt-16 sm:pt-24">
                <div className="container mx-auto flex flex-col lg:flex-row gap-4 sm:gap-8 px-4 pb-16">
                    <aside className="w-full lg:w-64 flex-shrink-0 mb-6 lg:mb-0 z-10">
                        <nav className="bg-[#000000] rounded-xl shadow p-3 sm:p-4 text-[#FFFFFF] sticky top-20 sm:top-28 z-10">
                            <ul className="space-y-2">
                                {FAQ_CATEGORIES.map(cat => (
                                    <li key={cat.key}>
                                        <button
                                            className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg font-bold transition-colors text-sm sm:text-base ${category === cat.key ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'text-[#FFFFFF] hover:bg-lime-100 hover:text-[#000000]'}`}
                                            onClick={() => setCategory(cat.key as 'general' | 'usage' | 'membership' | 'technical')}
                                        >
                                            {cat.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>
                    <main className="flex-1 bg-white rounded-xl shadow p-4 sm:p-6 lg:p-8 text-[#000000] min-h-[600px] z-10">
                        <div className="space-y-6">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8ADB10] mb-6">
                                {t('faq.title')}
                            </h1>

                            <div className="space-y-6">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg sm:text-xl font-semibold text-black mb-3">
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <p className="text-gray-600 mb-4">
                                    {t('faq.notFound.title')}
                                </p>
                                <a
                                    href="/guide"
                                    className="inline-block bg-lime-600 text-white px-6 py-3 rounded-lg hover:bg-lime-700 transition-colors"
                                >
                                    {t('faq.notFound.button')}
                                </a>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
}
