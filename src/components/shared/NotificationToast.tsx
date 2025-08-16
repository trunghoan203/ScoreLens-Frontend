import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Notification } from '@/lib/saNotificationService';

interface NotificationToastProps {
    notification: Notification | null;
    onClose: () => void;
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
            return 'bg-green-500';
        case 'warning':
            return 'bg-yellow-500';
        case 'error':
            return 'bg-red-500';
        default:
            return 'bg-blue-500';
    }
};

export const NotificationToast = ({ notification, onClose }: NotificationToastProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Đợi animation kết thúc
            }, 5000); // Tự động đóng sau 5 giây

            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    if (!notification) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 300, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 300, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getNotificationColor(notification.type)} text-white rounded-lg shadow-lg overflow-hidden`}
                >
                    <div className="flex items-start p-4">
                        <div className="flex-shrink-0">
                            <Image
                                src={getNotificationIcon(notification.type)}
                                alt="Notification"
                                width={20}
                                height={20}
                                className="invert"
                            />
                        </div>
                        
                        <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium">
                                {notification.title}
                            </h4>
                            <p className="text-sm opacity-90 mt-1">
                                {notification.message}
                            </p>
                        </div>
                        
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(onClose, 300);
                            }}
                            className="ml-4 flex-shrink-0 text-white opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-1 bg-black bg-opacity-20">
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 5, ease: 'linear' }}
                            className="h-full bg-white bg-opacity-50"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
