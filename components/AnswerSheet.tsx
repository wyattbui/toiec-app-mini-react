// components/AnswerSheet.tsx
import React from 'react';

interface Props {
  total: number;
  current: number;
  onNext: () => void;
  userAnswers: Record<string, string>;
}

export default function AnswerSheet({ total, current, onNext, userAnswers }: Props) {
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <span className="text-gray-700 text-sm">
        Câu {current} / {total}
      </span>
      <button
        onClick={onNext}
        className="bg-green-600 text-white px-6 py-2 rounded-xl shadow hover:bg-green-700 transition cursor-pointer"
        disabled={current === total}
      >
        {current === total ? 'Nộp bài' : 'Câu tiếp theo'}
      </button>
    </div>
  );
}