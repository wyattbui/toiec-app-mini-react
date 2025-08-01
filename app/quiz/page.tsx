// app/quiz/page.tsx
"use client";

import { useQuizStore } from '@/stores/useQuizStore';
import { useEffect, useState } from 'react';
import QuestionBlock from '@/components/QuestionBlock';
import AnswerSheet from '@/components/AnswerSheet';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const { questions, setQuestions, currentIndex, next, answer, userAnswers } = useQuizStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/mock-questions')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  }, [setQuestions]);

  if (loading) return <div className="p-4 text-center text-gray-600">Loading questions...</div>;

  const current = questions[currentIndex];
  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      router.push('/result');
    } else {
      next();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-green-700 text-center">TOEIC Luyện Tập</h1>
        <div className="text-center text-gray-600 text-sm">Part {currentIndex + 1} trong {questions.length}</div>
        <QuestionBlock
          question={current}
          onAnswer={(ans) => answer(current.id, ans)}
          selected={userAnswers[current.id]}
        />
        <AnswerSheet
          total={questions.length}
          current={currentIndex + 1}
          onNext={handleNext}
          userAnswers={userAnswers}
        />
      </div>
    </div>
  );
}