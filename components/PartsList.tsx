// components/PartsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Select, Spin, Alert } from 'antd';
import type { ToiecPart } from '@/hooks/useToiecApi';

interface PartsListProps {
  onSelectPart?: (part: ToiecPart) => void;
  selectedPartId?: string;
}

// Mock data as fallback - 7 Parts TOEIC chuẩn
const MOCK_PARTS: ToiecPart[] = [
  { id: '1', name: 'Part 1: Photo Description', description: 'Mô tả hình ảnh', totalQuestions: 6 },
  { id: '2', name: 'Part 2: Question-Response', description: 'Hỏi - Đáp', totalQuestions: 25 },
  { id: '3', name: 'Part 3: Conversations', description: 'Đối thoại', totalQuestions: 39 },
  { id: '4', name: 'Part 4: Talks', description: 'Bài nói chuyện', totalQuestions: 30 },
  { id: '5', name: 'Part 5: Incomplete Sentences', description: 'Hoàn thành câu', totalQuestions: 30 },
  { id: '6', name: 'Part 6: Text Completion', description: 'Hoàn thành đoạn văn', totalQuestions: 16 },
  { id: '7', name: 'Part 7: Reading Comprehension', description: 'Đọc hiểu', totalQuestions: 54 }
];

export default function PartsList({ onSelectPart, selectedPartId }: PartsListProps) {
  const [parts, setParts] = useState<ToiecPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('PartsList: Fetching parts from /api/parts');
      
      const response = await fetch('/api/parts');
      
      if (!response.ok) {
        console.log('PartsList: API failed, using mock data');
        // Immediately use mock data if API fails
        setParts(MOCK_PARTS);
        setUsingMockData(true);
        setError(`API failed (${response.status}), using mock data`);
        return;
      }
      
      const data = await response.json();
      console.log('PartsList: API response:', data);
      
      const partsArray = Array.isArray(data) ? data : (data.parts || data.data || []);
      
      if (partsArray.length > 0) {
        setParts(partsArray);
        setUsingMockData(false);
        console.log('PartsList: Using API data:', partsArray);
      } else {
        console.log('PartsList: API returned empty, using mock data');
        setParts(MOCK_PARTS);
        setUsingMockData(true);
      }
    } catch (err) {
      console.error('PartsList: API error, using mock data:', err);
      // Always fallback to mock data
      setParts(MOCK_PARTS);
      setUsingMockData(true);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // Always ensure we have parts data, even if there's an error
  useEffect(() => {
    if (!loading && parts.length === 0) {
      console.log('PartsList: No parts loaded, forcing mock data');
      setParts(MOCK_PARTS);
      setUsingMockData(true);
    }
  }, [loading, parts.length]);

  console.log('PartsList: Current state:', { 
    partsCount: parts.length, 
    loading, 
    error, 
    usingMockData,
    selectedPartId 
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spin size="large" />
        <span className="ml-2">Đang tải parts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {usingMockData && (
        <Alert
          message="📝 Sử dụng dữ liệu mẫu"
          description="Đang sử dụng 7 Parts TOEIC chuẩn (mock data). API backend chưa sẵn sàng."
          type="info"
          showIcon
          className="mb-4"
        />
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn Part để quản lý:
        </label>
        <Select
          placeholder="Chọn Part"
          style={{ width: '100%' }}
          size="large"
          value={selectedPartId}
          onChange={(value) => {
            console.log('PartsList: Selected part:', value);
            const selectedPart = parts.find(part => part.id === value);
            if (selectedPart && onSelectPart) {
              onSelectPart(selectedPart);
            }
          }}
          options={parts.map(part => ({
            value: part.id,
            label: `${part.name} (${part.totalQuestions} câu)`,
            key: part.id
          }))}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>

      {parts.length === 0 && !loading && (
        <Alert
          message="⚠️ Không có dữ liệu Parts"
          description="Không thể tải danh sách Parts. Vui lòng kiểm tra kết nối API."
          type="error"
          showIcon
          action={
            <button
              onClick={fetchParts}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Thử lại
            </button>
          }
        />
      )}

      {error && !usingMockData && (
        <Alert
          message="🔌 Lỗi kết nối API"
          description={error}
          type="warning"
          showIcon
        />
      )}
    </div>
  );
}
