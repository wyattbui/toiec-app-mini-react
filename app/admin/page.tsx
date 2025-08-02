// app/admin/page.tsx
'use client';

import { useState } from 'react';
import PartsList from '@/components/PartsList';
import QuestionsList from '@/components/QuestionsList';
import type { ToiecPart, ToiecQuestion } from '@/hooks/useToiecApi';

export default function AdminPage() {
  const [selectedPart, setSelectedPart] = useState<ToiecPart | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<ToiecQuestion | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-32">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Quản lý TOEIC - Parts và Câu hỏi
        </h1>

        <div className="space-y-8">
          {/* Parts List */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <PartsList
              onSelectPart={setSelectedPart}
              selectedPartId={selectedPart?.id}
            />
          </div>

          {/* Questions List */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <QuestionsList
              partId={selectedPart?.id || null}
              onSelectQuestion={setSelectedQuestion}
              selectedQuestionId={selectedQuestion?.id}
            />
          </div>
        </div>

        {/* Selected Question Detail */}
        {selectedQuestion && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Chi tiết câu hỏi
            </h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">ID:</span>
                <span className="ml-2 text-gray-600">{selectedQuestion.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Part ID:</span>
                <span className="ml-2 text-gray-600">{selectedQuestion.partId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Loại:</span>
                <span className="ml-2 text-gray-600">{selectedQuestion.type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Nội dung:</span>
                <div className="mt-1 p-3 bg-gray-50 rounded border">
                  {selectedQuestion.content}
                </div>
              </div>
              {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Lựa chọn:</span>
                  <ul className="mt-1 space-y-1">
                    {selectedQuestion.options.map((option, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-2">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Đáp án đúng:</span>
                <span className="ml-2 font-semibold text-green-600">
                  {selectedQuestion.correctAnswer}
                </span>
              </div>
              {selectedQuestion.audioUrl && (
                <div>
                  <span className="font-medium text-gray-700">Audio:</span>
                  <div className="mt-1">
                    <audio controls className="w-full max-w-md">
                      <source src={selectedQuestion.audioUrl} type="audio/mpeg" />
                      Trình duyệt không hỗ trợ audio
                    </audio>
                  </div>
                </div>
              )}
              {selectedQuestion.imageUrl && (
                <div>
                  <span className="font-medium text-gray-700">Hình ảnh:</span>
                  <div className="mt-1">
                    <img
                      src={selectedQuestion.imageUrl}
                      alt="Question image"
                      className="max-w-md rounded border"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
