"use client";

import React from 'react';
import { Shield, FileText, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function CompliancePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="glass rounded-[2.5rem] border border-slate-200 p-8 md:p-12 overflow-hidden relative shadow-xl shadow-slate-200/50">
                <div className="absolute -right-20 -top-20 opacity-[0.03] text-primary">
                    <Shield size={400} />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 rounded-full text-[9px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest shadow-sm">Compliance Validated</span>
                                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-tighter">Report_ID: <span className="text-slate-900">SC-2024-001</span></span>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 italic tracking-tight">HIPAA Compliance Report</h1>
                            <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-widest font-bold">Automated Security Assessment & Vulnerability Scan</p>
                        </div>
                        <Button className="font-bold text-[10px] uppercase tracking-widest px-10 h-14 bg-primary text-white shadow-lg shadow-primary/20 rounded-2xl group transition-all">
                            <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> Download PDF Artifact
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: 'Security Score', value: '98/100', status: 'Optimal', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Data Encryption', value: 'AES-256', status: 'Verified', color: 'text-primary', bg: 'bg-primary/5' },
                            { label: 'Access Control', value: 'RBAC/ABAC', status: 'Active', color: 'text-purple-600', bg: 'bg-purple-50' }
                        ].map((stat, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 shadow-sm group hover:scale-[1.02] transition-transform">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 px-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 italic tracking-tight">{stat.value}</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${stat.status === 'Optimal' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(48,213,200,0.5)]'}`} />
                                    <span className={`text-[10px] ${stat.color} uppercase font-black tracking-widest`}>{stat.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <FileText size={80} />
                            </div>
                            <h3 className="text-slate-900 font-bold uppercase tracking-widest text-[11px] mb-5 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" /> Executive Summary
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-mono italic font-medium">
                                <span className="text-primary mr-1 font-bold">{'>'}</span> SecureCare Platform has undergone a comprehensive automated compliance audit. All data at rest and in transit is encrypted using industry-standard protocols. Our Zero-Trust architecture ensures that every access request is verified. The latest vulnerability scan reveals a highly resilient posture with no critical findings.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center pt-8 border-t border-slate-100">
                        <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-primary uppercase text-[10px] font-black tracking-widest group">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Security Terminal
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
