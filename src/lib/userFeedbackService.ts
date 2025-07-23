import axios from './axios';

class UserFeedbackService {
  async createFeedback(data: {
    clubId: string;
    tableId: string;
    content: string;
    createdBy: { type: 'guest' | 'membership'; userId?: string };
  }) {
    const res = await axios.post('/membership/feedback', data);
    return res.data;
  }
}

export const userFeedbackService = new UserFeedbackService();
export default userFeedbackService; 