import axios from './axios';

export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: Record<string, unknown>;
}

export const getManagerNotifications = (managerId: string) =>
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
    }> } }>(`/notifications/manager/${encodeURIComponent(managerId)}`);

export const markNotificationAsRead = (notificationId: string) =>
    axios.put(`/notifications/${notificationId}/read`);

export const markAllNotificationsAsRead = () =>
    axios.put('/notifications/read-all');

export const deleteNotification = (notificationId: string) =>
    axios.delete(`/notifications/${notificationId}`);

export const getUnreadNotificationCount = (managerId: string) =>
    axios.get<{ success: boolean; data: { unreadCount: number } }>(`/notifications/manager/${encodeURIComponent(managerId)}/unread-count`);
