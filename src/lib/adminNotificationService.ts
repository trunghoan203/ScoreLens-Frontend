import axios from './axios';

export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: Record<string, unknown>;
}

// Lấy danh sách thông báo cho admin
export const getAdminNotifications = (adminId: string) =>
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
    }> } }>(`/notifications/admin/${encodeURIComponent(adminId)}`);

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = (notificationId: string) =>
    axios.put(`/notifications/${notificationId}/read`);

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = () =>
    axios.put('/notifications/read-all');

// Xóa thông báo
export const deleteNotification = (notificationId: string) =>
    axios.delete(`/notifications/${notificationId}`);

// Lấy số lượng thông báo chưa đọc
export const getUnreadNotificationCount = (adminId: string) =>
    axios.get<{ success: boolean; data: { unreadCount: number } }>(`/notifications/admin/${encodeURIComponent(adminId)}/unread-count`);
