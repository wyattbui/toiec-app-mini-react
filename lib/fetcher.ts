// lib/fetcher.ts
import axios from 'axios';
import config from './config';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher;

// API functions for TOEIC parts and questions
export const apiClient = {
  // Lấy danh sách các parts
  getParts: async () => {
    const response = await fetch(`${config.BE_SERVER}/api/parts`);
    if (!response.ok) {
      throw new Error('Failed to fetch parts');
    }
    return response.json();
  },

  // Lấy danh sách câu hỏi theo part
  getQuestions: async (partId: string, limit: number = 10, offset: number = 0) => {
    const response = await fetch(`${config.BE_SERVER}/questions/part/${partId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return response.json();
  },

  // Lấy câu hỏi mock (giữ lại cho backward compatibility)
  getMockQuestions: async (part: string) => {
    const response = await fetch(`/api/mock-questions?part=${part}`);
    if (!response.ok) {
      throw new Error('Failed to fetch mock questions');
    }
    return response.json();
  },
};
