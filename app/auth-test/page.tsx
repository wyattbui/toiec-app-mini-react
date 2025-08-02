// app/auth-test/page.tsx
'use client';

import { useState } from 'react';
import { Card, Typography, Space, Button, Form, Input, message, Divider } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/auth';
import AuthStatus from '@/components/AuthStatus';

const { Title, Text, Paragraph } = Typography;

export default function AuthTestPage() {
  const { user, isAuthenticated, token, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  // Test đăng nhập nhanh
  const quickLogin = async () => {
    try {
      setLoading(true);
      const result = await authAPI.login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      login(result.access_token, result.user);
      message.success('Đăng nhập test thành công!');
      setTestResult('✅ Login test passed');
    } catch (error) {
      message.error('Test login failed: ' + (error as Error).message);
      setTestResult('❌ Login test failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Test lấy thông tin user
  const testGetUser = async () => {
    if (!token) {
      message.warning('Vui lòng đăng nhập trước');
      return;
    }

    try {
      setLoading(true);
      const userInfo = await authAPI.getCurrentUser(token);
      message.success('Lấy thông tin user thành công!');
      setTestResult(`✅ Get user info passed: ${JSON.stringify(userInfo, null, 2)}`);
    } catch (error) {
      message.error('Test get user failed: ' + (error as Error).message);
      setTestResult('❌ Get user test failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Test đăng ký
  const testSignup = async () => {
    try {
      setLoading(true);
      await authAPI.signup({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Password123!'
      });
      message.success('Đăng ký test thành công!');
      setTestResult('✅ Signup test passed');
    } catch (error) {
      message.error('Test signup failed: ' + (error as Error).message);
      setTestResult('❌ Signup test failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Custom login form
  const onCustomLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const result = await authAPI.login(values);
      login(result.access_token, result.user);
      message.success('Đăng nhập thành công!');
      setTestResult('✅ Custom login successful');
    } catch (error) {
      message.error('Login failed: ' + (error as Error).message);
      setTestResult('❌ Custom login failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-32">
      <div className="max-w-4xl mx-auto space-y-6">
        <Title level={2}>Authentication Test Page</Title>
        
        <AuthStatus />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Actions */}
          <Card title="Test Actions" className="h-fit">
            <Space direction="vertical" size="middle" className="w-full">
              <Button 
                type="primary" 
                block 
                loading={loading}
                onClick={quickLogin}
              >
                🚀 Quick Login Test (test@example.com)
              </Button>
              
              <Button 
                block 
                loading={loading}
                onClick={testSignup}
              >
                👤 Test Signup (Random User)
              </Button>
              
              <Button 
                block 
                loading={loading}
                onClick={testGetUser}
                disabled={!isAuthenticated}
              >
                📋 Test Get User Info
              </Button>
              
              <Button 
                danger 
                block 
                onClick={logout}
                disabled={!isAuthenticated}
              >
                🚪 Logout
              </Button>
            </Space>
          </Card>

          {/* Custom Login Form */}
          <Card title="Custom Login Form">
            <Form
              layout="vertical"
              onFinish={onCustomLogin}
              disabled={loading}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input email!' },
                  { type: 'email', message: 'Invalid email!' }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input password!' }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* Test Results */}
        {testResult && (
          <Card title="Test Results">
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {testResult}
            </pre>
          </Card>
        )}

        {/* Debug Info */}
        <Card title="Debug Information">
          <Space direction="vertical" size="small" className="w-full">
            <div><Text strong>Is Authenticated:</Text> {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
            <div><Text strong>User:</Text> {user ? JSON.stringify(user, null, 2) : 'null'}</div>
            <div><Text strong>Token:</Text> {token ? `${token.substring(0, 50)}...` : 'null'}</div>
            <div><Text strong>LocalStorage Token:</Text> {typeof window !== 'undefined' ? localStorage.getItem('token')?.substring(0, 50) + '...' : 'N/A'}</div>
            <div><Text strong>LocalStorage User:</Text> {typeof window !== 'undefined' ? localStorage.getItem('user') : 'N/A'}</div>
          </Space>
        </Card>

        {/* API Status */}
        <Card title="API Status">
          <Paragraph>
            <Text strong>Backend URL:</Text> http://localhost:3333
          </Paragraph>
          <Paragraph>
            <Text strong>Endpoints:</Text>
          </Paragraph>
          <ul>
            <li>POST /auth/login</li>
            <li>POST /auth/signup</li>
            <li>POST /auth/forgot-password</li>
            <li>POST /auth/reset-password</li>
            <li>GET /auth/me</li>
            <li>POST /auth/logout</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
