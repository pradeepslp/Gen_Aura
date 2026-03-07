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
    Clipboard,
    MousePointer2
} from 'lucide-react';
import { PatientProgressTracker } from '@/components/workflow';
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
    const [workflowRequests, setWorkflowRequests] = useState<any[]>([]);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                const res = await patientApi.getDashboardData(user.id);
                const { patient, reports, prescriptions, workflowRequests } = res.data.data;
                setProfile(patient);
                setLabs(reports);
                setPrescriptions(prescriptions);
                setWorkflowRequests(workflowRequests || []);
                if (workflowRequests && workflowRequests.length > 0) {
                    setSelectedWorkflowId(workflowRequests[0].id);
                }
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
                        <h1 className="text-3xl font-bold font-display tracking-tight italic underline decoration-primary/30 underline-offset-8 decoration-2">Patient Portal</h1>
                        <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-xs">Identity: {profile?.firstName} {profile?.lastName} • Account Secure</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <Lock size={12} /> Zero-Trust Access Active
                    </div>
                </header>

                {/* Vitals Section (Simulated Live) */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="h-5 w-5 text-primary" />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Live Monitoring Feed</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Heart Rate', value: profile?.vitals?.heartRate || '--', unit: 'bpm', status: profile?.vitals?.heartRate ? 'Recorded' : 'N/A', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
                            { label: 'Blood Pressure', value: profile?.vitals?.bloodPressure || '--/--', unit: 'mmHg', status: profile?.vitals?.bloodPressure ? 'Recorded' : 'N/A', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Blood Glucose', value: profile?.vitals?.bloodGlucose || '--', unit: 'mmol/L', status: profile?.vitals?.bloodGlucose ? 'Recorded' : 'N/A', icon: Dna, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        ].map((vital, i) => (
                            <div key={i} className="glass p-6 rounded-3xl relative overflow-hidden group border border-slate-100">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                    <vital.icon size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{vital.label}</span>
                                        <span className={vital.color + " text-[10px] font-bold uppercase tracking-widest"}>{vital.status}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold italic">{vital.value}</span>
                                        <span className="text-slate-400 text-xs font-mono uppercase">{vital.unit}</span>
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
                        <div className="glass rounded-3xl border border-slate-100 p-8">
                            <div className="flex items-center gap-2 mb-8">
                                <Clipboard className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold uppercase tracking-wider text-sm">Active Prescriptions</h3>
                            </div>
                            <div className="space-y-4">
                                {prescriptions.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 font-mono text-xs uppercase italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        No active prescriptions found in decentralized identity.
                                    </div>
                                ) : prescriptions.map((pres) => (
                                    <div key={pres.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold italic text-sm">{pres.medication}</h4>
                                                <p className="text-xs text-slate-500 mt-1 font-mono tracking-tight">{pres.dosage}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1 italic">Authorized Practitioner</p>
                                                <p className="text-xs font-bold text-slate-900">Dr. {pres.doctor?.doctorProfile?.lastName}</p>
                                                <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">{pres.doctor?.doctorProfile?.specialization || 'Clinical Specialist'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lab Reports */}
                        <div className="glass rounded-3xl border border-slate-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-bold uppercase tracking-wider text-sm">Encrypted Labs</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {labs.length === 0 ? (
                                    <div className="col-span-2 p-12 text-center text-slate-400 font-mono text-xs uppercase italic">
                                        No laboratory results available.
                                    </div>
                                ) : labs.map((report) => (
                                    <Link href={`/patient/labs/${report.id}`} key={report.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all cursor-pointer group flex items-start justify-between text-left">
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold italic truncate max-w-[140px] tracking-tight">{report.reportUrl.split('/').pop()}</h4>
                                                <p className="text-[10px] text-slate-500 mt-1 font-mono">{new Date(report.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-400 group-hover:text-primary transition-colors mt-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Secure Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-accent rounded-3xl p-8 border border-primary/20 relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 opacity-5 group-hover:scale-110 transition-transform text-primary">
                                <Activity size={120} />
                            </div>
                            <h3 className="font-bold font-display italic text-xl mb-4">Doctor Appointments</h3>
                            <p className="text-slate-600 text-sm italic font-medium leading-relaxed mb-6">
                                Unsure who to see? Use our secure AI triage to analyze your symptoms and find the right specialist.
                            </p>
                            <div className="space-y-3">
                                <Link href="/patient/doctors">
                                    <Button className="w-full bg-primary hover:opacity-90 shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest h-11 text-white">
                                        Direct Booking <ShieldCheck size={14} className="ml-2" />
                                    </Button>
                                </Link>
                                <Link href="/patient/appointments/book" className="block text-center text-[10px] font-bold uppercase tracking-widest text-primary hover:underline py-2">
                                    Book with Symptoms
                                </Link>
                            </div>
                        </div>

                        <div className="glass rounded-3xl p-8 border border-slate-100">
                            <ShieldCheck size={32} className="text-primary mb-6 animate-pulse" />
                            <h3 className="text-sm font-bold uppercase tracking-widest italic mb-2">Audit Status</h3>
                            <p className="text-slate-500 text-[10px] mb-6 leading-relaxed font-mono uppercase tracking-tighter">
                                Medical data access recorded: {prescriptions.length + labs.length} interactions logged.
                            </p>
                            <Link href="/patient/audit" className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1 uppercase tracking-widest">
                                View Security Log <ArrowRight size={10} />
                            </Link>
                        </div>

                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Encryption Standard</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono">AES-256-GCM / DH-2048-BIT-PRIME</p>
                        </div>
                    </div>
                </div>

                {/* Workflow Tracking Section */}
                <section className="mt-12">
                    <div className="flex items-center gap-2 mb-8">
                        <MousePointer2 className="h-5 w-5 text-primary" />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Inter-Department Workflow Status</h2>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                            <div className="glass rounded-2xl p-6 border border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Your Active Requests</h3>
                                <div className="space-y-2">
                                    {workflowRequests.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">No active workflow requests.</p>
                                    ) : (
                                        workflowRequests.map(req => (
                                            <button
                                                key={req.id}
                                                onClick={() => setSelectedWorkflowId(req.id)}
                                                className={`w-full text-left p-4 rounded-xl transition-all border ${selectedWorkflowId === req.id
                                                    ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20'
                                                    : 'bg-white border-slate-100 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="font-bold text-xs truncate">{req.title}</div>
                                                <div className="text-[10px] text-slate-500 mt-1 uppercase font-mono">{req.category}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            {selectedWorkflowId ? (
                                <PatientProgressTracker requestId={selectedWorkflowId} />
                            ) : (
                                <div className="h-64 glass rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                    <Clock size={40} className="mb-4 opacity-20" />
                                    <p className="text-sm font-medium italic">Select a request from the sidebar to track its real-time progress across hospital departments.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </ProtectedRoute>
    );
}
