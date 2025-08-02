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
  Modal,
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
import config from '@/lib/config';

const { Title } = Typography;
const { Search } = Input;

interface QuestionManagerProps {
  parts: Part[];
}

export default function QuestionManager({ parts }: QuestionManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchText, setSearchText] = useState('');
  const { token } = useAuth();

  // Load questions based on selected part
  useEffect(() => {
    if (selectedPart) {
      loadQuestions(selectedPart);
    }
  }, [selectedPart]);

  const loadQuestions = async (partId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/questions?partId=${partId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(Array.isArray(data) ? data : (data.questions || data.data || []));
      } else {
        message.error('Không thể tải danh sách câu hỏi!');
      }
    } catch (error) {
      message.error('Lỗi khi tải câu hỏi!');
      console.error('Load questions error:', error);
    } finally {
      setLoading(false);
    }
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
        const newQuestion = await response.json();
        setQuestions(prev => [...prev, newQuestion]);
        setIsFormVisible(false);
        message.success('Tạo câu hỏi thành công!');
        
        // Reload questions to get updated data
        if (selectedPart) {
          loadQuestions(selectedPart);
        }
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
        const updatedQuestion = await response.json();
        setQuestions(prev => 
          prev.map(q => q.id === editingQuestion.id ? updatedQuestion : q)
        );
        setIsFormVisible(false);
        setEditingQuestion(null);
        message.success('Cập nhật câu hỏi thành công!');
        
        // Reload questions to get updated data
        if (selectedPart) {
          loadQuestions(selectedPart);
        }
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
    setIsFormVisible(true);
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingQuestion(null);
  };

  const handleSave = (questionData: any) => {
    if (editingQuestion) {
      return handleUpdateQuestion(questionData);
    } else {
      return handleCreateQuestion(questionData);
    }
  };

  // Filter questions based on search text
  const filteredQuestions = questions.filter(question =>
    question.questionText.toLowerCase().includes(searchText.toLowerCase()) ||
    question.questionType.toLowerCase().includes(searchText.toLowerCase()) ||
    question.difficulty.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
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
          {difficulty === 'easy' ? 'Dễ' :
           difficulty === 'medium' ? 'TB' : 'Khó'}
        </Tag>
      ),
    },
    {
      title: 'Số lựa chọn',
      key: 'optionsCount',
      width: 100,
      render: (_: any, record: Question) => record.options?.length || 0,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: Question) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: 'Chi tiết câu hỏi',
                width: 800,
                content: (
                  <div className="space-y-4">
                    <div>
                      <strong>Nội dung:</strong>
                      <p>{record.questionText}</p>
                    </div>
                    {record.options && (
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
            okText="Xóa"
            cancelText="Hủy"
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
      {/* Part Selection */}
      <Card title="📝 Quản lý câu hỏi" className="shadow-lg">
        <div className="mb-4">
          <Title level={5}>Chọn Part để quản lý:</Title>
          <Select
            placeholder="Chọn Part"
            style={{ width: 300 }}
            value={selectedPart}
            onChange={setSelectedPart}
            size="large"
          >
            {parts.map(part => (
              <Select.Option key={part.id} value={part.id}>
                Part {part.partNumber}: {part.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {selectedPart && (
          <div className="space-y-4">
            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-2">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  size="large"
                >
                  Tạo câu hỏi mới
                </Button>
                <Button 
                  onClick={() => loadQuestions(selectedPart)}
                  loading={loading}
                >
                  Tải lại
                </Button>
              </div>

              <Search
                placeholder="Tìm kiếm câu hỏi..."
                allowClear
                enterButton={<SearchOutlined />}
                style={{ width: 300 }}
                onSearch={setSearchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Questions Table */}
            <Table
              columns={columns}
              dataSource={filteredQuestions}
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
          </div>
        )}
      </Card>

      {/* Question Form Modal */}
      <Modal
        title={editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
        open={isFormVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        destroyOnClose
      >
        <QuestionForm
          question={editingQuestion}
          parts={parts}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
