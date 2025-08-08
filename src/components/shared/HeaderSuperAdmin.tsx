'use client';

import { useState, useRef, useEffect } from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Image from 'next/image';
import { logoutSuperAdmin } from '@/lib/saService';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';

export function HeaderSuperAdmin() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState<'VI' | 'EN'>('VI');
    const [showLogout, setShowLogout] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'VI', name: 'Việt Nam', flag: '/images/vietNam.png' },
        { code: 'EN', name: 'English', flag: '/images/english.png' }
    ];

    const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleLanguageChange = (languageCode: 'VI' | 'EN') => {
        setCurrentLanguage(languageCode);
        setDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            // Lấy refresh token từ cookies
            const refreshToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('refresh_token='))
                ?.split('=')[1];

            // Gọi API logout
            if (refreshToken) {
                await logoutSuperAdmin(refreshToken);
            }

            // Xóa tất cả token và data từ localStorage
            localStorage.clear();

            // Xóa tất cả cookies
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            // Chuyển hướng về trang login và reload để đảm bảo state được reset
            window.location.replace('/superadmin/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Vẫn xóa local data và chuyển hướng ngay cả khi API call thất bại
            localStorage.clear();
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            window.location.replace('/superadmin/login');
        }
    };

    const handleLogoutClick = () => {
        setShowLogout(true);
    };

    return (
        <>
            <header className="w-full flex justify-between items-center py-4 px-8 bg-black">
                <div className="flex items-center gap-4">
                    <ScoreLensLogo />
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block relative" ref={dropdownRef}>
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:text-lime-400 transition-colors"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <Image
                                src={currentLanguageData?.flag || '/images/vietNam.png'}
                                alt={`${currentLanguageData?.name} Flag`}
                                width={30}
                                height={20}
                                className="rounded-sm"
                            />
                            <span className="text-lg font-medium text-[#FFFFFF]">{currentLanguage}</span>
                            <Image
                                src="/icon/chevron-down.svg"
                                alt="Chevron Down"
                                width={26}
                                height={26}
                                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                            />
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-50">
                                {languages.map((language) => (
                                    <div
                                        key={language.code}
                                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${currentLanguage === language.code ? 'bg-lime-50 text-[#8ADB10]' : 'text-gray-700'
                                            }`}
                                        onClick={() => handleLanguageChange(language.code as 'VI' | 'EN')}
                                    >
                                        <Image
                                            src={language.flag}
                                            alt={`${language.name} Flag`}
                                            width={24}
                                            height={18}
                                            className="rounded-sm"
                                        />
                                        <span className="text-sm font-medium">{language.name}</span>
                                        {currentLanguage === language.code && (
                                            <Image
                                                src="/icon/check-lime.svg"
                                                alt="Check"
                                                width={15}
                                                height={15}
                                                className="ml-auto"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogoutClick}
                        className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded transition"
                    >
                        Đăng xuất
                    </button>
                </div>
            </header>
            <ConfirmPopup
                open={showLogout}
                title="Bạn có chắc chắn muốn đăng xuất không?"
                onCancel={() => setShowLogout(false)}
                onConfirm={handleLogout}
                confirmText="Xác nhận"
                cancelText="Hủy"
            >
                <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-black my-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                    </svg>
                </div>
            </ConfirmPopup>
        </>
    );
}