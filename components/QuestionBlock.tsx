// components/QuestionBlock.tsx
import React from 'react';
import {Button} from "antd";

interface Props {
    question: {
        id: string;
        text: string;
        options: string[];
    };
    onAnswer: (answer: string) => void;
    selected?: string;
    onNext: () => void;

}

export default function QuestionBlock({question, onAnswer, selected, onNext}: Props) {
    return (
        <div className="space-y-6">
            <div className="text-lg font-medium text-gray-800">
                <span className="text-green-600 font-bold">Câu hỏi:</span> {question.text}
            </div>
            <div className="grid grid-cols-1 gap-4">
                {question.options.map((opt, idx) => (
                    <Button
                        key={idx}
                        onClick={() => {
                            onAnswer(opt)
                            onNext()
                        }}
                        className={`px-4 py-3 text-left border rounded-xl transition-all ${
                            selected === opt ? 'bg-green-100 border-green-500 text-green-900 font-semibold shadow-sm' : 'hover:bg-gray-50'
                        }`}
                    >
                        {String.fromCharCode(65 + idx)}. {opt}
                    </Button>
                ))}
            </div>
        </div>
    );
}