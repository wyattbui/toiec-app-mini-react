// components/AuthDebug.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { useAuth } from '@/contexts/AuthContext';

const { Text } = Typography;

export default function AuthDebug() {
  const { user, token, isAuthenticated, loading, isHydrated } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<{
    token: string | null;
    user: string | null;
  }>({ token: null, user: null });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalStorageData({
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
      });
    }
  }, [user, token]);

  return (
    <Card title="🔍 Auth Debug Info" size="small" className="mb-4">
      <Space direction="vertical" size="small" className="w-full">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <Text strong>Context State:</Text>
            <ul className="ml-4">
              <li>Loading: {loading ? '🔄' : '✅'}</li>
              <li>Hydrated: {isHydrated ? '✅' : '⏳'}</li>
              <li>Authenticated: {isAuthenticated ? '✅' : '❌'}</li>
              <li>Has User: {user ? '✅' : '❌'}</li>
              <li>Has Token: {token ? '✅' : '❌'}</li>
            </ul>
          </div>
          
          <div>
            <Text strong>LocalStorage:</Text>
            <ul className="ml-4">
              <li>Token: {localStorageData.token ? '✅' : '❌'}</li>
              <li>User: {localStorageData.user ? '✅' : '❌'}</li>
            </ul>
          </div>
        </div>

        {user && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
            <Text strong>User: </Text>
            {user.name} ({user.email})
          </div>
        )}

        {token && (
          <div className="p-2 bg-gray-50 rounded text-xs">
            <Text strong>Token: </Text>
            {token.substring(0, 30)}...
          </div>
        )}
      </Space>
    </Card>
  );
}
