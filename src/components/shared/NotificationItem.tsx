import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Notification } from '@/lib/saNotificationService';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    role?: 'superadmin' | 'admin' | 'manager';
}

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'success':
            return '/icon/check-lime.svg';
        case 'warning':
            return '/icon/bell.svg';
        case 'error':
            return '/icon/trash-2.svg';
        default:
            return '/icon/bell.svg';
    }
};

const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
        case 'success':
            return 'border-l-green-500 bg-green-50';
        case 'warning':
            return 'border-l-yellow-500 bg-yellow-50';
        case 'error':
            return 'border-l-red-500 bg-red-50';
        default:
            return 'border-l-blue-500 bg-blue-50';
    }
};

export const NotificationItem = ({ notification, onMarkAsRead, onDelete, role = 'superadmin' }: NotificationItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
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
            className={`relative border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.isRead ? 'bg-opacity-100' : 'bg-opacity-50'
            } hover:bg-opacity-100 transition-all duration-200 cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleNotificationClick}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <Image
                            src={getNotificationIcon(notification.type)}
                            alt="Notification"
                            width={20}
                            height={20}
                            className="mt-1"
                        />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className={`text-sm font-medium ${
                                    !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                                }`}>
                                    {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {formatTime(notification.createdAt)}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-2">
                                {!notification.isRead && (
                                    <button
                                        onClick={(e) => handleButtonClick(e, () => onMarkAsRead(notification.id))}
                                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Đánh dấu đã đọc
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
                                        >
                                            <Image
                                                src="/icon/trash-2.svg"
                                                alt="Delete"
                                                width={16}
                                                height={16}
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
