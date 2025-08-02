// app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Typography, message, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import { authAPI } from '@/lib/auth';

const { Title, Text } = Typography;

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: SignupFormValues) => {
    try {
      setLoading(true);
      
      await authAPI.signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      
      message.success(' thành công! Vui lòng đăng nhập.');
      router.push('/auth/login');
      
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 mb-2">
             tài khoản
          </Title>
          <Text type="secondary">
            Tạo tài khoản để bắt đầu luyện thi TOEIC
          </Text>
        </div>

        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập họ và tên"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Nhập email của bạn"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu"
              className="rounded-lg"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập lại mật khẩu"
              className="rounded-lg"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="agreeTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')),
              },
            ]}
          >
            <Checkbox>
              Tôi đồng ý với{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                Điều khoản sử dụng
              </Link>{' '}
              và{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Chính sách bảo mật
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-12 text-base font-medium rounded-lg bg-green-600 hover:bg-green-700 border-none"
            >
               tài khoản
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
            Đã có tài khoản?{' '}
            <Link href="/auth/login" className="text-green-600 hover:text-green-800 font-medium">
              Đăng nhập ngay
            </Link>
          </Text>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Quay về trang chủ
          </Link>
        </div>
      </Card>
    </div>
  );
}
