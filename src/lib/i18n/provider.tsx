"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from './locales/en';
import vi from './locales/vi';

export type Locale = 'en' | 'vi';

interface I18nContextType {
    t: (key: string) => any;
    currentLanguage: Locale;
    changeLanguage: (language: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Locale, any> = {
    en,
    vi,
};

const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : path;
    }, obj);
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [currentLanguage, setCurrentLanguage] = useState<Locale>('vi');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('scorelens-language') as Locale;
            if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
                setCurrentLanguage(savedLanguage);
            }
        }
    }, []);

    const changeLanguage = (language: Locale) => {
        setCurrentLanguage(language);
        if (typeof window !== 'undefined') {
            localStorage.setItem('scorelens-language', language);
        }
    };

    const t = (key: string): any => {
        const translation = getNestedValue(translations[currentLanguage], key);
        return translation !== key ? translation : key;
    };

    return (
        <I18nContext.Provider value={{ t, currentLanguage, changeLanguage }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};
