// lib/hooks/useQuestions.ts
'use client';

import { useState, useEffect } from 'react';
import type { ToiecQuestion, QuestionsResponse } from '@/lib/types/api';

interface UseQuestionsReturn {
  questions: ToiecQuestion[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useQuestions(
  partId: number | null,
  limit: number = 10
): UseQuestionsReturn {
  const [questions, setQuestions] = useState<ToiecQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!partId) {
      setQuestions([]);
      setTotal(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        partId: partId.toString(),
        limit: limit.toString()
      });
      
      const response = await fetch(`/api/questions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ToiecQuestion[] = await response.json();
      setQuestions(data || []);
      setTotal(data?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [partId, limit]);

  return {
    questions,
    total,
    loading,
    error,
    refetch: fetchQuestions
  };
}
