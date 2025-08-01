// app/quiz/page.tsx
"use client";

import {useQuizStore} from '@/stores/useQuizStore';
import {useEffect, useState} from 'react';
import QuestionBlock from '@/components/QuestionBlock';
import AnswerSheet from '@/components/AnswerSheet';
import {useRouter} from 'next/navigation';
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import {Spin} from "antd";
import {ClockCircleOutlined} from "@ant-design/icons";

export default function QuizPage() {
    const {questions, setQuestions, currentIndex, next, answer, userAnswers} = useQuizStore();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [countDown, setCountDown] = useState(60);

    const {
        data,
        error,
        isLoading
    } = useSWR("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m", fetcher);

    console.log("------------------------");
    console.log("data", data);
    console.log("------------------------");

    useEffect(() => {
        if (countDown === 50) router.push('/result')

        if (countDown === 0) return;
        const timer = setInterval(() => {
            setCountDown((prev) => prev - 1);
        }, 1000);

        // Clear interval khi component unmount hoặc khi seconds = 0
        return () => clearInterval(timer);
    }, [countDown]);


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
        <Spin spinning={isLoading} tip="Loading" size="small">
            <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-12 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <h1 className="text-3xl font-bold text-green-700 text-center">TOEIC Luyện Tập</h1>
                    {/*<h1 className="text-3xl font-bold text-green-700 text-center">latitude: {data?.latitude}</h1>*/}
                    {/*<h1 className="text-3xl font-bold text-green-700 text-center">longitude: {data?.longitude}</h1>*/}
                    <h1 className="text-xl font-bold text-[#fcba03] text-center"><ClockCircleOutlined/><span
                        className="ml-2">{countDown ? countDown + " seconds" : " Overtime"} </span></h1>
                    <div
                        className="text-center text-sm text-blue-500">Part {currentIndex + 1} trong {questions.length}</div>
                    <QuestionBlock
                        question={current}
                        onAnswer={(ans) => answer(current.id, ans)}
                        selected={userAnswers[current.id]}
                        onNext={handleNext}
                    />
                    <AnswerSheet
                        total={questions.length}
                        current={currentIndex + 1}
                        onNext={handleNext}
                        userAnswers={userAnswers}
                    />
                </div>
            </div>
        </Spin>
    );
}