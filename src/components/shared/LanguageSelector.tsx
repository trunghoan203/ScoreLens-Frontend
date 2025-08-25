"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface LanguageSelectorProps {
    variant?: 'dark' | 'light';
}

export default function LanguageSelector({ variant = 'dark' }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { currentLanguage, changeLanguage, t } = useI18n();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageChange = (language: 'en' | 'vi') => {
        changeLanguage(language);
        setIsOpen(false);
    };

    const textColorClass = variant === 'dark' ? 'text-white hover:text-lime-400' : 'text-gray-700 hover:text-lime-600';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 transition-colors ${textColorClass}`}
            >
                <Image
                    src={currentLanguage === 'vi' ? '/images/vietNam.png' : '/images/english.png'}
                    alt={currentLanguage === 'vi' ? 'Vietnamese' : 'English'}
                    width={20}
                    height={15}
                    className="w-5 h-4"
                />
                <span className="text-sm font-medium">
                    {currentLanguage === 'vi' ? 'VI' : 'EN'}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                        <button
                            onClick={() => handleLanguageChange('vi')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLanguage === 'vi' ? 'text-lime-600 bg-lime-50' : 'text-gray-700'
                                }`}
                        >
                            <Image
                                src="/images/vietNam.png"
                                alt="Vietnamese"
                                width={20}
                                height={15}
                                className="w-5 h-4"
                            />
                            <span>{t('common.vietnamese')}</span>
                            {currentLanguage === 'vi' && (
                                <svg className="w-4 h-4 ml-auto text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => handleLanguageChange('en')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLanguage === 'en' ? 'text-lime-600 bg-lime-50' : 'text-gray-700'
                                }`}
                        >
                            <Image
                                src="/images/english.png"
                                alt="English"
                                width={20}
                                height={15}
                                className="w-5 h-4"
                            />
                            <span>{t('common.english')}</span>
                            {currentLanguage === 'en' && (
                                <svg className="w-4 h-4 ml-auto text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
