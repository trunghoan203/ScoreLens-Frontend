import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
    getAdminNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationCount,
    Notification 
} from '@/lib/adminNotificationService';
import { config } from '@/lib/config';

export const useAdminNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);

    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            let adminId: string | null = null;
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;
                if (token) {
                    const [, payloadB64] = token.split('.');
                    const json = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
                    adminId = json?.adminId || null;
                }
            } catch {}

            const [notificationsRes, unreadCountRes] = await Promise.all([
                adminId ? getAdminNotifications(adminId) : Promise.resolve({ data: { data: { notifications: [] } } }),
                adminId ? getUnreadNotificationCount(adminId) : Promise.resolve({ data: { data: { unreadCount: 0 } } })
            ]);
            
            const mappedNotifications: Notification[] = notificationsRes.data.data.notifications.map(item => ({
                id: item.notificationId || item._id,
                title: item.title,
                message: item.message,
                isRead: item.isRead,
                createdAt: item.createdAt,
                data: {
                    _id: item._id,
                    notificationId: item.notificationId,
                    recipientId: item.recipientId,
                    recipientRole: item.recipientRole,
                    feedbackId: item.feedbackId
                }
            }));
            
            setNotifications(mappedNotifications);
            setUnreadCount(unreadCountRes.data.data.unreadCount);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const newSocket = io(config.socketUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;
                if (token) {
                    const [, payloadB64] = token.split('.');
                    const json = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
                    const adminId: string | undefined = json?.adminId;
                    if (adminId) {
                        newSocket.emit('join_role_room', { userId: adminId, role: 'admin' });
                    }
                } else {
                    newSocket.emit('join_role_room', { userId: undefined, role: 'admin' });
                }
            } catch {
                newSocket.emit('join_role_room', { userId: undefined, role: 'admin' });
            }
        });

        newSocket.on('admin_notification', (newNotification: Notification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        newSocket.on('feedback_created', (data: unknown) => {
            const feedbackData = data as Record<string, unknown>;
            if (feedbackData && feedbackData.status === 'adminP') {
                loadNotifications();
            }
        });

        newSocket.on('new_notification', () => {
            setTimeout(() => {
                loadNotifications();
            }, 1000);
        });

        newSocket.on('notification_updated', (updatedNotification: Notification) => {
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === updatedNotification.id ? updatedNotification : notif
                )
            );
        });

        newSocket.on('notification_deleted', (notificationId: string) => {
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [loadNotifications]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId 
                        ? { ...notif, isRead: true }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }, []);

    const deleteNotif = useCallback(async (notificationId: string) => {
        try {
            await deleteNotification(notificationId);
            const notification = notifications.find(n => n.id === notificationId);
            if (notification && !notification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }, [notifications]);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification: deleteNotif,
        refreshNotifications: loadNotifications,
        isConnected: socket?.connected || false
    };
};
