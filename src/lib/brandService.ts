import axios from './axios';


export interface Brand {
  _id: string;
  brandId: string;
  brandName: string;
  phoneNumber: string;
  website?: string;
  logo_url?: string;
  citizenCode: string;
  createdAt: string;
  updatedAt: string;
}

class BrandService {
  async getBrandById(brandId: string): Promise<Brand> {
    const res = await axios.get(`/admin/brands/${brandId}`);
    const data = res.data as Record<string, unknown>;
    if (data && typeof data === 'object' && 'brand' in data) {
      return (data.brand as unknown) as Brand;
    }
    return data as unknown as Brand;
  }
}

export const brandService = new BrandService();
export default brandService; 

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

