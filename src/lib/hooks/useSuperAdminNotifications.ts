import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
    getSuperAdminNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationCount,
    Notification 
} from '@/lib/saNotificationService';

export const useSuperAdminNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [toastNotification, setToastNotification] = useState<Notification | null>(null);

    const normalizeNewNotification = (payload: unknown): Notification => {
        if (typeof payload === 'string') {
            return {
                id: String(Date.now()),
                title: 'Thông báo mới',
                message: payload,
                type: 'info',
                isRead: false,
                createdAt: new Date().toISOString(),
                data: { raw: payload as unknown }
            };
        }
        const obj = (typeof payload === 'object' && payload !== null) ? payload as Record<string, unknown> : {};
        const typeValue = typeof obj.type === 'string' && ['info','success','warning','error'].includes(obj.type)
            ? obj.type as Notification['type']
            : 'info';
        return {
            id: typeof obj.id === 'string' ? obj.id : String(Date.now()),
            title: typeof obj.title === 'string' ? obj.title : 'Thông báo mới',
            message: typeof obj.message === 'string' ? obj.message : 'Bạn có thông báo mới',
            type: typeValue,
            isRead: false,
            createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString(),
            data: obj,
        };
    };

    const normalizeFeedbackNotification = (payload: unknown): Notification => {
        const obj = (typeof payload === 'object' && payload !== null) ? payload as Record<string, unknown> : {};
        return {
            id: typeof obj.id === 'string' ? obj.id : (typeof obj._id === 'string' ? obj._id : `feedback-${Date.now()}`),
            title: 'Feedback mới',
            message: typeof obj.message === 'string' ? obj.message : (typeof obj.content === 'string' ? obj.content : 'Bạn có feedback mới'),
            type: 'info',
            isRead: false,
            createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString(),
            data: obj,
        };
    };

    // Kết nối WebSocket
    useEffect(() => {
        const newSocket = io('http://localhost:8000', {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        // Khi kết nối xong: tham gia room theo role
        newSocket.on('connect', () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('superAdminAccessToken') : null;
                if (token) {
                    const [, payloadB64] = token.split('.');
                    const json = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
                    const sAdminId: string | undefined = json?.sAdminId;
                    if (sAdminId) {
                        newSocket.emit('join_role_room', { userId: sAdminId, role: 'superadmin' });
                    }
                } else {
                    // Nếu không có token, vẫn join theo role (userId optional)
                    newSocket.emit('join_role_room', { userId: undefined, role: 'superadmin' });
                }
            } catch {
                // Fallback join theo role nếu decode lỗi
                newSocket.emit('join_role_room', { userId: undefined, role: 'superadmin' });
            }
        });

        // Lắng nghe thông báo mới
        newSocket.on('superadmin_notification', (newNotification: Notification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            // Hiển thị toast notification
            setToastNotification(newNotification);
        });

        // Lắng nghe sự kiện BE: new_notification
        newSocket.on('new_notification', (data: unknown) => {
            const notif = normalizeNewNotification(data);
            setNotifications(prev => [notif, ...prev]);
            setUnreadCount(prev => prev + 1);
            setToastNotification(notif);
        });

        // Lắng nghe sự kiện BE: feedback_created
        newSocket.on('feedback_created', (data: unknown) => {
            const notif = normalizeFeedbackNotification(data);
            setNotifications(prev => [notif, ...prev]);
            setUnreadCount(prev => prev + 1);
            setToastNotification(notif);
        });

        // Lắng nghe cập nhật thông báo
        newSocket.on('notification_updated', (updatedNotification: Notification) => {
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === updatedNotification.id ? updatedNotification : notif
                )
            );
        });

        // Lắng nghe xóa thông báo
        newSocket.on('notification_deleted', (notificationId: string) => {
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Tải thông báo ban đầu
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            // Lấy sAdminId từ token để gọi API theo dạng /notifications/superadmin/:sAdminId
            let sAdminId: string | null = null;
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('superAdminAccessToken') : null;
                if (token) {
                    const [, payloadB64] = token.split('.');
                    const json = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
                    sAdminId = json?.sAdminId || null;
                }
            } catch {}

            const [notificationsRes, unreadCountRes] = await Promise.all([
                sAdminId ? getSuperAdminNotifications(sAdminId) : Promise.resolve({ data: { data: { notifications: [] } } }),
                sAdminId ? getUnreadNotificationCount(sAdminId) : Promise.resolve({ data: { data: { unreadCount: 0 } } })
            ]);
            
            // Map BE response to Notification interface
            const mappedNotifications: Notification[] = notificationsRes.data.data.notifications.map(item => ({
                id: item.notificationId || item._id,
                title: item.title,
                message: item.message,
                type: (item.type === 'feedback' ? 'info' : item.type) as Notification['type'],
                isRead: item.isRead,
                createdAt: item.createdAt,
                data: {
                    _id: item._id,
                    notificationId: item.notificationId,
                    recipientId: item.recipientId,
                    recipientRole: item.recipientRole,
                    feedbackId: item.feedbackId // Thêm feedbackId vào data
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
        loadNotifications();
    }, [loadNotifications]);

    // Đánh dấu thông báo đã đọc
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

    // Đánh dấu tất cả thông báo đã đọc
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

    // Xóa thông báo
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
        isConnected: socket?.connected || false,
        toastNotification,
        clearToast: () => setToastNotification(null)
    };
};
