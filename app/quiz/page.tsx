// app/quiz/page.tsx
"use client";

import {useQuizStore} from '@/stores/useQuizStore';
import {useEffect, useState, Suspense} from 'react';
import QuestionBlock from '@/components/QuestionBlock';
import AnswerSheet from '@/components/AnswerSheet';
import {useRouter} from 'next/navigation';
import {Spin} from "antd";
import {ClockCircleOutlined} from "@ant-design/icons";
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import config from '@/lib/config';

function QuizContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { token } = useAuth();
    const part = searchParams.get('part');
    
    if (!part) {
        router.push('/')
    }
    let countDownInit = 60;
    switch (part) {
        case '1':
            countDownInit = 240; // 1 minute for Part 1
            break;
        case '2':
            countDownInit = 600; // 1.5 minutes for Part 2
            break;
        case '3':
            countDownInit = 900; // 2 minutes for Part 3
            break;
        case '4':
            countDownInit = 900; // 2.5 minutes for Part 4
            break;
        case '5':
            countDownInit = 180; // 3 minutes for Part 5
            break;
        case '6':
            countDownInit = 210; // 3.5 minutes for Part 6
            break;
        case '7':
            countDownInit = 240; // 4 minutes for Part 7
            break;
        default:
            countDownInit = 60; // Default to 1 minute if part is not recognized
    }
    
    const {questions, setQuestions, currentIndex, next, answer, userAnswers} = useQuizStore();
    const [loading, setLoading] = useState(true);
    const [countDown, setCountDown] = useState(countDownInit    );
    const [testSet, setTestSet] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Generate test set when component mounts
    useEffect(() => {
        if (!token) {
            console.log('No token found, redirecting to login');
            router.push('/auth/login');
            return;
        }
        generateTestSet();
    }, [part, token, router]);

    const generateTestSet = async () => {
        if (!part || !token) {
            console.log('Missing part or token:', { part, token: token ? 'exists' : 'missing' });
            if (!token) {
                setError('Bạn cần đăng nhập để tạo bộ đề thi');
                return;
            }
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            console.log('Generating test set with:', {
                part: parseInt(part),
                token: token ? token.substring(0, 20) + '...' : 'missing'
            });
            
            const response = await fetch(`${config.BE_SERVER}/questions/test-sets/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    partId: parseInt(part),
                    title: `Practice Test Part ${part}`,
                    description: `Practice test for Part ${part}`,
                    questionCount: 10,
                    timeLimit: 600, // 10 minutes
                    difficulty: 'easy'
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("------------------------");
            console.log("Generated test set:", data);
            console.log("------------------------");
            
            setTestSet(data);
            
            // Extract questions from test set
            const testQuestions = data.questions?.map((tq: any) => tq.question) || [];
            setQuestions(testQuestions);
            
        } catch (err) {
            console.error('Error generating test set:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate test set');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (countDown === 0) router.push('/result')

        if (countDown === 0) return;
        const timer = setInterval(() => {
            setCountDown((prev) => prev - 1);
        }, 1000);

        // Clear interval khi component unmount hoặc khi seconds = 0
        return () => clearInterval(timer);
    }, [countDown, router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Spin size="large" />
                <div className="mt-4 text-gray-600">Đang tạo bộ đề thi...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-red-600">
                <p>Lỗi khi tạo bộ đề thi: {error}</p>
                <button 
                    onClick={() => generateTestSet()} 
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
        <Spin spinning={loading} tip="Đang tải...">
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