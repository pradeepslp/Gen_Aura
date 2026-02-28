"use client";

import React from 'react';
import { Shield, FileText, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function CompliancePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="glass rounded-3xl border border-white/5 p-8 md:p-12 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 opacity-5">
                    <Shield size={300} />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">Compliance</span>
                                <span className="text-slate-500 font-mono text-[10px]">REPORT_ID: SC-2024-001</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white italic">HIPAA Compliance Report</h1>
                            <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-tighter">Automated Security Assessment & Vulnerability Scan</p>
                        </div>
                        <Button className="font-mono text-xs uppercase tracking-widest px-8">
                            <Download className="h-4 w-4 mr-2" /> Download PDF Artifact
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: 'Security Score', value: '98/100', status: 'Optimal' },
                            { label: 'Data Encryption', value: 'AES-256', status: 'Verified' },
                            { label: 'Access Control', value: 'RBAC/ABAC', status: 'Active' }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-white italic">{stat.value}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span className="text-[10px] text-primary uppercase font-bold">{stat.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" /> Executive Summary
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-mono italic">
                                SecureCare Platform has undergone a comprehensive automated compliance audit. All data at rest and in transit is encrypted using industry-standard protocols. Our Zero-Trust architecture ensures that every access request is verified.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-white uppercase text-[10px] font-bold">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
