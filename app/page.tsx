'use client';

import { Typography, Button, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Paragraph } = Typography;

const parts = [
  { label: 'Part 1: Mô tả hình ảnh', value: 1 },
  { label: 'Part 2: Hỏi & Đáp', value: 2 },
  { label: 'Part 3: Hội thoại', value: 3 },
  { label: 'Part 4: Bài nói', value: 4 },
  { label: 'Part 5: Hoàn thành câu', value: 5 },
  { label: 'Part 6: Hoàn thành đoạn văn', value: 6 },
  { label: 'Part 7: Đọc hiểu', value: 7 },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  return (
    <div 
      className="page-content flex items-center justify-center min-h-screen" 
      style={{
        background: 'linear-gradient(135deg, #f0fdfa 0%, #fce7f3 50%, #f0fdfa 100%)'
      }}
    >
      <div className="max-w-xl w-full space-y-6 p-4">
        <Card 
          className="p-8 w-full shadow-lg" 
          style={{ border: '1px solid #ccfbf1' }}
        >
          <Title className="text-center" style={{ color: '#0f766e' }}>TOEIC Mini</Title>
          <Paragraph className="text-center" style={{ color: '#6b7280' }}>
            Chào mừng bạn đến với nền tảng luyện thi TOEIC đơn giản!
          </Paragraph>
          {isAuthenticated && user && (
            <div 
              className="text-center p-3 rounded-lg"
              style={{ 
                color: '#0d9488', 
                fontWeight: 500,
                backgroundColor: '#f0fdfa',
                border: '1px solid #99f6e4'
              }}
            >
              Xin chào, {user.name}! 👋
            </div>
          )}
          <Paragraph className="text-center" style={{ color: '#6b7280' }}>
            Chọn một phần bên dưới để bắt đầu luyện tập:
          </Paragraph>
          <div className="space-y-4 mt-6">
            {parts.map((part) => (
              <Button
                key={part.value}
                type="default"
                size="large"
                block
                onClick={() => router.push(`/quiz?part=${part.value}`)}
                className="teal-button text-left shadow-md hover:shadow-lg transition-all duration-200 py-4 h-auto"
                style={{
                  minHeight: '60px',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                {part.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}