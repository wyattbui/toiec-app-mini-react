'use client';

import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useEffect } from 'react';
import { useQuizStore } from '@/stores/useQuizStore';
import { Card, Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

export default function ResultPage() {
  const { questions, userAnswers, reset } = useQuizStore();
  const router = useRouter();

  useEffect(() => {
    if (questions.length === 0) router.replace('/quiz');
  }, [questions, router]);

  const correctCount = questions.filter(
    (q) => userAnswers[q.id] && userAnswers[q.id] === q.options[0] // giả định đáp án đúng là option đầu
  ).length;

  const data = [
    { name: 'Correct', value: correctCount },
    { name: 'Incorrect', value: questions.length - correctCount },
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 pt-32">
      <Card className="max-w-md w-full shadow-lg rounded-xl">
        <div className="flex flex-col items-center space-y-6">
          <Title level={3} style={{ color: '#1677ff' }}>🎯 Kết quả của bạn</Title>
          <PieChart width={280} height={280}>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <Paragraph>Bạn trả lời đúng <strong>{correctCount}</strong> / {questions.length} câu hỏi.</Paragraph>
          <Button type="primary" onClick={() => { reset(); router.push('/'); }}>Làm lại bài</Button>
        </div>
      </Card>
    </div>
  );
}