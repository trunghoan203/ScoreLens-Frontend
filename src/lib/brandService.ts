import axios from './axios';

// Tạo brand mới
export const createBrand = (data: {
    brandName: string;
    numberPhone: string;
    website: string;
    logo_url: string;
    citizenCode: string;
}) => axios.post('/admin/brands', data);

// Cập nhật brand
export const updateBrand = (brandId: string, data: {
    brandName: string;
    numberPhone: string;
    website: string;
    logo_url: string;
    citizenCode: string;
}) => axios.put(`/admin/brands/${brandId}`, data);

// Lấy danh sách brand
export const getBrands = () => axios.get('/admin/brands');

// Lấy chi tiết brand
export const getBrandDetail = (brandId: string) => axios.get(`/admin/brands/${brandId}`);