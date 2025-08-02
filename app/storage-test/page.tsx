// app/storage-test/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

export default function StorageTestPage() {
  // Test custom hook
  const [testToken, setTestToken, removeTestToken, tokenLoaded] = useLocalStorage('test-token', '');
  const [testUser, setTestUser, removeTestUser, userLoaded] = useLocalStorage<any>('test-user', null);
  
  // Test auth context
  const { user, token, isAuthenticated, loading, isHydrated } = useAuth();
  
  const [directStorageData, setDirectStorageData] = useState<{
    token: string | null;
    user: string | null;
  }>({ token: null, user: null });

  const checkDirectStorage = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setDirectStorageData({ token, user });
      console.log('Direct storage check:', { token, user });
    }
  };

  useEffect(() => {
    checkDirectStorage();
  }, []);

  const testSaveToken = () => {
    const newToken = 'test-token-' + Date.now();
    const newUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    
    setTestToken(newToken);
    setTestUser(newUser);
    
    checkDirectStorage();
  };

  const clearStorage = () => {
    removeTestToken();
    removeTestUser();
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    checkDirectStorage();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pt-32">
      <Title level={2}>Storage Test</Title>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Auth Context State">
          <Space direction="vertical" className="w-full">
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
              <Text code>{token ? token.substring(0, 20) + '...' : 'null'}</Text>
            </div>
            <div>
              <Text strong>User: </Text>
              <Paragraph>
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card title="Direct LocalStorage">
          <Space direction="vertical" className="w-full">
            <div>
              <Text strong>Token: </Text>
              <Text code>{directStorageData.token ? directStorageData.token.substring(0, 20) + '...' : 'null'}</Text>
            </div>
            <div>
              <Text strong>User: </Text>
              <Paragraph>
                <pre>{directStorageData.user || 'null'}</pre>
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card title="Custom Hook Test">
          <Space direction="vertical" className="w-full">
            <div>
              <Text strong>Token Loaded: </Text>
              <Text code>{tokenLoaded.toString()}</Text>
            </div>
            <div>
              <Text strong>User Loaded: </Text>
              <Text code>{userLoaded.toString()}</Text>
            </div>
            <div>
              <Text strong>Test Token: </Text>
              <Text code>{testToken || 'null'}</Text>
            </div>
            <div>
              <Text strong>Test User: </Text>
              <Paragraph>
                <pre>{JSON.stringify(testUser, null, 2)}</pre>
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card title="Actions">
          <Space direction="vertical">
            <Button onClick={checkDirectStorage}>Refresh Direct Storage</Button>
            <Button onClick={testSaveToken} type="primary">Save Test Data</Button>
            <Button onClick={clearStorage} danger>Clear All Storage</Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
