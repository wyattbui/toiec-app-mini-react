// components/admin/QuestionManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Space, 
  message, 
  Popconfirm, 
  Tag, 
  Typography,
  Input,
  Select
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  EyeOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import type { Question, Part } from '@/stores/useQuizStore';
import QuestionForm from './QuestionForm';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Text } = Typography;
const { Search } = Input;

interface QuestionManagerProps {
  parts: Part[];
}

export default function QuestionManager({ parts }: QuestionManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]); // Store all questions
  const [loading, setLoading] = useState(false);
  const [selectedPart, setSelectedPart] = useState<number | null>(null); // For filtering
  const [isFormVisible, setIsFormVisible] = useState(true); // Always show form by default
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchText, setSearchText] = useState('');
  const { token } = useAuth();

  // Load all questions on mount
  useEffect(() => {
    loadAllQuestions();
  }, []);

  // Filter questions when selectedPart or searchText changes
  useEffect(() => {
    filterQuestions();
  }, [selectedPart, searchText, allQuestions]);

  const loadAllQuestions = async () => {
    try {
      setLoading(true);
      // Load questions from all parts
      const allPromises = parts.map(part => 
        fetch(`/api/admin/questions?partId=${part.id}`)
          .then(res => res.ok ? res.json() : [])
          .catch(() => [])
      );
      
      const results = await Promise.all(allPromises);
      const allQuestionsData = results.flat();
      
      setAllQuestions(allQuestionsData);
    } catch (error) {
      message.error('Lỗi khi tải danh sách câu hỏi!');
      console.error('Load all questions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...allQuestions];
    
    // Filter by part
    if (selectedPart) {
      filtered = filtered.filter(q => q.partId === selectedPart);
    }
    
    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(q => 
        q.questionText.toLowerCase().includes(searchLower) ||
        q.explanation?.toLowerCase().includes(searchLower) ||
        q.difficulty.toLowerCase().includes(searchLower)
      );
    }
    
    setQuestions(filtered);
  };

  const handleCreateQuestion = async (questionData: any) => {
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        message.success('Tạo câu hỏi thành công!');
        // Reload all questions to get updated data
        await loadAllQuestions();
        // Reset form but keep it visible
        setEditingQuestion(null);
      } else {
        const error = await response.json();
        message.error(error.message || 'Không thể tạo câu hỏi!');
      }
    } catch (error) {
      message.error('Lỗi khi tạo câu hỏi!');
      console.error('Create question error:', error);
    }
  };

  const handleUpdateQuestion = async (questionData: any) => {
    if (!editingQuestion) return;

    try {
      const response = await fetch(`/api/admin/questions/${editingQuestion.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        setEditingQuestion(null);
        message.success('Cập nhật câu hỏi thành công!');
        
        // Reload all questions to get updated data
        await loadAllQuestions();
      } else {
        const error = await response.json();
        message.error(error.message || 'Không thể cập nhật câu hỏi!');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật câu hỏi!');
      console.error('Update question error:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        message.success('Xóa câu hỏi thành công!');
        await loadAllQuestions();
      } else {
        const error = await response.json().catch(() => ({}));
        message.error(error.message || 'Không thể xóa câu hỏi!');
      }
    } catch (error) {
      message.error('Lỗi khi xóa câu hỏi!');
      console.error('Delete question error:', error);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Part',
      dataIndex: 'partId',
      key: 'partId',
      width: 100,
      render: (partId: number) => {
        const part = parts.find(p => p.id === partId);
        return <Tag color="blue">Part {part?.partNumber}</Tag>;
      },
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
      render: (text: string) => (
        <div className="max-w-md">
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 120,
      render: (type: string) => (
        <Tag color={
          type === 'listening' ? 'blue' :
          type === 'reading' ? 'green' :
          type === 'conversation' ? 'orange' : 'default'
        }>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty: string) => (
        <Tag color={
          difficulty === 'easy' ? 'green' :
          difficulty === 'medium' ? 'orange' : 'red'
        }>
          {difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'TB' : 'Khó'}
        </Tag>
      ),
    },
    {
      title: 'Số lựa chọn',
      key: 'optionCount',
      width: 100,
      render: (record: Question) => record.options?.length || 0,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (record: Question) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              // Show question details
              message.info({
                content: (
                  <div className="space-y-2">
                    <div><strong>Câu hỏi:</strong> {record.questionText}</div>
                    {record.options && record.options.length > 0 && (
                      <div>
                        <strong>Lựa chọn:</strong>
                        <ul className="mt-2">
                          {record.options.map((opt, idx) => (
                            <li key={idx} className={opt.isCorrect ? 'text-green-600 font-medium' : ''}>
                              {opt.optionLetter}. {opt.optionText} 
                              {opt.isCorrect && ' ✓'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {record.explanation && (
                      <div>
                        <strong>Giải thích:</strong>
                        <p>{record.explanation}</p>
                      </div>
                    )}
                  </div>
                ),
                duration: 8,
              });
            }}
          />
          <Button 
            type="text" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa câu hỏi"
            description="Bạn có chắc chắn muốn xóa câu hỏi này?"
            onConfirm={() => handleDeleteQuestion(record.id)}
          >
            <Button 
              type="text" 
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Always show form first */}
      <QuestionForm
        question={editingQuestion}
        parts={parts}
        onSave={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
        onCancel={() => {
          setEditingQuestion(null);
          // Don't hide form, just clear editing state
        }}
        loading={loading}
      />

      {/* Questions Management */}
      <Card title="📋 Danh sách câu hỏi" className="shadow-lg">
        {/* Filters */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Text strong>Lọc theo Part:</Text>
              <Select
                placeholder="Tất cả Parts"
                style={{ width: '100%', maxWidth: 300 }}
                value={selectedPart}
                onChange={setSelectedPart}
                allowClear
                size="large"
              >
                {parts.map(part => (
                  <Select.Option key={part.id} value={part.id}>
                    Part {part.partNumber}: {part.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <Text strong>Tìm kiếm:</Text>
              <Search
                placeholder="Tìm kiếm câu hỏi..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
                size="large"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Text type="secondary">
              Hiển thị {questions.length} / {allQuestions.length} câu hỏi
              {selectedPart && ` (Part ${parts.find(p => p.id === selectedPart)?.partNumber})`}
            </Text>
            <Button 
              onClick={() => loadAllQuestions()}
              loading={loading}
              icon={<PlusOutlined />}
            >
              Tải lại
            </Button>
          </div>
        </div>

        {/* Questions Table */}
        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} câu hỏi`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}
