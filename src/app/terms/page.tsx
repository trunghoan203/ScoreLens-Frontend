"use client";
import React, { useState, useEffect } from "react";
import { HeaderHome } from '@/components/shared/HeaderHome';
import { Footer } from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { useI18n } from '@/lib/i18n/provider';

export default function TermsPage() {
    const [section, setSection] = useState<'general' | 'account' | 'usage' | 'privacy' | 'liability' | 'termination'>('general');
    const [loading, setLoading] = useState(true);
    const { t } = useI18n();

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

    const TERMS_SECTIONS = [
        { key: 'general', label: t('terms.sections.general') },
        { key: 'account', label: t('terms.sections.account') },
        { key: 'usage', label: t('terms.sections.usage') },
        { key: 'privacy', label: t('terms.sections.privacy') },
        { key: 'liability', label: t('terms.sections.liability') },
        { key: 'termination', label: t('terms.sections.termination') },
    ];

    const TERMS_CONTENT: Record<string, React.ReactNode> = {
        general: (
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                    {t('terms.general.title')}
                </h1>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.general.acceptance.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.general.acceptance.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.general.serviceDescription.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.general.serviceDescription.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.general.serviceDescription.features').map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.general.ageAndCapacity.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.general.ageAndCapacity.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.general.termsChanges.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.general.termsChanges.content')}
                    </p>
                </section>
            </div>
        ),

        account: (
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                    {t('terms.account.title')}
                </h1>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.account.registration.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.account.registration.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.account.registration.requirements').map((requirement: string, index: number) => (
                            <li key={index}>{requirement}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.account.verification.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.account.verification.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.account.accountOwnership.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.account.accountOwnership.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.account.informationSecurity.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.account.informationSecurity.content')}
                    </p>
                </section>
            </div>
        ),

        usage: (
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                    {t('terms.usage.title')}
                </h1>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.usage.legalUse.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.usage.legalUse.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.usage.prohibitedBehavior.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.usage.prohibitedBehavior.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.usage.prohibitedBehavior.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.usage.cameraSystem.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.usage.cameraSystem.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.usage.cameraSystem.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.usage.userContent.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.usage.userContent.content')}
                    </p>
                </section>
            </div>
        ),

        privacy: (
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                    {t('terms.privacy.title')}
                </h1>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.privacy.informationCollection.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.privacy.informationCollection.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.privacy.informationCollection.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.privacy.informationUse.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.privacy.informationUse.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.privacy.informationUse.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.privacy.informationSharing.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.privacy.informationSharing.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.privacy.informationSharing.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.privacy.informationProtection.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.privacy.informationProtection.content')}
                    </p>
                </section>
            </div>
        ),

        liability: (
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                    {t('terms.liability.title')}
                </h1>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.liability.liabilityLimitation.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.liability.liabilityLimitation.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.liability.liabilityLimitation.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.liability.serviceAccuracy.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.liability.serviceAccuracy.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.liability.userResponsibility.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.liability.userResponsibility.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.liability.userResponsibility.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.liability.indemnification.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.liability.indemnification.content')}
                    </p>
                </section>
            </div>
        ),

        termination: (
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                    {t('terms.termination.title')}
                </h1>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.termination.serviceTermination.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.termination.serviceTermination.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.termination.terminationConsequences.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.termination.terminationConsequences.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.termination.terminationConsequences.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.termination.serviceChanges.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.termination.serviceChanges.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.termination.applicableLaw.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.termination.applicableLaw.content')}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t('terms.termination.contact.title')}</h2>
                    <p className="text-base md:text-lg text-gray-800 mb-2">
                        {t('terms.termination.contact.content')}
                    </p>
                    <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                        {t('terms.termination.contact.items').map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>
            </div>
        ),
    };

    return (
        <>
            {loading && <ScoreLensLoading text={t('terms.loading')} />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white text-black min-h-screen pt-24">
                <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 pb-16">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
                        <nav className="bg-white rounded-xl shadow p-4 text-black sticky top-28">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">{t('terms.pageTitle')}</h3>
                            <ul className="space-y-2">
                                {TERMS_SECTIONS.map(s => (
                                    <li key={s.key}>
                                        <button
                                            className={`w-full text-left px-4 py-2 rounded-lg font-bold transition-colors text-sm ${section === s.key ? 'bg-lime-100 text-lime-600' : 'text-black hover:bg-gray-100'
                                                }`}
                                            onClick={() => setSection(s.key as 'general' | 'account' | 'usage' | 'privacy' | 'liability' | 'termination')}
                                        >
                                            {s.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white rounded-xl shadow p-8 text-black min-h-[600px]">
                        {TERMS_CONTENT[section]}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
}
