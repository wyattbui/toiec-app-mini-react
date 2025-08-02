'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Form, Input, Button, message, Alert, Divider } from 'antd';
import { CloudServerOutlined, SaveOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import config from '@/lib/config';

const { Title, Text, Paragraph } = Typography;

export default function EnvSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState({
    BE_SERVER: '',
    API_TIMEOUT: 10000,
    DEBUG_MODE: false
  });
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Initialize config
    const initConfig = () => {
      const savedConfig = localStorage.getItem('app_config');
      let initialConfig;
      
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          initialConfig = {
            BE_SERVER: parsed.BE_SERVER || config.BE_SERVER,
            API_TIMEOUT: parsed.API_TIMEOUT || 10000,
            DEBUG_MODE: parsed.DEBUG_MODE || false
          };
        } catch (error) {
          console.error('Error parsing saved config:', error);
          initialConfig = {
            BE_SERVER: config.BE_SERVER,
            API_TIMEOUT: 10000,
            DEBUG_MODE: false
          };
        }
      } else {
        initialConfig = {
          BE_SERVER: config.BE_SERVER,
          API_TIMEOUT: 10000,
          DEBUG_MODE: false
        };
      }
      
      setCurrentConfig(initialConfig);
      form.setFieldsValue(initialConfig);
    };

    initConfig();
  }, [form]); // Remove currentConfig from dependency

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      
      // Validate URL format
      try {
        new URL(values.BE_SERVER);
      } catch {
        message.error('URL server không hợp lệ!');
        return;
      }

      // Save to localStorage
      const newConfig = {
        BE_SERVER: values.BE_SERVER.replace(/\/$/, ''), // Remove trailing slash
        API_TIMEOUT: parseInt(values.API_TIMEOUT) || 10000,
        DEBUG_MODE: values.DEBUG_MODE === 'true'
      };

      localStorage.setItem('app_config', JSON.stringify(newConfig));
      setCurrentConfig(newConfig);
      
      message.success('Cấu hình đã được lưu! Tải lại trang để áp dụng.');
      
    } catch (error) {
      message.error('Có lỗi khi lưu cấu hình!');
      console.error('Save config error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('app_config');
    const defaultConfig = {
      BE_SERVER: process.env.NEXT_PUBLIC_BE_SERVER || 'http://localhost:8000',
      API_TIMEOUT: 10000,
      DEBUG_MODE: false
    };
    setCurrentConfig(defaultConfig);
    form.setFieldsValue(defaultConfig);
    message.success('Đã reset về cấu hình mặc định!');
  };

  const handleReload = () => {
    window.location.reload();
  };

  const testConnection = async () => {
    const serverUrl = form.getFieldValue('BE_SERVER');
    if (!serverUrl) {
      message.error('Vui lòng nhập URL server!');
      return;
    }

    try {
      setLoading(true);
      
      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${serverUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        message.success('Kết nối server thành công! ✅');
      } else {
        message.warning(`Server phản hồi: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        message.error('Timeout: Không thể kết nối đến server! ⏰');
      } else {
        message.error('Không thể kết nối đến server! ❌');
      }
      console.error('Connection test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-3 sm:p-4">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="text-center text-white px-2">
            <SettingOutlined className="text-3xl sm:text-4xl mb-3" />
            <Title level={3} className="text-white mb-2 text-lg sm:text-2xl">
              🔧 Environment Settings
            </Title>
            <Text className="text-blue-100 text-sm sm:text-base">
              Cấu hình hệ thống (Route ẩn: /env)
            </Text>
          </div>
        </Card>

        {/* Warning */}
        <Alert
          message="⚠️ Trang cấu hình hệ thống"
          description="Đây là trang cài đặt dành cho admin. Vui lòng cẩn thận khi thay đổi các tham số."
          type="warning"
          showIcon
          className="shadow-md"
        />

        {/* User Info */}
        {isAuthenticated && user && (
          <Card size="small" className="shadow-md">
            <Text type="secondary" className="text-xs sm:text-sm">
              👤 Đang truy cập với tài khoản: <strong>{user.name}</strong> ({user.email})
            </Text>
          </Card>
        )}

        {/* Current Config Display */}
        <Card 
          title={<><CloudServerOutlined /> Cấu hình hiện tại</>}
          className="shadow-lg"
        >
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <Text strong className="block mb-2">Backend Server:</Text>
              <Text code copyable className="text-xs sm:text-sm break-all">
                {currentConfig.BE_SERVER}
              </Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">API Timeout:</Text>
                <Text code className="text-sm">{currentConfig.API_TIMEOUT}ms</Text>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">Debug Mode:</Text>
                <Text code className="text-sm">
                  {currentConfig.DEBUG_MODE ? 'Enabled' : 'Disabled'}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Form */}
        <Card 
          title="⚙️ Cấu hình mới"
          className="shadow-lg"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={currentConfig}
          >
            <Form.Item
              label="Backend Server URL"
              name="BE_SERVER"
              rules={[
                { required: true, message: 'Vui lòng nhập URL server!' },
                { type: 'url', message: 'URL không hợp lệ!' }
              ]}
            >
              <Input 
                placeholder="http://localhost:8000"
                prefix={<CloudServerOutlined />}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="API Timeout (ms)"
              name="API_TIMEOUT"
            >
              <Input 
                type="number"
                placeholder="10000"
                size="large"
                min={1000}
                max={60000}
              />
            </Form.Item>

            <Form.Item
              label="Debug Mode"
              name="DEBUG_MODE"
            >
              <Input 
                placeholder="false"
                size="large"
              />
            </Form.Item>

            <Divider />

            {/* Responsive Button Layout */}
            <div className="space-y-3">
              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  block
                  className="sm:flex-1"
                >
                  Lưu cấu hình
                </Button>
                
                <Button 
                  onClick={testConnection}
                  loading={loading}
                  icon={<CloudServerOutlined />}
                  size="large"
                  block
                  className="sm:flex-1"
                >
                  Test kết nối
                </Button>
              </div>
              
              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleReset}
                  icon={<ReloadOutlined />}
                  size="large"
                  block
                  className="sm:flex-1"
                >
                  Reset mặc định
                </Button>
                
                <Button 
                  onClick={handleReload}
                  type="dashed"
                  size="large"
                  block
                  className="sm:flex-1"
                >
                  Tải lại trang
                </Button>
              </div>
            </div>
          </Form>
        </Card>

        {/* Instructions */}
        <Card 
          title="📖 Hướng dẫn"
          size="small"
          className="shadow-md"
        >
          <Paragraph className="text-sm">
            <Text strong>Cách sử dụng:</Text>
          </Paragraph>
          <ul className="text-sm space-y-1">
            <li>Thay đổi <Text code>Backend Server URL</Text> để kết nối server khác</li>
            <li>Nhấn <Text strong>"Test kết nối"</Text> để kiểm tra server có hoạt động không</li>
            <li>Nhấn <Text strong>"Lưu cấu hình"</Text> để lưu thay đổi</li>
            <li>Nhấn <Text strong>"Tải lại trang"</Text> để áp dụng cấu hình mới</li>
            <li>Cấu hình được lưu trong localStorage của trình duyệt</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}
