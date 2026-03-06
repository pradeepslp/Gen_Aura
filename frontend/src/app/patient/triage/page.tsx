"use client";

import React, { useEffect, useState } from 'react';
import { triageApi } from '@/lib/api';
import { Heart, Activity, ArrowRight, Shield, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function SymptomSelection() {
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                const res = await triageApi.getSymptoms();
                setSymptoms(res.data.data);
            } catch (error) {
                console.error("Failed to fetch symptoms", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSymptoms();
    }, []);

    const filteredSymptoms = symptoms.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['PATIENT']}>
            <div className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Shield size={12} /> AI Symptom Triage
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 italic mb-4">
                        How are you feeling?
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto text-lg italic">
                        Select a symptom to begin your secure health assessment. Our clinical logic will guide you to the right care.
                    </p>
                </header>

                <div className="relative mb-12">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search symptoms (e.g. Fever, Chest Pain...)"
                        className="w-full h-16 pl-16 pr-8 rounded-3xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSymptoms.map((symptom) => (
                        <div
                            key={symptom.id}
                            onClick={() => router.push(`/patient/triage/assessment?symptomId=${symptom.id}`)}
                            className="glass p-8 rounded-[2rem] border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group relative overflow-hidden bg-white"
                        >
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform text-primary">
                                <Activity size={100} />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                        <Heart size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold italic text-slate-900">{symptom.name}</h3>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                            </div>
                        </div>
                    ))}

                    {filteredSymptoms.length === 0 && (
                        <div className="col-span-full py-20 text-center glass rounded-[2rem] border-dashed border-2 border-slate-200">
                            <p className="text-slate-400 italic">No symptoms found matching your search.</p>
                        </div>
                    )}
                </div>

                <div className="mt-20 text-center">
                    <Link href="/patient" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2 uppercase tracking-widest">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </ProtectedRoute>
    );
}
