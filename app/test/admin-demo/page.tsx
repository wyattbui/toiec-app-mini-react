// app/test/admin-demo/page.tsx
'use client';

import { Card, Typography, Button, Space, Steps, Alert, Row, Col } from 'antd';
import { 
  CheckCircleOutlined, 
  PlayCircleOutlined, 
  SettingOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function AdminDemoPage() {
  const router = useRouter();

  const demoSteps = [
    {
      title: 'Đăng nhập',
      description: 'Đăng nhập với tài khoản admin',
      status: 'process'
    },
    {
      title: 'Truy cập Admin',
      description: 'Click menu user → "Quản trị hệ thống"',
      status: 'process'
    },
    {
      title: 'Quản lý câu hỏi',
      description: 'Tạo/sửa/xóa câu hỏi TOEIC',
      status: 'process'
    },
    {
      title: 'Xem thống kê',
      description: 'Kiểm tra reports và analytics',
      status: 'process'
    }
  ];

  const adminFeatures = [
    {
      title: 'Quản lý câu hỏi',
      description: 'CRUD câu hỏi với đầy đủ options, audio, image',
      path: '/admin/questions',
      icon: <QuestionCircleOutlined className="text-2xl text-blue-500" />,
      status: '✅ Hoàn thành',
      color: 'green'
    },
    {
      title: 'Dashboard Admin',
      description: 'Tổng quan và navigation trung tâm',
      path: '/admin',
      icon: <SettingOutlined className="text-2xl text-purple-500" />,
      status: '✅ Hoàn thành',
      color: 'green'
    },
    {
      title: 'Cấu hình hệ thống',
      description: 'Thay đổi BE_SERVER, timeout, debug mode',
      path: '/env',
      icon: <SettingOutlined className="text-2xl text-orange-500" />,
      status: '✅ Hoàn thành',
      color: 'green'
    },
    {
      title: 'Thống kê & Báo cáo',
      description: 'Analytics và insights về hệ thống',
      path: '/admin/statistics',
      icon: <BarChartOutlined className="text-2xl text-green-500" />,
      status: '🔄 Mock data',
      color: 'orange'
    },
    {
      title: 'Quản lý người dùng',
      description: 'User management và roles',
      path: '/admin/users',
      icon: <UsergroupAddOutlined className="text-2xl text-red-500" />,
      status: '🔄 Mock data',
      color: 'orange'
    }
  ];

  return (
    <div className="page-content min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-600">
          <div className="text-center text-white">
            <Title level={2} className="text-white mb-2">
              🚀 Demo Hệ thống Admin
            </Title>
            <Paragraph className="text-purple-100 text-lg">
              Test và trải nghiệm các tính năng quản trị TOEIC Mini
            </Paragraph>
          </div>
        </Card>

        {/* Quick Start */}
        <Card title="⚡ Quick Start" className="shadow-lg">
          <Alert
            message="Hướng dẫn truy cập Admin"
            description={
              <div className="mt-3">
                <Steps
                  direction="vertical"
                  size="small"
                  current={0}
                  items={demoSteps.map(step => ({
                    title: step.title,
                    description: step.description
                  }))}
                />
              </div>
            }
            type="info"
            showIcon
            className="mb-4"
          />
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/auth/login">
              <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                Bắt đầu - Đăng nhập
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="large" icon={<SettingOutlined />}>
                Trực tiếp Admin Dashboard
              </Button>
            </Link>
          </div>
        </Card>

        {/* Features Overview */}
        <Card title="🎯 Tính năng Admin" className="shadow-lg">
          <Row gutter={[16, 16]}>
            {adminFeatures.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  size="small"
                  hoverable
                  className="h-full shadow-md hover:shadow-lg transition-all"
                  onClick={() => router.push(feature.path)}
                >
                  <div className="text-center">
                    <div className="mb-3">
                      {feature.icon}
                    </div>
                    <Title level={5} className="mb-2">
                      {feature.title}
                    </Title>
                    <Paragraph className="text-sm text-gray-600 mb-3">
                      {feature.description}
                    </Paragraph>
                    <Text 
                      className={`text-sm font-medium ${
                        feature.color === 'green' ? 'text-green-600' : 'text-orange-600'
                      }`}
                    >
                      {feature.status}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Current Status */}
        <Card title="📊 Trạng thái hiện tại" className="shadow-lg">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card size="small" className="bg-green-50">
                <div className="text-center">
                  <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
                  <Title level={4} className="text-green-700 mb-1">
                    Hoàn thành
                  </Title>
                  <ul className="text-left text-sm space-y-1">
                    <li>✅ Admin Dashboard với navigation</li>
                    <li>✅ CRUD câu hỏi đầy đủ tính năng</li>
                    <li>✅ Link admin trong Header menu</li>
                    <li>✅ Environment settings trang</li>
                    <li>✅ API proxy cho admin operations</li>
                    <li>✅ Responsive UI cho mobile</li>
                    <li>✅ Loại bỏ Parts quản lý (7 parts cố định)</li>
                  </ul>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small" className="bg-orange-50">
                <div className="text-center">
                  <PlayCircleOutlined className="text-3xl text-orange-500 mb-2" />
                  <Title level={4} className="text-orange-700 mb-1">
                    Cần phát triển
                  </Title>
                  <ul className="text-left text-sm space-y-1">
                    <li>🔄 Role-based access control</li>
                    <li>🔄 Real API cho Users management</li>
                    <li>🔄 Charts và advanced analytics</li>
                    <li>🔄 File upload cho audio/image</li>
                    <li>🔄 Bulk operations</li>
                    <li>🔄 Audit logs</li>
                  </ul>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Test Links */}
        <Card title="🔗 Test Links" className="shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link href="/admin">
              <Button block>Dashboard</Button>
            </Link>
            <Link href="/admin/questions">
              <Button block>Questions</Button>
            </Link>
            <Link href="/admin/statistics">
              <Button block>Statistics</Button>
            </Link>
            <Link href="/admin/users">
              <Button block>Users</Button>
            </Link>
            <Link href="/env">
              <Button block>Settings</Button>
            </Link>
            <Link href="/auth/login">
              <Button block>Login</Button>
            </Link>
            <Link href="/">
              <Button block>Home</Button>
            </Link>
            <Link href="/quiz">
              <Button block>Quiz</Button>
            </Link>
            <Link href="/profile">
              <Button block>Profile</Button>
            </Link>
          </div>
        </Card>

        {/* Documentation */}
        <Card title="📚 Documentation" size="small" className="shadow-md">
          <Paragraph>
            <Text strong>Chi tiết:</Text> Xem file <Text code>ADMIN_README.md</Text> để 
            biết thêm thông tin về cách sử dụng hệ thống admin.
          </Paragraph>
        </Card>

      </div>
    </div>
  );
}
