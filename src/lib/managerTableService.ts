import axios from './axios';

class ManagerTableService {
  async getAllTables() {
    const res = await axios.get('/manager/table');
    return res.data;
  }

  async createTable(data: { name: string; category: string; status?: string }) {
    const res = await axios.post('/manager/table', data);
    return res.data;
  }

  async updateTable(id: string, data: { name: string; category: string; status?: string }) {
    const res = await axios.put(`/manager/table/${id}`, data);
    return res.data;
  }

  async deleteTable(id: string) {
    const res = await axios.delete(`/manager/table/${id}`);
    return res.data;
  }
}

export const managerTableService = new ManagerTableService();
export default managerTableService; 