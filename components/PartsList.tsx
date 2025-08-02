// components/PartsList.tsx
'use client';

import { useParts } from '@/hooks/useToiecApi';
import type { ToiecPart } from '@/hooks/useToiecApi';

interface PartsListProps {
  onSelectPart?: (part: ToiecPart) => void;
  selectedPartId?: string;
}

export default function PartsList({ onSelectPart, selectedPartId }: PartsListProps) {
  const { parts, loading, error, refetch } = useParts();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải danh sách parts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 mb-2">Lỗi khi tải danh sách parts: {error}</div>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Không có parts nào được tìm thấy
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Danh sách Parts TOEIC
      </h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {parts.map((part) => (
          <div
            key={part.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedPartId === part.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectPart?.(part)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">{part.name}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {part.totalQuestions} câu
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {part.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
