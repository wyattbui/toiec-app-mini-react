// app/auth-debug/page.tsx
'use client';

import { Card, Typography, Button, Space, Divider } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

const { Title, Text, Paragraph } = Typography;

export default function AuthDebugPage() {
  const { user, token, isAuthenticated, loading, isHydrated, logout } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<{
    token: string | null;
    user: string | null;
  }>({ token: null, user: null });

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    if (typeof window !== 'undefined') {
      setLocalStorageData({
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
      });
    }
  }, []);

  const handleClearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLocalStorageData({ token: null, user: null });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-32">
      <div className="max-w-4xl mx-auto space-y-6">
        <Title>Auth Debug Page</Title>
        
        <Card title="Auth Context State">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text strong>Loading: </Text>
              <Text code>{loading.toString()}</Text>
            </div>
            <div>
              <Text strong>Is Hydrated: </Text>
              <Text code>{isHydrated.toString()}</Text>
            </div>
            <div>
              <Text strong>Is Authenticated: </Text>
              <Text code>{isAuthenticated.toString()}</Text>
            </div>
            <div>
              <Text strong>Token: </Text>
              <Text code>{token ? `${token.substring(0, 20)}...` : 'null'}</Text>
            </div>
            <div>
              <Text strong>User: </Text>
              <Paragraph>
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card title="LocalStorage Data">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text strong>Stored Token: </Text>
              <Text code>{localStorageData.token ? `${localStorageData.token.substring(0, 20)}...` : 'null'}</Text>
            </div>
            <div>
              <Text strong>Stored User: </Text>
              <Paragraph>
                <pre>{localStorageData.user || 'null'}</pre>
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card title="Actions">
          <Space wrap>
            <Button onClick={handleRefresh}>
              Refresh Page (F5)
            </Button>
            <Button onClick={handleClearStorage} danger>
              Clear LocalStorage
            </Button>
            {isAuthenticated && (
              <Button onClick={logout} type="primary" danger>
                Logout
              </Button>
            )}
          </Space>
        </Card>

        <Card title="Instructions">
          <Space direction="vertical">
            <Text>1. Đăng nhập từ trang login</Text>
            <Text>2. Quay lại trang này để xem token và user được lưu</Text>
            <Text>3. Bấm "Refresh Page (F5)" để test việc khôi phục từ localStorage</Text>
            <Text>4. Kiểm tra console log để xem quá trình khôi phục</Text>
          </Space>
        </Card>
      </div>
    </div>
  );
}
