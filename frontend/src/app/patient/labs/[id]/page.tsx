"use client";

import React from 'react';
import { FileText, Shield, Download, ArrowLeft, Activity } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter, useParams } from 'next/navigation';

export default function LabResultsPage() {
    const router = useRouter();
    const params = useParams();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="glass rounded-3xl border border-white/5 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 opacity-5">
                    <Activity size={200} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">Lab Report</span>
                                <span className="text-slate-500 font-mono text-[10px]">ID: {params.id || 'N/A'}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white italic">Laboratory Findings</h1>
                            <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-tighter">Encrypted Digital Artifact</p>
                        </div>
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 text-[10px] uppercase font-bold tracking-widest">
                            <Download className="h-4 w-4 mr-2" /> Secure Export
                        </Button>
                    </div>

                    <div className="p-8 rounded-2xl bg-black/40 border border-white/5 mb-12 font-mono">
                        <div className="grid grid-cols-2 gap-8 text-[10px] uppercase tracking-widest mb-8 border-b border-white/5 pb-8">
                            <div>
                                <p className="text-slate-600 mb-2">Test Category</p>
                                <p className="text-white font-bold italic">Hematology Panel</p>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-2">Date Collected</p>
                                <p className="text-white font-bold italic">2024-03-15</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { name: 'Hemoglobin', value: '14.2 g/dL', range: '13.5-17.5', status: 'In Range' },
                                { name: 'White Blood Cell', value: '6.4 K/uL', range: '4.5-11.0', status: 'In Range' },
                                { name: 'Platelets', value: '245 K/uL', range: '150-450', status: 'In Range' },
                            ].map((result, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                                    <div>
                                        <p className="text-white font-bold italic">{result.name}</p>
                                        <p className="text-slate-600 text-[8px] mt-1">REFERENCE RANGE: {result.range}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-primary font-bold italic">{result.value}</p>
                                        <span className="text-[8px] text-primary/50 uppercase font-bold tracking-tighter">{result.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-accent p-6 rounded-2xl border border-primary/20 bg-primary/5">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                            <Shield className="h-3 w-3" /> Digital Signature Verified
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tight last:">
                            This report has been cryptographically signed by CLINIC_NODE_04 and verified on the SecureCare Blockchain Ledger.
                        </p>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-white uppercase text-[10px] font-bold">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Medical File
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
