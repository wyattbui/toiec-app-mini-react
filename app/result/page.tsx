'use client';

import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import { useQuizStore } from '@/stores/useQuizStore';
import { Card, Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

export default function ResultPage() {
  const { questions, userAnswers, reset } = useQuizStore();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (questions.length === 0 && !isNavigating) {
      router.replace('/');
    }
  }, [questions, router, isNavigating]);

  const correctCount = questions.filter((q) => {
    const userAnswer = userAnswers[q.id];
    if (!userAnswer) return false;
    
    // Tìm option đúng dựa trên isCorrect flag
    const correctOption = q.options.find(option => option.isCorrect);
    if (!correctOption) return false;
    
    // So sánh optionLetter của user với optionLetter của đáp án đúng
    return userAnswer === correctOption.optionLetter;
  }).length;

  const data = [
    { name: 'Correct', value: correctCount },
    { name: 'Incorrect', value: questions.length - correctCount },
  ];

  const COLORS = ['#10b981', '#f97316']; // Green for correct, Orange for incorrect

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 pt-32">
      <Card className="max-w-md w-full shadow-lg rounded-xl">
        <div className="flex flex-col items-center space-y-6">
          <Title level={3} style={{ color: '#0d9488', textAlign: 'center' }}>
            🎯 Kết quả của bạn
          </Title>
          <PieChart width={280} height={280}>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name === 'Correct' ? 'Đúng' : 'Sai']} />
            <Legend formatter={(value) => value === 'Correct' ? 'Đúng' : 'Sai'} />
          </PieChart>
          <Paragraph style={{ textAlign: 'center', color: '#6b7280' }}>
            Bạn trả lời đúng <strong style={{ color: '#059669' }}>{correctCount}</strong> / {questions.length} câu hỏi.
          </Paragraph>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              type="primary" 
              size="large"
              className="teal-button flex-1"
              onClick={() => { 
                setIsNavigating(true);
                reset(); 
                router.push('/'); 
              }}
              style={{ 
                minHeight: '48px',
                fontWeight: 500 
              }}
            >
              🏠 Chọn Part khác
            </Button>
            <Button 
              type="default" 
              size="large"
              className="flex-1"
              onClick={() => { 
                setIsNavigating(true);
                reset(); 
                router.back(); 
              }}
              style={{ 
                minHeight: '48px',
                fontWeight: 500,
                borderColor: '#0d9488',
                color: '#0d9488'
              }}
            >
              🔄 Làm lại Part này
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}