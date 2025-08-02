// app/admin/parts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Table, Button, Space, message, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Part } from '@/stores/useQuizStore';
import config from '@/lib/config';

const { Title } = Typography;

export default function AdminPartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parts');
      if (response.ok) {
        const data = await response.json();
        setParts(Array.isArray(data) ? data : (data.parts || data.data || []));
      } else {
        message.error('Không thể tải danh sách Parts!');
      }
    } catch (error) {
      message.error('Lỗi khi tải Parts!');
      console.error('Load parts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Part Number',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: 120,
      render: (partNumber: number) => (
        <Tag color="blue" className="text-sm">
          Part {partNumber}
        </Tag>
      ),
    },
    {
      title: 'Tên Part',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skillType',
      key: 'skillType',
      width: 120,
      render: (skillType: string) => (
        <Tag color={skillType === 'Listening' ? 'green' : 'orange'}>
          {skillType}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_: any, record: Part) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa Part này?"
            description="Bạn có chắc chắn muốn xóa Part này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (part: Part) => {
    message.info('Tính năng sửa Part sẽ được phát triển trong tương lai!');
  };

  const handleDelete = (partId: number) => {
    message.info('Tính năng xóa Part sẽ được phát triển trong tương lai!');
  };

  const handleCreate = () => {
    message.info('Tính năng tạo Part mới sẽ được phát triển trong tương lai!');
  };

  return (
    <div className="page-content min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-teal-600">
          <div className="text-center text-white">
            <Title level={2} className="text-white mb-2">
              📝 Quản lý Parts TOEIC
            </Title>
            <p className="text-green-100">
              Quản lý các phần thi trong bộ đề TOEIC
            </p>
          </div>
        </Card>

        {/* Navigation */}
        <Card size="small" className="shadow-md">
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push('/admin')}
            >
              Quay lại Dashboard
            </Button>
            {isAuthenticated && user && (
              <span className="text-gray-600">
                👤 Admin: <strong>{user.name}</strong>
              </span>
            )}
          </Space>
        </Card>

        {/* Main Content */}
        <Card 
          title="📋 Danh sách Parts"
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo Part mới
            </Button>
          }
          className="shadow-lg"
        >
          <Table
            columns={columns}
            dataSource={parts}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} Parts`,
            }}
            className="overflow-x-auto"
          />
        </Card>

      </div>
    </div>
  );
}
