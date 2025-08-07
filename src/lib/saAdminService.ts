import axios from './axios';

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
export const rejectAdmin = (adminId: string, rejectedReason: string) =>
    axios.post(`/superAdmin/admin/reject/${adminId}`, { rejectedReason });