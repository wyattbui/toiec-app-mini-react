// app/admin/test-api/page.tsx
'use client';

import { useState } from 'react';
import { Card, Button, Space, message, Typography, Alert } from 'antd';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Paragraph, Text } = Typography;

export default function AdminTestAPIPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { token, isAuthenticated, user } = useAuth();

  const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      setResults(prev => [...prev, {
        endpoint,
        method,
        status: response.status,
        ok: response.ok,
        data,
        timestamp: new Date().toLocaleTimeString()
      }]);

      if (response.ok) {
        message.success(`API ${endpoint} thành công!`);
      } else {
        message.error(`API ${endpoint} thất bại: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setResults(prev => [...prev, {
        endpoint,
        method,
        status: 'ERROR',
        ok: false,
        data: { error: errorMsg },
        timestamp: new Date().toLocaleTimeString()
      }]);
      message.error(`Lỗi: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-blue-600">
          <div className="text-center text-white">
            <Title level={2} className="text-white mb-2">
              🧪 Test API Endpoints
            </Title>
            <p className="text-purple-100">
              Kiểm tra các API endpoints của hệ thống admin
            </p>
          </div>
        </Card>

        {/* Auth Status */}
        {isAuthenticated && user && token ? (
          <Alert
            message={`✅ Đã đăng nhập: ${user.name} (${user.email})`}
            description={`Token: ${token.substring(0, 50)}...`}
            type="success"
            showIcon
          />
        ) : (
          <Alert
            message="❌ Chưa đăng nhập"
            description="Bạn cần đăng nhập để test các API cần authentication"
            type="warning"
            showIcon
          />
        )}

        {/* Test Buttons */}
        <Card title="🔧 API Test Controls" className="shadow-md">
          <Space wrap>
            <Button 
              type="primary" 
              onClick={() => testAPI('/api/parts')}
              loading={loading}
            >
              Test GET /api/parts
            </Button>
            
            <Button 
              onClick={() => testAPI('/api/admin/questions?partId=1')}
              loading={loading}
            >
              Test GET Questions (Part 1)
            </Button>

            <Button 
              onClick={() => testAPI('/api/admin/questions', 'POST', {
                partId: 1,
                questionText: 'Test question from API test page',
                questionType: 'single',
                difficulty: 'easy',
                explanation: 'This is a test question',
                options: [
                  { optionLetter: 'A', optionText: 'Option A', isCorrect: true },
                  { optionLetter: 'B', optionText: 'Option B', isCorrect: false }
                ]
              })}
              loading={loading}
              type="dashed"
            >
              Test CREATE Question
            </Button>

            <Button 
              danger
              onClick={clearResults}
            >
              Clear Results
            </Button>
          </Space>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card title="📊 API Test Results" className="shadow-md">
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card 
                  key={index} 
                  size="small" 
                  className={`border-l-4 ${result.ok ? 'border-l-green-500' : 'border-l-red-500'}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Text strong>
                        {result.method} {result.endpoint}
                      </Text>
                      <Space>
                        <Text type="secondary" code>
                          {result.timestamp}
                        </Text>
                        <Text 
                          className={result.ok ? 'text-green-600' : 'text-red-600'}
                          strong
                        >
                          {result.status}
                        </Text>
                      </Space>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <Text code>
                        <pre>{JSON.stringify(result.data, null, 2)}</pre>
                      </Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
