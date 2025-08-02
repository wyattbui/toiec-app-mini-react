// app/quiz/page.tsx
"use client";

import {useQuizStore} from '@/stores/useQuizStore';
import {useEffect, useState, Suspense} from 'react';
import QuestionBlock from '@/components/QuestionBlock';
import AnswerSheet from '@/components/AnswerSheet';
import {useRouter} from 'next/navigation';
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import {Spin} from "antd";
import {ClockCircleOutlined} from "@ant-design/icons";
import { useSearchParams } from 'next/navigation';
import config from '@/lib/config';

function QuizContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const part = searchParams.get('part');
    if (!part) {
        router.push('/')
    }
    const {questions, setQuestions, currentIndex, next, answer, userAnswers} = useQuizStore();
    const [loading, setLoading] = useState(true);
    const [countDown, setCountDown] = useState(60);
    const { data, error, isLoading } = useSWR(
        part ? `${config.BE_SERVER}/questions/part/${part}` : null, 
        fetcher
    );

    console.log("------------------------");
    console.log("data", data);
    console.log("------------------------");

    useEffect(() => {
        if (countDown === 0) router.push('/result')

        if (countDown === 0) return;
        const timer = setInterval(() => {
            setCountDown((prev) => prev - 1);
        }, 1000);

        // Clear interval khi component unmount hoặc khi seconds = 0
        return () => clearInterval(timer);
    }, [countDown]);


    useEffect(() => {
        if (data) {
            // Xử lý cấu trúc dữ liệu từ backend API
            const questions = Array.isArray(data) ? data : (data.questions || data.data || []);
            setQuestions(questions);
            setLoading(false);
        }
    }, [data, setQuestions]);

    if (loading || isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Spin size="large" />
                <div className="mt-4 text-gray-600">Đang tải câu hỏi...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-red-600">
                <p>Lỗi khi tải câu hỏi: {error.message}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );

    if (!questions.length) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-gray-600">
                <p>Không có câu hỏi nào cho part này</p>
            </div>
        </div>
    );

    const current = questions[currentIndex];
    const handleNext = () => {
        if (currentIndex === questions.length - 1) {
            router.push('/result');
        } else {
            next();
        }
    };
    return (
        <Spin spinning={isLoading} tip="Đang tải...">
            <div className="min-h-screen pt-28 pb-8 px-4" style={{ backgroundColor: '#f0fdfa' }}>
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0d9488' }}>
                                    TOEIC Luyện Tập
                                </h1>
                                <div className="text-sm text-gray-600 mt-1">
                                    Part {part} - Câu {currentIndex + 1} trong {questions.length}
                                </div>
                            </div>
                            
                            {/* Timer */}
                            <div className="flex items-center justify-center bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                                <ClockCircleOutlined className="text-orange-500 mr-2" />
                                <span className="font-bold text-orange-600">
                                    {countDown > 0 ? `${countDown} giây` : "Hết thời gian"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Question Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <QuestionBlock
                                    question={current}
                                    onAnswer={(ans) => answer(current.id, ans)}
                                    selected={userAnswers[current.id]}
                                    onNext={handleNext}
                                />
                            </div>
                        </div>

                        {/* Answer Sheet Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                                <AnswerSheet
                                    total={questions.length}
                                    current={currentIndex + 1}
                                    onNext={handleNext}
                                    userAnswers={userAnswers}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-32">
            <Spin size="large" />
        </div>}>
            <QuizContent />
        </Suspense>
    );
}