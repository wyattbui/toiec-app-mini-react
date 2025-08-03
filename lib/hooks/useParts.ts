// lib/hooks/useParts.ts
'use client';

import { useState, useEffect } from 'react';
import type { ToiecPart } from '@/lib/types/api';

interface UsePartsReturn {
  parts: ToiecPart[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useParts(): UsePartsReturn {
  const [parts, setParts] = useState<ToiecPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/parts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setParts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch parts');
      console.error('Error fetching parts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  return {
    parts,
    loading,
    error,
    refetch: fetchParts
  };
}
