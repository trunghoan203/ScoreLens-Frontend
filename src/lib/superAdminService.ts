import axios from './axios';

// Đăng nhập
export const loginSuperAdmin = (email: string) =>
    axios.post('/superAdmin/login', { email });

// Xác thực đăng nhập
export const verifySuperAdminLogin = (email: string, activationCode: string) =>
    axios.post('/superAdmin/login/verify', { email, activationCode });

// Đăng xuất
export const logoutSuperAdmin = () =>
    axios.post('/superAdmin/logout');

// Gửi lại mã xác thực
export const resendLoginCode = (email: string) =>
    axios.post('/superAdmin/resend-login-code', { email });

// Lấy danh sách admin
export const getAdminList = (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    axios.get('/superAdmin/admin/list', { params });

// Lấy chi tiết admin
export const getAdminDetail = (adminId: string) =>
    axios.get(`/superAdmin/admin/${adminId}`);

// Duyệt admin
export const approveAdmin = (adminId: string) =>
    axios.post(`/superAdmin/admin/approve/${adminId}`);

// Từ chối admin
export const rejectAdmin = (adminId: string) =>
    axios.post(`/superAdmin/admin/reject/${adminId}`);

// Lấy tất cả feedback
export const getAllFeedback = () =>
    axios.get('/superAdmin/feedback');

// Lấy chi tiết feedback
export const getFeedbackDetail = (feedbackId: string) =>
    axios.post(`/superAdmin/feedback/${feedbackId}`);

// Cập nhật feedback
export const updateFeedback = (feedbackId: string, data: { note: string; status: string; needSupport: boolean }) =>
    axios.put(`/superAdmin/feedback/${feedbackId}`, data);