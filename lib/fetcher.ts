// lib/fetcher.ts
import axios from 'axios';
import config from './config';
import type { 
  ToiecPart, 
  ToiecQuestion, 
  QuestionsResponse, 
  TestSetGenerateRequest, 
  TestSetResponse,
  TestSetSubmitRequest,
  TestSetSubmitResponse
} from './types/api';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher;

// API functions for TOEIC parts and questions
export const apiClient = {
  // Lấy danh sách các parts - sử dụng proxy route
  getParts: async (): Promise<ToiecPart[]> => {
    const response = await fetch('/api/parts');
    if (!response.ok) {
      throw new Error('Failed to fetch parts');
    }
    return response.json();
  },

  // Lấy danh sách câu hỏi theo part - sử dụng proxy route
  getQuestions: async (partId: number, limit: number = 10): Promise<ToiecQuestion[]> => {
    const params = new URLSearchParams({
      partId: partId.toString(),
      limit: limit.toString()
    });
    
    const response = await fetch(`/api/questions?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return response.json();
  },

  // Generate test set
  generateTestSet: async (request: TestSetGenerateRequest, token: string): Promise<TestSetResponse> => {
    const response = await fetch('/api/test-sets/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate test set');
    }
    return response.json();
  },

  // Get my test sets
  getMyTestSets: async (token: string): Promise<TestSetResponse[]> => {
    const response = await fetch('/api/test-sets/my', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch test sets');
    }
    return response.json();
  },

  // Get test set by ID
  getTestSet: async (id: number, token: string): Promise<TestSetResponse> => {
    const response = await fetch(`/api/test-sets/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch test set');
    }
    return response.json();
  },

  // Start test set
  startTestSet: async (id: number, token: string): Promise<TestSetResponse> => {
    const response = await fetch(`/api/test-sets/${id}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to start test set');
    }
    return response.json();
  },

  // Submit test set
  submitTestSet: async (request: TestSetSubmitRequest, token: string): Promise<TestSetSubmitResponse> => {
    const response = await fetch('/api/test-sets/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit test set');
    }
    return response.json();
  },

  // Delete test set
  deleteTestSet: async (id: number, token: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/test-sets/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete test set');
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
