import axios from './axios';

// Tạo 1 club
export const createClub = (data: {
    clubName: string;
    address: string;
    phoneNumber: string;
    tableNumber: number;
    status?: string;
}) => axios.post('/admin/clubs', data);

// Tạo nhiều clubs (truyền mảng)
export const createClubs = (clubs: Array<{
    clubName: string;
    address: string;
    phoneNumber: string;
    tableNumber: number;
    status?: string;
}>) => axios.post('/admin/clubs', clubs);

// Lấy tất cả clubs
export const getClubs = () => axios.get('/admin/clubs');

// Lấy chi tiết club (nếu API là GET /admin/clubs/<clubId>)
export const getClubDetail = (clubId: string) => axios.get(`/admin/clubs/${clubId}`);

// Cập nhật club
export const updateClub = (clubId: string, data: {
    clubName: string;
    address: string;
    phoneNumber: string;
    tableNumber: number;
    status: string;
}) => axios.put(`/admin/clubs/${clubId}`, data);

// Xóa club
export const deleteClub = (clubId: string) => axios.delete(`/admin/clubs/${clubId}`);