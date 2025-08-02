// hooks/useToiecApi.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/fetcher';

export interface ToiecPart {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
}

export interface ToiecQuestion {
  id: string;
  partId: string;
  type: string;
  content: string;
  options?: string[];
  audioUrl?: string;
  imageUrl?: string;
  correctAnswer: string;
}

export interface QuestionsResponse {
  questions: ToiecQuestion[];
  total: number;
  limit: number;
  offset: number;
}

// Hook để lấy danh sách parts
export const useParts = () => {
  const [parts, setParts] = useState<ToiecPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/parts');
      if (!response.ok) {
        throw new Error('Failed to fetch parts');
      }
      
      const data = await response.json();
      setParts(Array.isArray(data) ? data : (data.parts || data.data || []));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  return { parts, loading, error, refetch: fetchParts };
};

// Hook để lấy danh sách câu hỏi
export const useQuestions = (partId: string | null, limit: number = 10, offset: number = 0) => {
  const [questions, setQuestions] = useState<ToiecQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!partId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        partId,
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      const response = await fetch(`http://localhost:3333/questions/part/${partId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      
      // Xử lý cấu trúc dữ liệu từ backend
      if (Array.isArray(data)) {
        setQuestions(data);
        setTotal(data.length);
      } else if (data.questions) {
        setQuestions(data.questions);
        setTotal(data.total || data.questions.length);
      } else {
        setQuestions([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [partId, limit, offset]);

  return { 
    questions, 
    total, 
    loading, 
    error, 
    refetch: fetchQuestions 
  };
};

// Hook để lấy một câu hỏi cụ thể
export const useQuestion = (questionId: string | null) => {
  const [question, setQuestion] = useState<ToiecQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = async () => {
    if (!questionId) return;
    
    try {
      setLoading(true);
      setError(null);
      // Có thể cần thêm API endpoint cho single question
      // const data = await apiClient.getQuestion(questionId);
      // setQuestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  return { question, loading, error, refetch: fetchQuestion };
};
