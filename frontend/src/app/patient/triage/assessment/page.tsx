"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { triageApi } from '@/lib/api';
import { Button } from '@/components/Button';
import { Shield, ChevronRight, ChevronLeft, CheckCircle2, Activity } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AssessmentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const symptomId = searchParams.get('symptomId');

    const [questions, setQuestions] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!symptomId) {
            router.push('/patient/triage');
            return;
        }

        const fetchQuestions = async () => {
            try {
                const res = await triageApi.getQuestions(symptomId);
                setQuestions(res.data.data);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [symptomId, router]);

    const handleAnswerSelect = (questionId: string, answerId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const nextStep = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const answerIds = Object.values(answers);
            const res = await triageApi.evaluate({ symptomId: symptomId!, answers: answerIds });
            router.push(`/patient/triage/result?resultId=${res.data.data.id}`);
        } catch (error) {
            console.error("Failed to submit assessment", error);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;
    const isLastStep = currentStep === questions.length - 1;
    const isAnswered = currentQuestion && answers[currentQuestion.id];

    return (
        <div className="max-w-3xl mx-auto py-16 px-6 animate-in fade-in duration-700">
            <header className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <Shield size={12} /> Clinical Assessment
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Question {currentStep + 1} of {questions.length}
                    </span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            <div className="min-h-[400px]">
                <h2 className="text-3xl font-bold italic text-slate-900 mb-10 leading-snug">
                    {currentQuestion?.text}
                </h2>

                <div className="space-y-4">
                    {currentQuestion?.answers.map((answer: any) => (
                        <div
                            key={answer.id}
                            onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group flex items-center justify-between ${answers[currentQuestion.id] === answer.id
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                                    : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-white'
                                }`}
                        >
                            <span className={`text-lg font-medium italic ${answers[currentQuestion.id] === answer.id ? 'text-primary' : 'text-slate-600'}`}>
                                {answer.text}
                            </span>
                            {answers[currentQuestion.id] === answer.id ? (
                                <CheckCircle2 className="text-primary" size={24} />
                            ) : (
                                <div className="h-6 w-6 rounded-full border-2 border-slate-200 group-hover:border-slate-300" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <footer className="mt-16 flex items-center justify-between gap-4">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex-1 h-16 rounded-3xl border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[10px]"
                >
                    <ChevronLeft size={16} /> Previous
                </Button>

                {isLastStep ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={!isAnswered || isSubmitting}
                        className="flex-[2] h-16 rounded-3xl bg-primary hover:opacity-90 shadow-xl shadow-primary/20 text-white font-bold uppercase tracking-widest text-[10px]"
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>Analyze Results <Activity size={16} className="ml-2" /></>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={nextStep}
                        disabled={!isAnswered}
                        className="flex-[2] h-16 rounded-3xl bg-primary hover:opacity-90 shadow-xl shadow-primary/20 text-white font-bold uppercase tracking-widest text-[10px]"
                    >
                        Next Question <ChevronRight size={16} className="ml-2" />
                    </Button>
                )}
            </footer>
        </div>
    );
}

export default function AssessmentPage() {
    return (
        <ProtectedRoute allowedRoles={['PATIENT']}>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
                <AssessmentContent />
            </Suspense>
        </ProtectedRoute>
    );
}
