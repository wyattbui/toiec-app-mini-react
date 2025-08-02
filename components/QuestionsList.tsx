// components/QuestionsList.tsx
'use client';

import { useState } from 'react';
import { useQuestions } from '@/hooks/useToiecApi';
import type { ToiecQuestion } from '@/hooks/useToiecApi';

interface QuestionsListProps {
  partId: string | null;
  onSelectQuestion?: (question: ToiecQuestion) => void;
  selectedQuestionId?: string;
}

export default function QuestionsList({ 
  partId, 
  onSelectQuestion, 
  selectedQuestionId 
}: QuestionsListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;
  const offset = currentPage * limit;

  const { questions, total, loading, error, refetch } = useQuestions(partId, limit, offset);

  const totalPages = Math.ceil(total / limit);

  if (!partId) {
    return (
      <div className="text-center p-8 text-gray-500">
        Vui lòng chọn một part để xem câu hỏi
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải câu hỏi...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 mb-2">Lỗi khi tải câu hỏi: {error}</div>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Không có câu hỏi nào cho part này
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Câu hỏi (Tổng: {total})
        </h2>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedQuestionId === question.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectQuestion?.(question)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">
                Câu {offset + index + 1}: {question.type}
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ID: {question.id}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-3 line-clamp-3">
              {question.content}
            </div>

            {question.options && question.options.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {question.options.map((option, optIndex) => (
                  <span
                    key={optIndex}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {option}
                  </span>
                ))}
              </div>
            )}

            {(question.audioUrl || question.imageUrl) && (
              <div className="flex gap-2 mt-2">
                {question.audioUrl && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    🎵 Audio
                  </span>
                )}
                {question.imageUrl && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    🖼️ Image
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            ← Trước
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
