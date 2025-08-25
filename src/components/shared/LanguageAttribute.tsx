"use client";

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n/provider';

export function LanguageAttribute() {
    const { currentLanguage } = useI18n();

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = currentLanguage;
        }
    }, [currentLanguage]);

    return null;
}
