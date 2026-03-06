"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { triageApi } from '@/lib/api';
import { Button } from '@/components/Button';
import { Shield, Activity, Calendar, ArrowRight, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';

function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resultId = searchParams.get('resultId');

    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!resultId) {
            router.push('/patient/triage');
            return;
        }

        const fetchResult = async () => {
            try {
                const res = await triageApi.getHistory();
                const currentResult = res.data.data.find((r: any) => r.id === resultId);
                setResult(currentResult);
            } catch (error) {
                console.error("Failed to fetch triage result", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResult();
    }, [resultId, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold italic mb-4 text-slate-900">Result Not Found</h2>
                <p className="text-slate-500 mb-8">We couldn't retrieve your assessment data. Please try again.</p>
                <Link href="/patient/triage">
                    <Button className="bg-primary text-white px-8 h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                        Start New Assessment
                    </Button>
                </Link>
            </div>
        );
    }

    const { riskLevel, recommendedSpecialist, totalScore, symptom } = result;

    const getRiskConfig = (level: string) => {
        switch (level) {
            case 'Emergency':
                return { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertTriangle, desc: 'Immediate medical attention is required. Please go to the nearest emergency department.' };
            case 'High':
                return { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: AlertTriangle, desc: 'Your symptoms indicate a high priority concern. We recommend booking a specialist consultation as soon as possible.' };
            case 'Moderate':
                return { color: 'text-primary', bg: 'bg-primary/10', icon: Info, desc: 'Your symptoms require professional evaluation in a non-emergency setting.' };
            default:
                return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle, desc: 'Low risk detected. Monitoring is advised, but routine care should suffice.' };
        }
    };

    const config = getRiskConfig(riskLevel);

    return (
        <div className="max-w-3xl mx-auto py-16 px-6 animate-in fade-in duration-700">
            <header className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Shield size={12} /> Assessment Result Secure
                </div>
                <h1 className="text-4xl font-bold font-display tracking-tight text-slate-900 italic mb-4">
                    Triage Summary
                </h1>
                <p className="text-slate-500 italic">Assessment for: <span className="text-slate-900 font-bold">{symptom.name}</span></p>
            </header>

            <div className={`p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 mb-10 overflow-hidden relative group bg-white`}>
                <div className={`absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform ${config.color}`}>
                    <Activity size={160} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Risk Assessment Score</span>
                            <div className="text-4xl font-bold italic text-slate-900 mt-1">{totalScore} <span className="text-sm font-normal text-slate-400 not-italic ml-2">Points</span></div>
                        </div>
                        <div className={`h-16 w-16 rounded-3xl ${config.bg} flex items-center justify-center ${config.color}`}>
                            <config.icon size={32} />
                        </div>
                    </div>

                    <div className="mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Calculated Risk Level</span>
                        <h2 className={`text-5xl font-bold font-display tracking-tight italic ${config.color}`}>
                            {riskLevel}
                        </h2>
                    </div>

                    <p className="text-slate-600 text-lg leading-relaxed italic mb-10 border-l-4 border-primary/20 pl-6">
                        {config.desc}
                    </p>

                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Recommended Pathway</span>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                <Activity size={20} />
                            </div>
                            <span className="text-xl font-bold italic text-slate-900">{recommendedSpecialist}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={`/patient/appointments?spec=${encodeURIComponent(recommendedSpecialist)}`}>
                    <Button className="w-full h-16 rounded-3xl bg-primary hover:opacity-90 shadow-xl shadow-primary/20 text-white font-bold uppercase tracking-widest text-[10px]">
                        Book Appointment <Calendar size={16} className="ml-2" />
                    </Button>
                </Link>
                <Link href="/patient">
                    <Button variant="outline" className="w-full h-16 rounded-3xl border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Close & Return <ArrowRight size={16} className="ml-2" />
                    </Button>
                </Link>
            </div>

            <p className="text-center mt-12 text-slate-400 text-[10px] uppercase font-mono tracking-widest px-10">
                This assessment is for informational purposes only and does not replace professional medical advice. If you are experiencing a life-threatening emergency, call emergency services immediately.
            </p>
        </div>
    );
}

export default function ResultPage() {
    return (
        <ProtectedRoute allowedRoles={['PATIENT']}>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
                <ResultContent />
            </Suspense>
        </ProtectedRoute>
    );
}
