"use client";

import React from 'react';
import { User, Activity, Clipboard, FileText, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter, useParams } from 'next/navigation';

export default function PatientRecordsPage() {
    const router = useRouter();
    const params = useParams();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="glass rounded-3xl border border-white/5 p-8 md:p-12 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="h-24 w-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl">
                        <User size={48} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">Authorized Access</span>
                            <span className="text-slate-500 font-mono text-[10px]">RECORDS_ID: {params.id || 'N/A'}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white italic">Detailed Clinical Record</h1>
                        <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-tighter">Full history, prescriptions, and lab results</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass rounded-3xl border border-white/5 p-8">
                        <h2 className="text-lg font-bold text-white uppercase tracking-widest italic mb-6 flex items-center gap-3">
                            <Clipboard className="text-primary h-5 w-5" /> Medical History
                        </h2>
                        <div className="space-y-6">
                            {[
                                { date: '2024-01-15', event: 'Annual Physical', doctor: 'Dr. James Smith', notes: 'Patient is in good health overall.' },
                                { date: '2023-11-20', event: 'Blood Work Analysis', doctor: 'Dr. Sarah Wilson', notes: 'All levels within normal range.' }
                            ].map((event, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-mono text-slate-500">{event.date}</p>
                                        <p className="text-[10px] font-bold text-primary uppercase italic">{event.doctor}</p>
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-2 italic underline decoration-primary/20">{event.event}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-mono italic">{event.notes}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass rounded-3xl p-8 border border-white/5">
                        <Shield size={32} className="text-primary mb-6" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest italic mb-2">Security Status</h3>
                        <p className="text-slate-400 text-[10px] mb-6 leading-relaxed font-mono uppercase tracking-tighter">
                            This record is encrypted using AES-256. Access is logged for audit purposes.
                        </p>
                        <Button variant="outline" className="w-full text-[10px] uppercase font-bold h-11 border-white/5">
                            Revoke Access
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-white uppercase text-[10px] font-bold">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Clinical Portal
                </Button>
            </div>
        </div>
    );
}
