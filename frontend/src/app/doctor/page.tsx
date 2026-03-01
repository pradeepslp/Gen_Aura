"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Users,
    FileText,
    Plus,
    Search,
    Clipboard,
    Activity,
    Clock,
    User,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/Button';
import { doctorApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DoctorDashboard() {
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await doctorApi.getPatients();
                setPatients(res.data.patients);
            } catch (error) {
                console.error("Failed to fetch patients", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['DOCTOR']}>
            <div className="space-y-8 animate-in fade-in duration-500">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-white italic underline decoration-primary/30 underline-offset-8 decoration-2">Clinical Portal</h1>
                        <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-xs">Patient Identity & Clinical Record Management</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-64"
                            />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Patient List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <h2 className="font-bold text-white uppercase tracking-wider text-sm">Assigned Patients</h2>
                            </div>
                            <div className="divide-y divide-white/5">
                                {filteredPatients.length === 0 ? (
                                    <div className="p-12 text-center text-slate-500 font-mono text-xs uppercase italic">
                                        No patients found matching your search.
                                    </div>
                                ) : filteredPatients.map((patient) => (
                                    <div key={patient.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center text-primary font-bold shadow-lg">
                                                {patient.email.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold italic group-hover:text-primary transition-colors">{patient.email}</p>
                                                <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">UID: {patient.id.split('-')[0]}... • MEMBER SINCE {new Date(patient.createdAt).getFullYear()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/doctor/patients/${patient.id}`}>
                                                <Button variant="outline" className="h-9 px-4 text-[10px] uppercase font-bold border-white/5 hover:bg-primary hover:text-white transition-all">
                                                    <Clipboard className="h-3 w-3 mr-2" /> Records
                                                </Button>
                                            </Link>
                                            <Link href={`/doctor/prescribe/${patient.id}`}>
                                                <Button className="h-9 px-4 text-[10px] uppercase font-bold bg-primary shadow-lg shadow-primary/20">
                                                    <Plus className="h-3 w-3 mr-2" /> Prescribe
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats & Actions */}
                    <div className="space-y-6">
                        <div className="glass-accent p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Activity className="h-24 w-24" />
                            </div>
                            <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Daily Roundup</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                    <span className="text-xs text-slate-400">Consultations</span>
                                    <span className="text-sm font-bold text-white">12</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                    <span className="text-xs text-slate-400">Reports Pending</span>
                                    <span className="text-sm font-bold text-amber-500">3</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                    <span className="text-xs text-slate-400">EMR Compliance</span>
                                    <span className="text-sm font-bold text-green-500">100%</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-white/5">
                            <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                                <Clock className="h-3 w-3 text-primary" /> Recent Logins
                            </h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
                                            <User className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary/40 w-3/4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
