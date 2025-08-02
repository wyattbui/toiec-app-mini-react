// components/Header.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button, Dropdown, Avatar, Typography, Space, message } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const { user, isAuthenticated, logout, loading, isHydrated } = useAuth();
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);

  // Debug log để kiểm tra trạng thái
  console.log('Header: Auth state', { 
    isAuthenticated, 
    hasUser: !!user, 
    userName: user?.name,
    userEmail: user?.email,
    loading,
    isHydrated
  });

  const handleLogout = async () => {
    try {
      setButtonLoading(true);
      
      // TODO: Call logout API if needed
      // await fetch('http://localhost:3333/api/auth/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });

      logout();
      message.success('Đăng xuất thành công!');
      router.push('/');
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng xuất');
    } finally {
      setButtonLoading(false);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      disabled: buttonLoading,
    },
  ];

  return (
    <AntHeader className="header-teal-theme shadow-lg px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2 text-decoration-none hover:opacity-90 transition-opacity">
          <HomeOutlined style={{ color: '#f9a8d4', fontSize: '20px' }} />
          <Text strong style={{ color: 'white', fontSize: '20px' }}>
            TOEIC Mini
          </Text>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <Space size="middle" className="flex items-center">
            <Text style={{ color: '#a7f3d0', fontWeight: 500 }} className="hidden sm:inline">
              Xin chào,
            </Text>
            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Button 
                type="text" 
                className="flex items-center space-x-2 h-auto p-2 rounded-lg transition-colors"
                style={{ 
                  border: '1px solid rgba(134, 239, 172, 0.5)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar 
                  size="small" 
                  src={user?.avatar} 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#f472b6', border: '2px solid white' }}
                />
                <div className="hidden sm:flex flex-col items-start">
                  <Text strong style={{ color: 'white', fontSize: '14px', lineHeight: 1 }}>
                    {user?.name}
                  </Text>
                  <Text style={{ color: '#a7f3d0', fontSize: '12px', lineHeight: 1 }}>
                    {user?.email}
                  </Text>
                </div>
              </Button>
            </Dropdown>
          </Space>
        ) : (
          <Space size="large">
            <Link href="/auth/login">
              <Button 
                type="default" 
                icon={<LoginOutlined />}
                className="flex items-center space-x-1"
                style={{
                  backgroundColor: 'white',
                  color: '#0d9488',
                  border: '1px solid white',
                  fontWeight: 500
                }}
              >
                <span className="hidden sm:inline">Đăng nhập</span>
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                className="pink-button font-medium shadow-md"
              >
                <span className="hidden sm:inline">Đăng ký</span>
              </Button>
            </Link>
          </Space>
        )}
      </div>
    </AntHeader>
  );
}
