import axios from './axios';

export const getAdminList = (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    axios.get('/superAdmin/admin/list', { params });

export const getAdminDetail = (adminId: string) =>
    axios.get(`/superAdmin/admin/${adminId}`);

export const approveAdmin = (adminId: string) =>
    axios.post(`/superAdmin/admin/approve/${adminId}`);

export const rejectAdmin = (adminId: string, rejectedReason: string) =>
    axios.post(`/superAdmin/admin/reject/${adminId}`, { rejectedReason });