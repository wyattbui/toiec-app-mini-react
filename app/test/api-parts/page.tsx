// app/test/api-parts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Button, Alert, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function TestApiPartsPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string>('');

  const testApiParts = async () => {
    try {
      setLoading(true);
      setError(null);
      setParts([]);
      setRawResponse('');

      console.log('Testing /api/parts...');
      
      const response = await fetch('/api/parts');
      const responseText = await response.text();
      setRawResponse(responseText);
      
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      console.log('Parsed data:', data);
      
      const partsArray = Array.isArray(data) ? data : (data.parts || data.data || []);
      setParts(partsArray);
      
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApiParts();
  }, []);

  return (
    <div className="page-content min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Card className="shadow-lg">
          <Title level={2}>🔧 Test API Parts</Title>
          <Paragraph>
            Test endpoint <Text code>/api/parts</Text> để kiểm tra kết nối backend.
          </Paragraph>
          
          <Button 
            icon={<ReloadOutlined />}
            onClick={testApiParts}
            loading={loading}
            type="primary"
          >
            Test lại API
          </Button>
        </Card>

        {loading && (
          <Card>
            <div className="text-center p-8">
              <Spin size="large" />
              <p className="mt-4">Đang test API...</p>
            </div>
          </Card>
        )}

        {error && (
          <Alert
            message="API Error"
            description={error}
            type="error"
            showIcon
          />
        )}

        {rawResponse && (
          <Card title="📄 Raw Response">
            <Text code style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
              {rawResponse}
            </Text>
          </Card>
        )}

        {parts.length > 0 && (
          <Card title="✅ Parsed Parts Data">
            <div className="space-y-3">
              {parts.map((part, index) => (
                <Card key={index} size="small" className="bg-green-50">
                  <Text strong>Part {part.partNumber || part.id}:</Text> {part.name}
                  <br />
                  <Text type="secondary">{part.description}</Text>
                  <br />
                  <Text>Skill: {part.skillType}</Text>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {!loading && !error && parts.length === 0 && rawResponse && (
          <Alert
            message="No Parts Found"
            description="API response không chứa parts data hoặc array rỗng."
            type="warning"
            showIcon
          />
        )}

      </div>
    </div>
  );
}
