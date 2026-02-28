"use client";

import React from 'react';
import { Plus, FileText, Send, ArrowLeft, Clipboard } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter, useParams } from 'next/navigation';

export default function PrescribePage() {
    const router = useRouter();
    const params = useParams();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div className="glass rounded-3xl border border-white/5 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Clipboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white italic">New Prescription</h1>
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-mono">Patient: {params.id || 'AUTHORIZING...'}</p>
                    </div>
                </div>

                <form className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Medication Name</label>
                        <input
                            type="text"
                            placeholder="NAME OF MEDICATION..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:border-primary/50 transition-all uppercase"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Dosage</label>
                            <input
                                type="text"
                                placeholder="E.G., 500MG..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:border-primary/50 transition-all uppercase"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Frequency</label>
                            <input
                                type="text"
                                placeholder="E.G., 2X DAILY..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:border-primary/50 transition-all uppercase"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Clinical Instructions</label>
                        <textarea
                            rows={4}
                            placeholder="SPECIAL INSTRUCTIONS FOR PATIENT..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:border-primary/50 transition-all uppercase"
                        />
                    </div>

                    <div className="pt-6">
                        <Button className="w-full bg-primary hover:bg-emerald-600 shadow-xl shadow-primary/20 text-xs font-bold uppercase tracking-widest h-14">
                            <Send className="h-4 w-4 mr-3" /> Digitally Sign & Issuance
                        </Button>
                    </div>
                </form>

                <div className="mt-12 flex justify-center">
                    <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-white uppercase text-[10px] font-bold">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Cancel Issuance
                    </Button>
                </div>
            </div>
        </div>
    );
}
