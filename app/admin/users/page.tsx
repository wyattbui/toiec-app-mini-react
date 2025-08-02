// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Input, Spin } from 'antd';
import { 
  UserOutlined, 
  SearchOutlined, 
  ArrowLeftOutlined,
  UsergroupAddOutlined,
  CrownOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const { Title } = Typography;
const { Search } = Input;

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Mock data for now
      // In real implementation, you would fetch from your API
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: 1,
            name: 'Admin User',
            email: 'admin@toeic.com',
            role: 'admin',
            createdAt: '2024-01-15T09:00:00Z',
            lastLoginAt: '2024-08-03T10:30:00Z',
            isActive: true
          },
          {
            id: 2,
            name: 'Nguyễn Văn A',
            email: 'nguyen.van.a@email.com',
            role: 'user',
            createdAt: '2024-02-20T14:20:00Z',
            lastLoginAt: '2024-08-02T16:45:00Z',
            isActive: true
          },
          {
            id: 3,
            name: 'Trần Thị B',
            email: 'tran.thi.b@email.com',
            role: 'user',
            createdAt: '2024-03-10T11:15:00Z',
            lastLoginAt: '2024-07-30T08:20:00Z',
            isActive: true
          },
          {
            id: 4,
            name: 'Lê Văn C',
            email: 'le.van.c@email.com',
            role: 'user',
            createdAt: '2024-04-05T16:45:00Z',
            isActive: false
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Load users error:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: User) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <span>{name}</span>
          {record.role === 'admin' && (
            <CrownOutlined className="text-yellow-500" title="Admin" />
          )}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role === 'admin' ? 'Admin' : 'User'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (createdAt: string) => (
        new Date(createdAt).toLocaleDateString('vi-VN')
      ),
    },
    {
      title: 'Lần cuối đăng nhập',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      width: 150,
      render: (lastLoginAt?: string) => (
        lastLoginAt ? (
          <span className="text-green-600">
            {new Date(lastLoginAt).toLocaleDateString('vi-VN')}
          </span>
        ) : (
          <span className="text-gray-400">Chưa đăng nhập</span>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="primary"
            size="small"
            disabled
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

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
        <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-red-600">
          <div className="text-center text-white">
            <Title level={2} className="text-white mb-2">
              👥 Quản lý người dùng
            </Title>
            <p className="text-orange-100">
              Quản lý tài khoản và quyền hạn người dùng
            </p>
          </div>
        </Card>

        {/* Navigation */}
        <Card size="small" className="shadow-md">
          <div className="flex justify-between items-center">
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
          </div>
        </Card>

        {/* Search and Actions */}
        <Card className="shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Search
              placeholder="Tìm kiếm theo tên hoặc email..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-96"
            />
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              size="large"
              disabled
            >
              Thêm người dùng
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card 
          title={
            <div className="flex items-center gap-2">
              <UsergroupAddOutlined />
              <span>Danh sách người dùng ({filteredUsers.length})</span>
            </div>
          }
          className="shadow-lg"
        >
          <Table
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} người dùng`,
            }}
            className="overflow-x-auto"
          />
        </Card>

        {/* Note */}
        <Card size="small" className="shadow-md bg-yellow-50">
          <div className="text-center text-yellow-700">
            <strong>📝 Lưu ý:</strong> Các tính năng quản lý chi tiết người dùng sẽ được phát triển trong tương lai.
          </div>
        </Card>

      </div>
    </div>
  );
}
