// app/admin/page.tsx
'use client';

import { useState } from 'react';
import { Button, Space, Card, Typography, Row, Col } from 'antd';
import {
  SettingOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PartsList from '@/components/PartsList';
import QuestionsList from '@/components/QuestionsList';
import type { ToiecPart, ToiecQuestion } from '@/hooks/useToiecApi';

const { Title, Paragraph } = Typography;

export default function AdminPage() {
  const [selectedPart, setSelectedPart] = useState<ToiecPart | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<ToiecQuestion | null>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const adminFeatures = [
    {
      title: 'Quản lý câu hỏi',
      description: 'Tạo, chỉnh sửa và xóa câu hỏi TOEIC',
      icon: <QuestionCircleOutlined className="text-4xl text-blue-500" />,
      path: '/admin/questions',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Thống kê & Báo cáo',
      description: 'Xem thống kê câu hỏi và kết quả',
      icon: <BarChartOutlined className="text-4xl text-purple-500" />,
      path: '/admin/statistics',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Quản lý người dùng',
      description: 'Quản lý tài khoản và quyền hạn',
      icon: <UsergroupAddOutlined className="text-4xl text-orange-500" />,
      path: '/admin/users',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="text-center text-white">
            <Title level={2} className="text-white mb-2">
              🛠️ Admin Dashboard
            </Title>
            <Paragraph className="text-indigo-100 text-lg mb-4">
              Hệ thống quản lý TOEIC Mini
            </Paragraph>
            {isAuthenticated && user && (
              <div className="bg-white/20 rounded-lg p-3 inline-block">
                <span className="text-white">
                  👤 Xin chào, <strong>{user.name}</strong>
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="🚀 Thao tác nhanh" className="shadow-lg">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <Button 
              type="primary"
              size="large"
              icon={<QuestionCircleOutlined />}
              onClick={() => router.push('/admin/questions')}
            >
              Quản lý câu hỏi
            </Button>
            <Button 
              size="large"
              onClick={() => router.push('/admin/questions/simple')}
              style={{ backgroundColor: '#10b981', borderColor: '#10b981', color: 'white' }}
            >
              📝 UI Simple
            </Button>
            <Button 
              size="large"
              icon={<SettingOutlined />}
              onClick={() => router.push('/env')}
            >
              Cấu hình hệ thống
            </Button>
            <Button 
              size="large"
              onClick={() => router.push('/admin/test-api')}
              style={{ backgroundColor: '#f97316', borderColor: '#f97316', color: 'white' }}
            >
              🧪 Test API
            </Button>
            <Button 
              size="large"
              onClick={() => router.push('/')}
            >
              Về trang chủ
            </Button>
          </div>
        </Card>

        {/* Admin Features Grid */}
        <div>
          <Title level={3} className="mb-4">📊 Chức năng quản lý</Title>
          <Row gutter={[16, 16]}>
            {adminFeatures.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  className="h-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(feature.path)}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div className={`bg-gradient-to-r ${feature.color} rounded-lg p-4 mb-4 text-center`}>
                    {feature.icon}
                  </div>
                  <div className="text-center">
                    <Title level={4} className="mb-2">
                      {feature.title}
                    </Title>
                    <Paragraph type="secondary" className="text-sm">
                      {feature.description}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Legacy Components (for backward compatibility) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parts List */}
          <Card title="📝 Danh sách Parts" className="shadow-lg">
            <PartsList
              onSelectPart={setSelectedPart}
              selectedPartId={selectedPart?.id}
            />
          </Card>
          
          {/* Questions List */}
          <Card title="❓ Danh sách câu hỏi" className="shadow-lg">
            <QuestionsList
              partId={selectedPart?.id || null}
              onSelectQuestion={setSelectedQuestion}
              selectedQuestionId={selectedQuestion?.id}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}