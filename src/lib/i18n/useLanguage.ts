import { useI18n } from './provider';

export const useLanguage = () => {
    const { currentLanguage, changeLanguage } = useI18n();

    return {
        currentLanguage,
        changeLanguage,
    };
};
