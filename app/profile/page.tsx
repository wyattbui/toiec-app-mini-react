// app/profile/page.tsx
'use client';

import { Card, Typography, Avatar, Descriptions, Button, Space } from 'antd';
import { UserOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6 pt-32">
        <div className="max-w-4xl mx-auto space-y-6">
          <Title level={2} className="text-gray-800">
            Thông tin cá nhân
          </Title>

          <Card className="shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
              <Avatar 
                size={80} 
                src={user.avatar} 
                icon={<UserOutlined />}
                className="bg-blue-500"
              />
              <div className="flex-1">
                <Title level={3} className="mb-1">
                  {user.name}
                </Title>
                <Text type="secondary" className="text-base">
                  {user.email}
                </Text>
                <div className="mt-3">
                  <Space>
                    <Button type="primary" icon={<EditOutlined />}>
                      Chỉnh sửa thông tin
                    </Button>
                    <Button 
                      icon={<SettingOutlined />}
                      onClick={() => router.push('/env')}
                    >
                      Cài đặt hệ thống
                    </Button>
                  </Space>
                </div>
              </div>
            </div>

            <Descriptions 
              title="Thông tin chi tiết" 
              bordered 
              column={{ xs: 1, md: 2 }}
            >
              <Descriptions.Item label="Họ và tên">
                {user.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label="ID người dùng">
                {user.id}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <span className="text-green-600 font-medium">Đang hoạt động</span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                Chưa có thông tin
              </Descriptions.Item>
              <Descriptions.Item label="Lần đăng nhập cuối">
                Hôm nay
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Thống kê học tập" className="shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-gray-600">Bài thi đã làm</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-gray-600">Điểm trung bình</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-gray-600">Giờ luyện tập</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
