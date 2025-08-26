import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Notification } from '@/lib/saNotificationService';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    role?: 'superadmin' | 'admin' | 'manager';
}

export const NotificationItem = ({ notification, onMarkAsRead, onDelete, role = 'superadmin' }: NotificationItemProps) => {
    const { t } = useI18n();
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return t('shared.notificationItem.justNow');
        if (diffInMinutes < 60) return `${diffInMinutes} ${t('shared.notificationItem.minutesAgo')}`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ${t('shared.notificationItem.hoursAgo')}`;
        return `${Math.floor(diffInMinutes / 1440)} ${t('shared.notificationItem.daysAgo')}`;
    };

    const handleNotificationClick = () => {
        const feedbackId = notification.data?.feedbackId as string;

        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }

        if (feedbackId) {

            switch (role) {
                case 'superadmin':
                    router.push(`/superadmin/feedback/${feedbackId}`);
                    break;
                case 'admin':
                    router.push(`/admin/feedbacks/${feedbackId}`);
                    break;
                case 'manager':
                    router.push(`/manager/feedbacks/${feedbackId}`);
                    break;
                default:
                    router.push(`/superadmin/feedback/${feedbackId}`);
            }
        }
    };

    const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative border-l-4 ${!notification.isRead ? 'bg-opacity-100' : 'bg-opacity-50'
                } hover:bg-opacity-100 transition-all duration-200 cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleNotificationClick}
        >
            <div className="p-2 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                        <Image
                            src="/icon/bell.svg"
                            alt="Notification"
                            width={20}
                            height={20}
                            className="mt-1 w-4 h-4 sm:w-5 sm:h-5"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className={`text-xs sm:text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'
                                    }`}>
                                    {notification.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 sm:mt-2">
                                    {formatTime(notification.createdAt)}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
                                {!notification.isRead && (
                                    <button
                                        onClick={(e) => handleButtonClick(e, () => onMarkAsRead(notification.id))}
                                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
                                    >
                                        {t('shared.notificationItem.markAsRead')}
                                    </button>
                                )}

                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={(e) => handleButtonClick(e, () => onDelete(notification.id))}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            aria-label={t('shared.notificationItem.delete')}
                                        >
                                            <Image
                                                src="/icon/trash-2.svg"
                                                alt={t('shared.notificationItem.delete')}
                                                width={16}
                                                height={16}
                                                className="w-3 h-3 sm:w-4 sm:h-4"
                                            />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
