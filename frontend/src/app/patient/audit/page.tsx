"use client";

import React from 'react';
import { Shield, Clock, Eye, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function PatientAuditPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Lock size={18} />
                    </div>
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest italic">Zero-Trust Audit</span>
                </div>
                <h1 className="text-3xl font-bold text-white italic">Who's Accessed Your Data?</h1>
                <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-tighter">Full transparency into medical record interactions</p>
            </div>

            <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                    {[
                        { actor: 'Dr. James Smith', action: 'RECORD_VIEW', reason: 'Clinical Consultation', date: '2024-03-20 10:35 AM', location: 'IP_172.16.0.45' },
                        { actor: 'PHARMACY_NODE', action: 'PRESCRIPTION_READ', reason: 'Issuance Fulfillment', date: '2024-03-18 04:12 PM', location: 'IP_INTERNAL' },
                        { actor: 'Dr. Elena Rossi', action: 'LAB_UPLOAD', reason: 'Laboratory Results', date: '2024-03-15 09:10 AM', location: 'IP_172.16.0.22' },
                        { actor: 'YOU', action: 'LOGIN_SUCCESS', reason: 'User Authenticated', date: '2024-03-20 02:24 PM', location: 'IP_CURRENT' }
                    ].map((log, i) => (
                        <div key={i} className="p-8 hover:bg-white/[0.02] transition-colors group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                        <Eye size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold italic text-sm italic">{log.actor}</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">{log.reason}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end">
                                    <p className="text-xs font-mono text-white tracking-widest uppercase italic">{log.action}</p>
                                    <p className="text-[10px] text-slate-600 font-mono mt-1">{log.date}</p>
                                </div>

                                <div className="md:border-l md:border-white/5 md:pl-8">
                                    <span className="text-[8px] font-mono text-slate-700 bg-white/[0.02] px-2 py-1 rounded border border-white/5">
                                        {log.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-white uppercase text-[10px] font-bold">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Return to Dashboard
                </Button>
            </div>
        </div>
    );
}
