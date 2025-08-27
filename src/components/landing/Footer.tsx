import React from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import { useI18n } from '@/lib/i18n/provider';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-gray-400 hover:text-white transition-colors">{children}</a>
);

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="py-8 sm:py-12 md:py-16 border-t border-gray-800 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center">
            <ScoreLensLogo />
          </div>
          <p className="text-gray-400 mt-4 text-sm sm:text-base md:text-lg">{t('home.footer.tagline')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center lg:text-left">
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">{t('home.footer.functions.title')}</h4>
            <div className="space-y-2 sm:space-y-3 flex flex-col">
              {t('home.footer.functions.items').map((item: string, index: number) => (
                <FooterLink key={index} href="/">{item}</FooterLink>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">{t('home.footer.support.title')}</h4>
            <div className="space-y-2 sm:space-y-3 flex flex-col">
              <FooterLink href="/faq">Frequently asked questions</FooterLink>
              <FooterLink href="/terms">Terms of service</FooterLink>
              <FooterLink href="/guide">Online guide (FAQs)</FooterLink>
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">{t('home.footer.contact.title')}</h4>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-gray-400 text-sm sm:text-base">{t('home.footer.contact.phone')}</p>
              <p className="text-gray-400 text-sm sm:text-base">{t('home.footer.contact.email')}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 