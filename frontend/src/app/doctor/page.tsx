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
            <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-10 px-4 md:px-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight italic underline decoration-primary/30 underline-offset-8 decoration-2 text-slate-900">Clinical Portal</h1>
                        <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-xs">Patient Identity & Clinical Record Management</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-64"
                            />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Patient List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="glass rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <h2 className="font-bold uppercase tracking-wider text-sm">Assigned Patients</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {filteredPatients.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400 font-mono text-xs uppercase italic">
                                        No patients found matching your search.
                                    </div>
                                ) : filteredPatients.map((patient) => (
                                    <div key={patient.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-bold shadow-sm">
                                                {patient.patientProfile?.firstName ? patient.patientProfile.firstName.substring(0, 1).toUpperCase() : patient.email.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold italic group-hover:text-primary transition-colors text-slate-900">
                                                    {patient.patientProfile ? `${patient.patientProfile.firstName} ${patient.patientProfile.lastName}` : patient.email}
                                                </p>
                                                <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">UID: {patient.id.split('-')[0]}... • MEMBER SINCE {new Date(patient.createdAt).getFullYear()} • {patient.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-white">
                                            <Link href={`/doctor/patients/${patient.id}`}>
                                                <Button variant="outline" className="h-9 px-4 text-[10px] uppercase font-bold border-slate-200 hover:bg-primary hover:text-white transition-all text-slate-700">
                                                    <Clipboard className="h-3 w-3 mr-2" /> Records
                                                </Button>
                                            </Link>
                                            <Link href={`/doctor/prescribe/${patient.id}`}>
                                                <Button className="h-9 px-4 text-[10px] uppercase font-bold bg-primary shadow-lg shadow-primary/20 hover:opacity-90">
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
                        <div className="glass-accent p-6 rounded-2xl border border-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-primary">
                                <Activity className="h-24 w-24" />
                            </div>
                            <h3 className="font-bold uppercase tracking-widest text-[10px] mb-4">Daily Roundup</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <span className="text-xs text-slate-500">Consultations</span>
                                    <span className="text-sm font-bold text-slate-900">12</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <span className="text-xs text-slate-500">Reports Pending</span>
                                    <span className="text-sm font-bold text-amber-600">3</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <span className="text-xs text-slate-500">EMR Compliance</span>
                                    <span className="text-sm font-bold text-emerald-600">100%</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-slate-200">
                            <h3 className="font-bold uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                                <Clock className="h-3 w-3 text-primary" /> Recent Logins
                            </h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                                            <User className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
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
