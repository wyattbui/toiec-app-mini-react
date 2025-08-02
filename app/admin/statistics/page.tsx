// app/admin/statistics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Button, Spin } from 'antd';
import { 
  QuestionCircleOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  TrophyOutlined,
  ArrowLeftOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const { Title } = Typography;

interface StatsData {
  totalQuestions: number;
  totalParts: number;
  totalUsers: number;
  totalAttempts: number;
}

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<StatsData>({
    totalQuestions: 0,
    totalParts: 0,
    totalUsers: 0,
    totalAttempts: 0
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Load basic stats (mock data for now)
      // In real implementation, you would fetch from your API
      setTimeout(() => {
        setStats({
          totalQuestions: 150,
          totalParts: 7,
          totalUsers: 45,
          totalAttempts: 320
        });
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Load statistics error:', error);
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Tổng số câu hỏi',
      value: stats.totalQuestions,
      icon: <QuestionCircleOutlined />,
      color: '#1890ff',
      bgColor: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Tổng số Parts',
      value: stats.totalParts,
      icon: <FileTextOutlined />,
      color: '#52c41a',
      bgColor: 'from-green-500 to-green-600'
    },
    {
      title: 'Tổng số người dùng',
      value: stats.totalUsers,
      icon: <UserOutlined />,
      color: '#fa8c16',
      bgColor: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Lượt thi thực hiện',
      value: stats.totalAttempts,
      icon: <TrophyOutlined />,
      color: '#eb2f96',
      bgColor: 'from-pink-500 to-pink-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page-content min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-indigo-600">
          <div className="text-center text-white">
            <Title level={2} className="text-white mb-2">
              📊 Thống kê & Báo cáo
            </Title>
            <p className="text-purple-100">
              Tổng quan về hệ thống TOEIC Mini
            </p>
          </div>
        </Card>

        {/* Navigation */}
        <Card size="small" className="shadow-md">
          <div className="flex justify-between items-center">
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push('/admin')}
            >
              Quay lại Dashboard
            </Button>
            {isAuthenticated && user && (
              <span className="text-gray-600">
                👤 Admin: <strong>{user.name}</strong>
              </span>
            )}
          </div>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          {statsCards.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`bg-gradient-to-r ${stat.bgColor} rounded-lg p-4 mb-4 text-center`}>
                  <div className="text-white text-4xl">
                    {stat.icon}
                  </div>
                </div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color, fontWeight: 'bold' }}
                  className="text-center"
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts Section */}
        <Card 
          title={
            <div className="flex items-center gap-2">
              <BarChartOutlined />
              <span>Biểu đồ thống kê</span>
            </div>
          }
          className="shadow-lg"
        >
          <div className="text-center py-16">
            <BarChartOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={4} type="secondary">
              Biểu đồ chi tiết sẽ được phát triển trong tương lai
            </Title>
            <p className="text-gray-500">
              Các biểu đồ hiển thị xu hướng làm bài, độ khó câu hỏi, thống kê theo thời gian...
            </p>
          </div>
        </Card>

        {/* Quick Insights */}
        <Card title="💡 Thông tin nhanh" className="shadow-lg">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card size="small" className="bg-blue-50">
                <Statistic
                  title="Câu hỏi trung bình mỗi Part"
                  value={(stats.totalQuestions / stats.totalParts).toFixed(1)}
                  suffix="câu"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" className="bg-green-50">
                <Statistic
                  title="Trung bình lượt thi mỗi người"
                  value={(stats.totalAttempts / stats.totalUsers).toFixed(1)}
                  suffix="lượt"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>
        </Card>

      </div>
    </div>
  );
}
