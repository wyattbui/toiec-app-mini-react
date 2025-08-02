// app/admin/questions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Alert, Spin } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import QuestionManager from '@/components/admin/QuestionManager';
import type { Part } from '@/stores/useQuizStore';

const { Title } = Typography;

export default function AdminQuestionsPage() {
  // Mock data cho 7 parts TOEIC cố định
  const mockParts: Part[] = [
    { id: 1, partNumber: 1, name: 'Part 1: Photographs', description: 'Mô tả hình ảnh', skillType: 'LISTENING' },
    { id: 2, partNumber: 2, name: 'Part 2: Question-Response', description: 'Hỏi đáp', skillType: 'LISTENING' },
    { id: 3, partNumber: 3, name: 'Part 3: Conversations', description: 'Hội thoại', skillType: 'LISTENING' },
    { id: 4, partNumber: 4, name: 'Part 4: Short Talks', description: 'Bài nói ngắn', skillType: 'LISTENING' },
    { id: 5, partNumber: 5, name: 'Part 5: Incomplete Sentences', description: 'Hoàn thành câu', skillType: 'READING' },
    { id: 6, partNumber: 6, name: 'Part 6: Text Completion', description: 'Hoàn thành đoạn văn', skillType: 'READING' },
    { id: 7, partNumber: 7, name: 'Part 7: Reading Comprehension', description: 'Đọc hiểu', skillType: 'READING' }
  ];

  const [parts, setParts] = useState<Part[]>(mockParts); // Khởi tạo với mock data
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      setLoading(true);
      setUsingMockData(false);
      // Sử dụng API proxy route thay vì gọi trực tiếp backend
      const response = await fetch('/api/parts');
      if (response.ok) {
        const data = await response.json();
        const partsData = Array.isArray(data) ? data : (data.parts || data.data || []);
        if (partsData.length > 0) {
          setParts(partsData);
        } else {
          console.warn('API returned empty parts, using mock data');
          setParts(mockParts);
          setUsingMockData(true);
        }
      } else {
        console.error('Failed to load parts from API proxy, using mock data');
        setParts(mockParts);
        setUsingMockData(true);
      }
    } catch (error) {
      console.error('Load parts error:', error);
      // Fallback to mock data nếu có lỗi
      setParts(mockParts);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page-content min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-blue-600">
          <div className="text-center text-white">
            <Title level={2} className="text-white mb-2">
              🎯 Quản lý câu hỏi TOEIC
            </Title>
            <p className="text-green-100">
              Tạo, chỉnh sửa và quản lý câu hỏi cho các phần thi TOEIC
            </p>
          </div>
        </Card>

        {/* User Info */}
        {isAuthenticated && user && (
          <Alert
            message={`👋 Xin chào Admin: ${user.name}`}
            description="Bạn đang truy cập trang quản lý câu hỏi. Vui lòng thận trọng khi thực hiện các thao tác."
            type="info"
            showIcon
            className="shadow-md"
          />
        )}

        {/* Mock Data Warning */}
        {usingMockData && (
          <Alert
            message="⚠️ Đang sử dụng dữ liệu mặc định"
            description="Không thể kết nối tới API backend. Đang hiển thị 7 parts TOEIC cố định để đảm bảo dropdown hoạt động."
            type="warning"
            showIcon
            className="shadow-md"
          />
        )}

        {/* Main Content */}
        <QuestionManager parts={parts} />

      </div>
    </div>
  );
}
