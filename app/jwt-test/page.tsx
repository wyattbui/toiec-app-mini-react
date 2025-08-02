// app/jwt-test/page.tsx
'use client';

import { useState } from 'react';
import { Card, Typography, Button, Space, Input, Alert } from 'antd';
import { parseJWT, isTokenExpired, extractUserFromToken } from '@/lib/jwt';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function JWTTestPage() {
  const [testToken, setTestToken] = useState('');
  const [parseResult, setParseResult] = useState<any>(null);
  const [userExtracted, setUserExtracted] = useState<any>(null);
  const [isExpired, setIsExpired] = useState<boolean | null>(null);

  // Sample JWT token for testing (expired)
  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDgyfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KE';

  const testParseToken = () => {
    if (!testToken) {
      setTestToken(sampleToken);
      return;
    }

    const parsed = parseJWT(testToken);
    const expired = isTokenExpired(testToken);
    const user = extractUserFromToken(testToken);

    setParseResult(parsed);
    setIsExpired(expired);
    setUserExtracted(user);
  };

  const clearTest = () => {
    setTestToken('');
    setParseResult(null);
    setUserExtracted(null);
    setIsExpired(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pt-32">
      <Title level={2}>JWT Test Page</Title>
      
      <Card className="mb-4">
        <Space direction="vertical" className="w-full">
          <Text strong>JWT Token:</Text>
          <TextArea
            value={testToken}
            onChange={(e) => setTestToken(e.target.value)}
            placeholder="Paste JWT token here or click 'Use Sample Token'"
            rows={4}
          />
          <Space>
            <Button onClick={testParseToken} type="primary">
              {testToken ? 'Parse Token' : 'Use Sample Token'}
            </Button>
            <Button onClick={clearTest}>Clear</Button>
          </Space>
        </Space>
      </Card>

      {parseResult && (
        <Card title="Parsed JWT Payload" className="mb-4">
          <pre>{JSON.stringify(parseResult, null, 2)}</pre>
        </Card>
      )}

      {isExpired !== null && (
        <Card title="Token Status" className="mb-4">
          <Alert
            message={isExpired ? 'Token is EXPIRED' : 'Token is VALID'}
            type={isExpired ? 'error' : 'success'}
            showIcon
          />
          {parseResult?.exp && (
            <div className="mt-2">
              <Text>Expires at: {new Date(parseResult.exp * 1000).toLocaleString()}</Text>
            </div>
          )}
        </Card>
      )}

      {userExtracted && (
        <Card title="Extracted User">
          <pre>{JSON.stringify(userExtracted, null, 2)}</pre>
        </Card>
      )}

      <Card title="Instructions">
        <Space direction="vertical">
          <Text>1. Paste a JWT token vào text area ở trên</Text>
          <Text>2. Hoặc click "Use Sample Token" để dùng token mẫu</Text>
          <Text>3. Click "Parse Token" để parse và kiểm tra token</Text>
          <Text>4. Xem kết quả parse, trạng thái expiry, và user được extract</Text>
        </Space>
      </Card>
    </div>
  );
}
