"use client";

import React, { useState, useEffect } from 'react';
import { HeaderHome } from '@/components/shared/HeaderHome';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { useI18n } from "@/lib/i18n/provider";

const ROLES = [
  { key: 'business', label: 'guide.roles.business' },
  { key: 'manager', label: 'guide.roles.manager' },
  { key: 'member', label: 'guide.roles.member' },
  { key: 'user', label: 'guide.roles.user' },
];

const getTranslationArray = (t: any, key: string): string[] => {
  const translation = t(key);
  return Array.isArray(translation) ? translation : [];
};

const getGuideContent = (role: string, t: any) => {
  const content = {
    business: (
      <div className="space-y-6 sm:space-y-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#8ADB10] mb-2">
          {t('guide.business.title')}
        </h1>
        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.business.part1.title')}</h2>
          <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
            {t('guide.business.part1.description')}
          </p>
          <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.business.part1.step1.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.business.part1.step1.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.business.part1.step2.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.business.part1.step2.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.business.part1.step3.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.business.part1.step3.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.business.part1.step4.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.business.part1.step4.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.business.part2.title')}</h2>
          <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
            {t('guide.business.part2.description')}
          </p>
          <div className="bg-lime-50 border-l-4 border-lime-400 p-3 sm:p-4 rounded text-lime-800 text-sm sm:text-base md:text-lg mb-4">
            <span className="font-semibold">{t('guide.business.part2.quickStats.title')}</span>
            <ul className="list-disc ml-4 sm:ml-6 mt-2">
              {getTranslationArray(t, 'guide.business.part2.quickStats.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.business.part3.title')}</h2>
          <ol className="list-decimal ml-4 sm:ml-6 space-y-4 text-sm sm:text-base md:text-lg text-[#000000]">
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.business.part3.brandManagement.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.business.part3.brandManagement.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.business.part3.managerManagement.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.business.part3.managerManagement.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.business.part3.feedbackManagement.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.business.part3.feedbackManagement.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.business.part4.title')}</h2>
          <ul className="list-disc ml-4 sm:ml-6 text-sm sm:text-base md:text-lg text-[#000000]">
            {getTranslationArray(t, 'guide.business.part4.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    ),
    manager: (
      <div className="space-y-6 sm:space-y-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#8ADB10] mb-2">
          {t('guide.manager.title')}
        </h1>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.manager.part1.title')}</h2>
          <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
            {t('guide.manager.part1.description')}
          </p>
          <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.manager.part1.receiveInfo.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.manager.part1.receiveInfo.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.manager.part1.loginByEmail.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.manager.part1.loginByEmail.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.manager.part1.subsequentLogin.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.manager.part1.subsequentLogin.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.manager.part2.title')}</h2>
          <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
            {t('guide.manager.part2.description')}
          </p>
          <div className="bg-lime-50 border-l-4 border-lime-400 p-3 sm:p-4 rounded text-lime-800 text-sm sm:text-base md:text-lg mb-4">
            <span className="font-semibold">{t('guide.manager.part2.overview.title')}</span>
            <ul className="list-disc ml-4 sm:ml-6 mt-2">
              {getTranslationArray(t, 'guide.manager.part2.overview.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.manager.part3.title')}</h2>
          <ol className="list-decimal ml-4 sm:ml-6 space-y-4 text-sm sm:text-base md:text-lg text-[#000000]">
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.manager.part3.equipmentManagement.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.manager.part3.equipmentManagement.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.manager.part3.matchManagement.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.manager.part3.matchManagement.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.manager.part3.memberManagement.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.manager.part3.memberManagement.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.manager.part3.feedbackManagement.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.manager.part3.feedbackManagement.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.manager.part4.title')}</h2>
          <ul className="list-disc ml-4 sm:ml-6 text-sm sm:text-base md:text-lg text-[#000000]">
            {getTranslationArray(t, 'guide.manager.part4.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    ),
    member: (
      <div className="space-y-6 sm:space-y-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#8ADB10] mb-2">
          {t('guide.member.title')}
        </h1>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.member.part1.title')}</h2>
          <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
            {t('guide.member.part1.description')}
          </p>
          <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.member.part1.accessRegistration.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.member.part1.accessRegistration.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.member.part1.verifyEmail.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.member.part1.verifyEmail.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.member.part2.title')}</h2>
          <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.member.part2.login.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.member.part2.login.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.member.part2.viewMatchHistory.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.member.part2.viewMatchHistory.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.member.part2.receiveNotifications.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.member.part2.receiveNotifications.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.member.part3.title')}</h2>
          <ul className="list-disc ml-4 sm:ml-6 text-sm sm:text-base md:text-lg text-[#000000]">
            {getTranslationArray(t, 'guide.member.part3.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    ),
    user: (
      <div className="space-y-6 sm:space-y-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#8ADB10] mb-2">
          {t('guide.user.title')}
        </h1>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.user.part1.title')}</h2>
          <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
            {t('guide.user.part1.description')}
          </p>
          <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.user.part1.accessSystem.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.user.part1.accessSystem.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">{t('guide.user.part1.viewMatches.title')}</span>
              <ul className="list-disc ml-4 sm:ml-6">
                {getTranslationArray(t, 'guide.user.part1.viewMatches.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">{t('guide.user.part2.title')}</h2>
          <ul className="list-disc ml-4 sm:ml-6 text-sm sm:text-base md:text-lg text-[#000000]">
            {getTranslationArray(t, 'guide.user.part2.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    ),
  };

  return content[role as keyof typeof content] || null;
};

export default function GuidePage() {
  const { t } = useI18n();
  const [role, setRole] = useState<'business' | 'manager' | 'member' | 'user'>('business');
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      {loading && <ScoreLensLoading text={t('guide.loading')} />}
      <HeaderHome />
      <HeroSection />
      <div id="main-content" className="bg-white text-[#000000] min-h-screen pt-16 sm:pt-24">
        <div className="container mx-auto flex flex-col lg:flex-row gap-4 sm:gap-8 px-4 pb-16">
          <aside className="w-full lg:w-64 flex-shrink-0 mb-6 lg:mb-0 z-10">
            <nav className="bg-[#000000] rounded-xl shadow p-3 sm:p-4 text-[#FFFFFF] sticky top-20 sm:top-28 z-10">
              <ul className="space-y-2">
                {ROLES.map(r => (
                  <li key={r.key}>
                    <button
                      className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg font-bold transition-colors text-sm sm:text-base ${role === r.key ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'text-[#FFFFFF] hover:bg-lime-100 hover:text-[#000000]'}`}
                      onClick={() => setRole(r.key as 'business' | 'manager' | 'member' | 'user')}
                    >
                      {t(r.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <main className="flex-1 bg-white rounded-xl shadow p-4 sm:p-6 lg:p-8 text-[#000000] min-h-[600px] z-10">
            {getGuideContent(role, t)}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
} 