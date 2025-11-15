import axios from './axios';

const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('superAdminAccessToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
};

export const getAllFeedback = () =>
    axios.get('/superAdmin/feedback', { headers: getAuthHeaders() });

export const getFeedbackDetail = (feedbackId: string) =>
    axios.get(`/superAdmin/feedback/${feedbackId}`, { headers: getAuthHeaders() });

export const updateFeedback = (feedbackId: string, data: { note: string; status: string }) =>
    axios.put(`/superAdmin/feedback/${feedbackId}`, data, { headers: getAuthHeaders() });
