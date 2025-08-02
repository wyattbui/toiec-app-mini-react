// app/auth/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Typography, message, Steps, Result } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authAPI } from '@/lib/auth';

const { Title, Text, Paragraph } = Typography;

interface ResetPasswordFormValues {
  email?: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [form] = Form.useForm();

  // Step 1: Gửi email reset
  const handleSendResetEmail = async (values: { email: string }) => {
    try {
      setLoading(true);
      
      await authAPI.forgotPassword(values.email);

      setEmail(values.email);
      setCurrentStep(1);
      message.success('Email reset password đã được gửi!');
      
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Xác minh mã và reset password
  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    try {
      setLoading(true);
      
      await authAPI.resetPassword({
        email,
        code: values.code!,
        newPassword: values.newPassword!,
      });

      setCurrentStep(2);
      message.success('Đổi mật khẩu thành công!');
      
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Nhập Email',
      description: 'Nhập email để nhận mã reset',
    },
    {
      title: 'Xác minh mã',
      description: 'Nhập mã và mật khẩu mới',
    },
    {
      title: 'Hoàn thành',
      description: 'Reset password thành công',
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            name="forgot-password"
            onFinish={handleSendResetEmail}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <div className="text-center mb-6">
              <Title level={3} className="text-gray-800 mb-2">
                Quên mật khẩu?
              </Title>
              <Paragraph type="secondary">
                Nhập email của bạn, chúng tôi sẽ gửi mã để reset mật khẩu
              </Paragraph>
            </div>

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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 text-base font-medium rounded-lg bg-blue-600 hover:bg-blue-700 border-none"
              >
                Gửi mã reset
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form
            form={form}
            name="reset-password"
            onFinish={handleResetPassword}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <div className="text-center mb-6">
              <Title level={3} className="text-gray-800 mb-2">
                Nhập mã xác minh
              </Title>
              <Paragraph type="secondary">
                Chúng tôi đã gửi mã xác minh đến <strong>{email}</strong>
              </Paragraph>
            </div>

            <Form.Item
              name="code"
              label="Mã xác minh"
              rules={[
                { required: true, message: 'Vui lòng nhập mã xác minh!' },
                { len: 6, message: 'Mã xác minh phải có 6 ký tự!' }
              ]}
            >
              <Input 
                placeholder="Nhập mã 6 chữ số"
                className="rounded-lg text-center text-lg tracking-widest"
                maxLength={6}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu mới"
                className="rounded-lg"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập lại mật khẩu mới"
                className="rounded-lg"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 text-base font-medium rounded-lg bg-blue-600 hover:bg-blue-700 border-none"
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text type="secondary" className="text-sm">
                Không nhận được mã?{' '}
                <Button 
                  type="link" 
                  size="small" 
                  className="p-0 h-auto text-blue-600"
                  onClick={() => handleSendResetEmail({ email })}
                >
                  Gửi lại
                </Button>
              </Text>
            </div>
          </Form>
        );

      case 2:
        return (
          <Result
            icon={<CheckCircleOutlined className="text-green-500" />}
            title="Đổi mật khẩu thành công!"
            subTitle="Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới."
            extra={[
              <Button 
                type="primary" 
                key="login"
                onClick={() => router.push('/auth/login')}
                className="bg-blue-600 hover:bg-blue-700 border-none"
              >
                Đăng nhập ngay
              </Button>,
              <Button key="home" onClick={() => router.push('/')}>
                Về trang chủ
              </Button>,
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4 pt-32">
      <Card className="w-full max-w-md shadow-2xl border-0">
        {currentStep < 2 && (
          <div className="mb-8">
            <Steps current={currentStep} size="small">
              {steps.map((step, index) => (
                <Steps.Step key={index} title={step.title} />
              ))}
            </Steps>
          </div>
        )}

        {renderStepContent()}

        {currentStep < 2 && (
          <>
            <div className="text-center mt-6">
              <Text type="secondary">
                Nhớ mật khẩu rồi?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Đăng nhập
                </Link>
              </Text>
            </div>

            <div className="text-center mt-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
                ← Quay về trang chủ
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
