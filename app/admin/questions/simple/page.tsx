// app/admin/questions/simple/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Alert, Spin, Select, Button, Space, Table } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import type { Part, Question } from '@/stores/useQuizStore';

const { Title } = Typography;
const { Option } = Select;

export default function SimpleAdminQuestionsPage() {
  // Mock data cố định
  const parts: Part[] = [
    { id: 1, partNumber: 1, name: 'Part 1: Photographs', description: 'Mô tả hình ảnh', skillType: 'LISTENING' },
    { id: 2, partNumber: 2, name: 'Part 2: Question-Response', description: 'Hỏi đáp', skillType: 'LISTENING' },
    { id: 3, partNumber: 3, name: 'Part 3: Conversations', description: 'Hội thoại', skillType: 'LISTENING' },
    { id: 4, partNumber: 4, name: 'Part 4: Short Talks', description: 'Bài nói ngắn', skillType: 'LISTENING' },
    { id: 5, partNumber: 5, name: 'Part 5: Incomplete Sentences', description: 'Hoàn thành câu', skillType: 'READING' },
    { id: 6, partNumber: 6, name: 'Part 6: Text Completion', description: 'Hoàn thành đoạn văn', skillType: 'READING' },
    { id: 7, partNumber: 7, name: 'Part 7: Reading Comprehension', description: 'Đọc hiểu', skillType: 'READING' }
  ];

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const loadQuestions = async (partId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/questions?partId=${partId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to load questions');
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
    },
    {
      title: 'Loại',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 100,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="shadow-lg bg-gradient-to-r from-green-500 to-blue-600">
          <div className="text-center text-white">
            <Title level={2} className="text-white mb-2">
              🎯 Quản lý câu hỏi TOEIC (Simple)
            </Title>
            <p className="text-green-100">
              Phiên bản đơn giản để test UI
            </p>
          </div>
        </Card>

        {/* Auth Status */}
        {isAuthenticated && user && (
          <Alert
            message={`👋 Xin chào: ${user.name}`}
            type="info"
            showIcon
          />
        )}

        {/* Part Selection */}
        <Card title="📂 Chọn Part" className="shadow-md">
          <Space>
            <Select
              placeholder="Chọn part để quản lý"
              style={{ width: 300 }}
              value={selectedPart}
              onChange={(value) => {
                setSelectedPart(value);
                if (value) {
                  loadQuestions(value);
                }
              }}
            >
              {parts.map(part => (
                <Option key={part.id} value={part.id}>
                  {part.name}
                </Option>
              ))}
            </Select>
            <Button type="primary" disabled={!selectedPart}>
              Thêm câu hỏi mới
            </Button>
          </Space>
        </Card>

        {/* Questions Table */}
        {selectedPart && (
          <Card title={`📝 Câu hỏi ${parts.find(p => p.id === selectedPart)?.name}`} className="shadow-md">
            <Table
              columns={columns}
              dataSource={questions}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: 'Không có câu hỏi nào' }}
            />
          </Card>
        )}

      </div>
    </div>
  );
}
