'use client';

import { Typography, Button, Card } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Card className="p-8 max-w-xl w-full text-center">
        <Title>TOEIC Mini</Title>
        <Paragraph>Chào mừng bạn đến với nền tảng luyện thi TOEIC đơn giản!</Paragraph>
        <Button type="primary" size="large" onClick={() => router.push('/quiz')}>
          Bắt đầu làm bài
        </Button>
      </Card>
    </div>
  );
}