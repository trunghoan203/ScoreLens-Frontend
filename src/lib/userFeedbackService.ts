import axios from './axios';

class UserFeedbackService {
  async createFeedback(data: {
    createdBy: { userId: string; type: 'membership' | 'guest' };
    clubInfo: { clubId: string };
    tableInfo: { tableId: string };
    content: string;
  }) {
    const res = await axios.post('/membership/feedback', data);
    return res.data;
  }
}

export const userFeedbackService = new UserFeedbackService();
export default userFeedbackService; 