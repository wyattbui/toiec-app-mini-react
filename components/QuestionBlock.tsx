// components/QuestionBlock.tsx
import React from 'react';
import {Button} from "antd";

interface Option {
    id: number;
    questionId: number;
    optionLetter: string;
    optionText: string;
    isCorrect: boolean;
}

interface Part {
    id: number;
    partNumber: number;
    name: string;
    description: string;
    skillType: string;
}

interface Props {
    question: {
        id: number;
        createdAt: string;
        updatedAt: string;
        partId: number;
        questionText: string;
        questionType: string;
        difficulty: string;
        explanation: string;
        audioUrl?: string;
        imageUrl?: string;
        passageText?: string;
        passageTitle?: string;
        options: Option[];
        part: Part;
    };
    onAnswer: (answer: string) => void;
    selected?: string;
    onNext: () => void;
}

export default function QuestionBlock({question, onAnswer, selected, onNext}: Props) {
    return (
        <div className="space-y-6">
            {/* Question Text */}
            <div className="text-lg font-medium text-gray-800">
                <span className="text-green-600 font-bold">Câu hỏi:</span> {question.questionText}
            </div>

            {/* Part Info */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>Part {question.part.partNumber}: {question.part.name}</strong>
                <div className="text-xs mt-1">{question.part.description}</div>
            </div>

            {/* Image */}
            {question.imageUrl && (
                <div className="flex justify-center">
                    <img 
                        src={question.imageUrl} 
                        alt="Question image" 
                        className="max-w-full h-auto rounded-lg shadow-md"
                    />
                </div>
            )}

            {/* Audio */}
            {question.audioUrl && (
                <div className="flex justify-center">
                    <audio 
                        controls 
                        src={question.audioUrl}
                        className="w-full max-w-md"
                    />
                </div>
            )}

            {/* Options */}
            <div className="space-y-4">
                <div className="text-sm font-medium text-gray-700">Chọn đáp án:</div>
                <div className="grid grid-cols-1 gap-4">
                    {question.options.map((opt) => (
                        <Button
                            key={opt.id}
                            onClick={() => {
                                onAnswer(opt.optionLetter); // Truyền optionLetter (A, B, C, D)
                                onNext();
                            }}
                            className={`px-6 py-4 text-left border rounded-xl transition-all duration-200 h-auto min-h-[60px] ${
                                selected === opt.optionLetter ? 
                                'bg-green-100 border-green-500 text-green-900 font-semibold shadow-md scale-105' : 
                                'hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            style={{
                                fontSize: '15px',
                                lineHeight: '1.4'
                            }}
                        >
                            <div className="flex items-start space-x-3">
                                <span className="flex-shrink-0 font-bold text-teal-600">
                                    {opt.optionLetter}.
                                </span>
                                <span className="flex-1">
                                    {opt.optionText}
                                </span>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Explanation (if needed) */}
            {question.explanation && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <strong>Gợi ý:</strong> {question.explanation}
                </div>
            )}
        </div>
    );
}