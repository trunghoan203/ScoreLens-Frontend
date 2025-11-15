import axios from './axios';

export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: Record<string, unknown>;
}

export const getSuperAdminNotifications = (sAdminId: string) =>
    axios.get<{ success: boolean; data: { notifications: Array<{
        _id: string;
        notificationId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: string;
        recipientId: string;
        recipientRole: string;
        feedbackId?: string;
    }> } }>(`/notifications/superadmin/${encodeURIComponent(sAdminId)}`);

export const markNotificationAsRead = (notificationId: string) =>
    axios.put(`/notifications/${notificationId}/read`);

export const markAllNotificationsAsRead = () =>
    axios.put('/notifications/read-all');

export const deleteNotification = (notificationId: string) =>
    axios.delete(`/notifications/${notificationId}`);

export const getUnreadNotificationCount = (sAdminId: string) =>
    axios.get<{ success: boolean; data: { unreadCount: number } }>(`/notifications/superadmin/${encodeURIComponent(sAdminId)}/unread-count`);
