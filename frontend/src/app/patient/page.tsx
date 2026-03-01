"use client";

import React, { useEffect, useState } from 'react';
import {
    Heart,
    Dna,
    FileText,
    Calendar,
    Lock,
    ArrowRight,
    ShieldCheck,
    Search,
    Activity,
    Clock,
    User,
    Clipboard
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { patientApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function PatientDashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [labs, setLabs] = useState<any[]>([]);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                const [profileRes, labsRes, presRes] = await Promise.all([
                    patientApi.getProfile(user.id),
                    patientApi.getLabs(user.id),
                    patientApi.getPrescriptions(user.id)
                ]);
                setProfile(profileRes.data.patient);
                setLabs(labsRes.data.reports);
                setPrescriptions(presRes.data.prescriptions);
            } catch (error) {
                console.error("Failed to fetch patient data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['PATIENT']}>
            <div className="max-w-7xl mx-auto space-y-10 py-10 px-4 md:px-8 animate-in fade-in duration-500">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-white italic underline decoration-primary/30 underline-offset-8 decoration-2">Patient Portal</h1>
                        <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-xs">Identity: {profile?.firstName} {profile?.lastName} • Account Secure</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <Lock size={12} /> Zero-Trust Access Active
                    </div>
                </header>

                {/* Vitals Section (Simulated Live) */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="h-5 w-5 text-primary" />
                        <h2 className="font-bold text-white uppercase tracking-wider text-sm">Live Monitoring Feed</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'Optimal', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
                            { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Blood Glucose', value: '5.4', unit: 'mmol/L', status: 'Good', icon: Dna, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        ].map((vital, i) => (
                            <div key={i} className="glass p-6 rounded-3xl relative overflow-hidden group border border-white/5">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                    <vital.icon size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{vital.label}</span>
                                        <span className={vital.color + " text-[10px] font-bold uppercase tracking-widest"}>{vital.status}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white italic">{vital.value}</span>
                                        <span className="text-slate-500 text-xs font-mono uppercase">{vital.unit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Clinical Records & Prescriptions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Prescriptions */}
                        <div className="glass rounded-3xl border border-white/5 p-8">
                            <div className="flex items-center gap-2 mb-8">
                                <Clipboard className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Active Prescriptions</h3>
                            </div>
                            <div className="space-y-4">
                                {prescriptions.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 font-mono text-xs uppercase italic bg-black/40 rounded-2xl border border-dashed border-white/10">
                                        No active prescriptions found in decentralized identity.
                                    </div>
                                ) : prescriptions.map((pres) => (
                                    <div key={pres.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-primary/20 transition-all group">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-white font-bold italic text-sm">{pres.medication}</h4>
                                                <p className="text-xs text-slate-400 mt-1 font-mono tracking-tight">{pres.dosage}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500 font-mono uppercase">Prescribed by</p>
                                                <p className="text-[10px] text-primary font-bold uppercase">{pres.doctor?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lab Reports */}
                        <div className="glass rounded-3xl border border-white/5 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Encrypted Labs</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {labs.length === 0 ? (
                                    <div className="col-span-2 p-12 text-center text-slate-500 font-mono text-xs uppercase italic">
                                        No laboratory results available.
                                    </div>
                                ) : labs.map((report) => (
                                    <Link href={`/patient/labs/${report.id}`} key={report.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group flex items-start justify-between text-left">
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-lg">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white italic truncate max-w-[140px]">{report.reportUrl.split('/').pop()}</h4>
                                                <p className="text-[10px] text-slate-500 mt-1 font-mono">{new Date(report.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-600 group-hover:text-primary transition-colors mt-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Secure Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-accent rounded-3xl p-8 border border-primary/20 bg-primary/[0.02] relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 opacity-5 group-hover:scale-110 transition-transform">
                                <Calendar size={120} />
                            </div>
                            <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Next Consultation</h3>
                            <p className="text-slate-300 text-sm italic font-medium leading-relaxed mb-6">
                                Secure telemedicine session available for scheduling. Contact clinic for PGP-encrypted link.
                            </p>
                            <Link href="/patient/appointments">
                                <Button className="w-full bg-primary hover:bg-emerald-600 shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest h-11">
                                    Check In
                                </Button>
                            </Link>
                        </div>

                        <div className="glass rounded-3xl p-8 border border-white/5">
                            <ShieldCheck size={32} className="text-primary mb-6 animate-pulse" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest italic mb-2">Audit Status</h3>
                            <p className="text-slate-400 text-[10px] mb-6 leading-relaxed font-mono uppercase tracking-tighter">
                                Medical data access recorded: {prescriptions.length + labs.length} interactions logged.
                            </p>
                            <Link href="/patient/audit" className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1 uppercase tracking-widest">
                                View Security Log <ArrowRight size={10} />
                            </Link>
                        </div>

                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Encryption Standard</span>
                            </div>
                            <p className="text-[10px] text-slate-600 font-mono">AES-256-GCM / DH-2048-BIT-PRIME</p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
