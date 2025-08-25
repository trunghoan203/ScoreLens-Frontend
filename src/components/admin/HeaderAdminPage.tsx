import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/lib/axios';
import Image from 'next/image';
import { useAdminNotifications } from '@/lib/hooks/useAdminNotifications';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { Menu, X } from 'lucide-react';
import { useMobileMenuStore } from '@/lib/mobileMenuState';
import { useI18n } from '@/lib/i18n/provider';
import LanguageSelector from '@/components/shared/LanguageSelector';


export default function HeaderAdminPage() {
  const { t, currentLanguage } = useI18n();
  const [adminName, setAdminName] = useState<string>('Chưa đăng nhập');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [brandName, setBrandName] = useState<string>('Chưa đăng nhập');
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenuStore();

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useAdminNotifications();

  // Initialize translated text after component mounts
  useEffect(() => {
    setAdminName(t('common.notLoggedIn'));
    setBrandName(t('common.notLoggedIn'));
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;
    if (token) {
      axios.get('/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const data = res.data as { admin?: { fullName?: string, brandId?: string } };
          if (data.admin && data.admin.fullName) {
            setAdminName(data.admin.fullName);
          }

          if (data.admin && data.admin.brandId) {
            axios.get(`/admin/brands/${data.admin.brandId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(brandRes => {
                const brandData = brandRes.data as { success?: boolean, brand?: { brandName?: string } };
                if (brandData.success && brandData.brand && brandData.brand.brandName) {
                  setBrandName(brandData.brand.brandName);
                }
              })
              .catch(() => {
                setBrandName(t('common.unknownBrand'));
              });
          }
        })
        .catch(() => {
          setAdminName(t('common.admin'));
          setBrandName(t('common.unknownBrand'));
        });
    }
  }, []);

  // Only update text when language changes if we don't have actual data
  useEffect(() => {
    // Only reset to default values if we don't have actual user data
    if (adminName === 'Chưa đăng nhập' || adminName === 'Not logged in') {
      setAdminName(t('common.notLoggedIn'));
    }
    if (brandName === 'Chưa đăng nhập' || brandName === 'Not logged in') {
      setBrandName(t('common.notLoggedIn'));
    }
  }, [currentLanguage, t, adminName, brandName]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between w-full min-h-[60px] gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            className="lg:hidden p-2 rounded-lg bg-[#181818] text-white shadow-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('common.toggleNavigationMenu')}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-[#000000] sm:text-xl lg:text-2xl font-bold truncate">
            {brandName}
          </h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <LanguageSelector variant="light" />

          <div className="relative" ref={notificationRef}>
            <motion.button
              onClick={() => setNotificationOpen(prev => !prev)}
              className={`relative focus:outline-none p-2 sm:p-3 rounded-full transition-all duration-300 touch-manipulation ${notificationOpen
                ? 'bg-lime-500/20 border-2 border-lime-400 shadow-lg shadow-lime-500/25'
                : 'hover:bg-gray-100 hover:shadow-md hover:scale-105 active:scale-95'
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
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${notificationOpen
                    ? 'text-lime-600'
                    : 'text-gray-500 hover:text-lime-500'
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </motion.div>

              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg border-2 border-white"
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
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 border border-gray-100"
                  style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                >
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-3 sm:p-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-lime-100 rounded-lg">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-lime-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
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
                          className="text-xs bg-lime-500 hover:bg-lime-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-200 font-medium shadow-md hover:shadow-lg touch-manipulation"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t('common.markAllAsRead')}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                      <div className="p-6 sm:p-8 text-center">
                        <motion.div
                          className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-lime-500 mx-auto"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 font-medium">{t('common.loadingNotifications')}</p>
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
                              role="admin"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        className="p-8 sm:p-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p className="text-sm sm:text-base font-medium text-gray-600 mb-1 sm:mb-2">{t('common.noNotifications')}</p>
                        <p className="text-xs sm:text-sm text-gray-400">{t('common.newNotificationsWillAppearHere')}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
            <Image
              src="/images/Avatar.png"
              alt={t('common.profile')}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm sm:text-base text-gray-700 truncate hidden sm:block">{adminName}</span>
        </div>
      </div>



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