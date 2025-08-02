// components/AuthStatus.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, Typography, Space, Tag, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function AuthStatus() {
  const { user, isAuthenticated, loading, token } = useAuth();

  if (loading) {
    return (
      <Card className="mb-4">
        <Text>Đang kiểm tra trạng thái đăng nhập...</Text>
      </Card>
    );
  }

  return (
    <Card className="mb-4" title="Trạng thái đăng nhập">
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex items-center justify-between">
          <Text strong>Trạng thái:</Text>
          {isAuthenticated ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Đã đăng nhập
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Chưa đăng nhập
            </Tag>
          )}
        </div>

        {isAuthenticated && user && (
          <>
            <div className="flex items-center justify-between">
              <Text strong>Tên:</Text>
              <Text>{user.name}</Text>
            </div>
            
            <div className="flex items-center justify-between">
              <Text strong>Email:</Text>
              <Text>{user.email}</Text>
            </div>
            
            <div className="flex items-center justify-between">
              <Text strong>User ID:</Text>
              <Text code>{user.id}</Text>
            </div>

            <div className="flex items-center justify-between">
              <Text strong>Token:</Text>
              <Text code className="text-xs">
                {token ? `${token.substring(0, 20)}...` : 'N/A'}
              </Text>
            </div>
          </>
        )}

        {!isAuthenticated && (
          <div className="text-center">
            <Text type="secondary">
              Vui lòng đăng nhập để xem thông tin chi tiết
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
}
