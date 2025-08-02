// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import { authAPI } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      
      const data = await authAPI.login(values);
      
      // Lưu token và user info - sử dụng access_token từ response
      login(data.access_token, data.user);
      
      message.success('Đăng nhập thành công!');
      
      // Kiểm tra có part được chọn trước đó không
      const selectedPart = localStorage.getItem('selectedPart');
      if (selectedPart) {
        localStorage.removeItem('selectedPart'); // Xóa sau khi sử dụng
        router.push(`/quiz?part=${selectedPart}`);
      } else {
        router.push('/');
      }
      
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-pink-50 to-teal-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-center">
          <Title level={2} className="text-white mb-2">
            Đăng nhập
          </Title>
          <Text className="text-teal-100">
            Chào mừng bạn quay trở lại với TOEIC Mini
          </Text>
        </div>
         <div className="p-6">
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập email của bạn"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu"
              className="rounded-lg"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <div className="flex justify-end mb-6">
            <Link href="/auth/reset-password" className="text-blue-600 hover:text-blue-800 text-sm">
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-12 text-base font-medium rounded-lg bg-teal-500 hover:bg-teal-600 border-none shadow-md"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary" className="text-xs">
            HOẶC
          </Text>
        </Divider>

        <div className="text-center">
          <Text type="secondary">
            Chưa có tài khoản?{' '}
            <Link href="/auth/signup" className="text-teal-600 hover:text-teal-700 font-medium">
              Đăng ký ngay
            </Link>
          </Text>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Quay về trang chủ
          </Link>
        </div>
        </div>
      </Card>
    </div>
  );
}
