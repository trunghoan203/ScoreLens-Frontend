'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Image from 'next/image';
import { logoutSuperAdmin } from '@/lib/saService';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import { useSuperAdminNotifications } from '@/lib/hooks/useSuperAdminNotifications';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { useI18n } from '@/lib/i18n/provider';
import LanguageSelector from '@/components/shared/LanguageSelector';


export function HeaderSuperAdmin() {
    const { t } = useI18n();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useSuperAdminNotifications();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const refreshToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('refresh_token='))
                ?.split('=')[1];

            if (refreshToken) {
                await logoutSuperAdmin(refreshToken);
            }

            const savedLanguage = localStorage.getItem('scorelens-language');

            localStorage.clear();

            if (savedLanguage) {
                localStorage.setItem('scorelens-language', savedLanguage);
            }

            document.cookie.split(';').forEach(function (c) {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });

            window.location.replace('/superadmin/login');
        } catch {
            const savedLanguage = localStorage.getItem('scorelens-language');

            localStorage.clear();

            if (savedLanguage) {
                localStorage.setItem('scorelens-language', savedLanguage);
            }

            document.cookie.split(';').forEach(function (c) {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            window.location.replace('/superadmin/login');
        }
    };

    const handleLogoutClick = () => {
        setShowLogout(true);
    };

    return (
        <>
            <header className="w-full flex justify-between items-center py-5 px-4 sm:px-8 bg-black/60 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-4">
                    <ScoreLensLogo href="/superadmin/home" />
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSelector variant="dark" />

                    <div className="relative" ref={notificationRef}>
                        <motion.button
                            onClick={() => setNotificationOpen(prev => !prev)}
                            className={`relative focus:outline-none p-2.5 sm:p-3 rounded-full transition-all duration-300 ${notificationOpen
                                ? 'bg-lime-500/20 border-2 border-lime-400 shadow-lg shadow-lime-500/25'
                                : 'hover:bg-white/10 hover:shadow-md hover:scale-105 active:scale-95'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{
                                    rotate: notificationOpen ? 15 : 0,
                                    scale: unreadCount > 0 ? [1, 1.1, 1] : 1
                                }}
                                transition={{
                                    duration: 0.3,
                                    scale: { repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 2 }
                                }}
                            >
                                <Image
                                    src="/icon/bell.svg"
                                    alt={t('common.notifications')}
                                    width={22}
                                    height={22}
                                    className={`transition-all duration-300 ${notificationOpen
                                        ? 'invert brightness-0 contrast-200'
                                        : 'invert brightness-0 hover:brightness-75'
                                        }`}
                                />
                            </motion.div>

                            <AnimatePresence>
                                {unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg border-2 border-white"
                                    >
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>


                        </motion.button>

                        <AnimatePresence>
                            {notificationOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="absolute left-1/4 transform -translate-x-1/2 mt-3 w-80 sm:w-96 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 border border-gray-100 max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-180px)]"
                                    style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                                >
                                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-2.5 sm:p-5 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="p-1.5 sm:p-2 bg-lime-100 rounded-lg">
                                                    <Image
                                                        src="/icon/bell.svg"
                                                        alt={t('common.notifications')}
                                                        width={18}
                                                        height={18}
                                                        className="brightness-0 saturate-100 filter hue-rotate-90 w-4 h-4 sm:w-5 sm:h-5"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                        {t('common.notifications')}
                                                    </h3>
                                                    {unreadCount > 0 && (
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            {unreadCount} {t('common.newNotifications')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {unreadCount > 0 && (
                                                <motion.button
                                                    onClick={markAllAsRead}
                                                    className="text-xs bg-lime-500 hover:bg-lime-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {t('common.markAllAsRead')}
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                                        {loading ? (
                                            <div className="p-8 text-center">
                                                <motion.div
                                                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                                <p className="text-sm text-gray-500 mt-4 font-medium">{t('common.loadingNotifications')}</p>
                                            </div>
                                        ) : notifications.length > 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                {notifications.map((notification, index) => (
                                                    <motion.div
                                                        key={notification.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <NotificationItem
                                                            notification={notification}
                                                            onMarkAsRead={markAsRead}
                                                            onDelete={deleteNotification}
                                                            role="superadmin"
                                                        />
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="p-6 sm:p-12 text-center"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <div className="bg-gray-100 w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                                    <Image
                                                        src="/icon/empty.svg"
                                                        alt={t('common.noNotifications')}
                                                        width={40}
                                                        height={40}
                                                        className="opacity-60 w-7 h-7 sm:w-10 sm:h-10"
                                                    />
                                                </div>
                                                <p className="text-sm sm:text-base font-medium text-gray-600 mb-2">{t('common.noNotifications')}</p>
                                                <p className="text-xs sm:text-sm text-gray-400">{t('common.newNotificationsWillAppearHere')}</p>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={handleLogoutClick}
                        className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-3 sm:px-4 py-2.5 sm:py-2 rounded transition text-sm sm:text-base"
                    >
                        {t('common.logout')}
                    </button>
                </div>
            </header>

            <ConfirmPopup
                open={showLogout}
                title={t('common.confirmLogout')}
                onCancel={() => setShowLogout(false)}
                onConfirm={handleLogout}
                confirmText={t('common.confirm')}
                cancelText={t('common.cancel')}
            >
                <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-black my-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                    </svg>
                </div>
            </ConfirmPopup>



            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }
            `}</style>
        </>
    );
}
