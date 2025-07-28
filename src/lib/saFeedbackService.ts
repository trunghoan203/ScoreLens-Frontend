import axios from './axios';

const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('superAdminAccessToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
};

// Lấy tất cả feedback
export const getAllFeedback = () =>
    axios.get('/superAdmin/feedback', { headers: getAuthHeaders() });

// Lấy chi tiết feedback
export const getFeedbackDetail = (feedbackId: string) =>
    axios.get(`/superAdmin/feedback/${feedbackId}`, { headers: getAuthHeaders() });

// Cập nhật feedback
export const updateFeedback = (feedbackId: string, data: { note: string; status: string; needSupport: boolean }) =>
    axios.put(`/superAdmin/feedback/${feedbackId}`, data, { headers: getAuthHeaders() });
