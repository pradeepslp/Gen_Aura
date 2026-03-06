"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Users,
    Search,
    Upload,
    FileText,
    Activity,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Clipboard
} from 'lucide-react';
import { Button } from '@/components/Button';
import { labApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function LabTechnicianDashboard() {
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await labApi.getPatients();
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
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.patientProfile && `${p.patientProfile.firstName} ${p.patientProfile.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['LAB_TECHNICIAN']}>
            <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-10 px-4 md:px-8">
                <header>
                    <h1 className="text-3xl font-bold font-display tracking-tight italic underline decoration-primary/30 underline-offset-8 decoration-2 text-center md:text-left text-slate-900">Laboratory Information System</h1>
                    <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-xs text-center md:text-left">Diagnostics & Result Management Portal</p>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    <div className="glass rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <h2 className="font-bold uppercase tracking-wider text-sm">Patient Directory</h2>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full"
                                />
                            </div>
                        </div>

                        {message.text && (
                            <div className={`m-6 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-600' : 'bg-red-500/10 border border-red-500/20 text-red-600'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        <div className="divide-y divide-slate-100">
                            {filteredPatients.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-mono text-xs uppercase italic">
                                    No patients found in the system.
                                </div>
                            ) : filteredPatients.map((patient) => (
                                <div key={patient.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
                                            {patient.patientProfile?.firstName ? patient.patientProfile.firstName.substring(0, 1).toUpperCase() : patient.email.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold italic group-hover:text-primary transition-colors text-slate-900">
                                                {patient.patientProfile ? `${patient.patientProfile.firstName} ${patient.patientProfile.lastName}` : patient.email}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">UID: {patient.id.split('-')[0]}... • {patient.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 text-white">
                                        <Link href={`/lab-technician/patients/${patient.id}`}>
                                            <Button variant="outline" className="h-9 px-6 text-[10px] uppercase font-bold border-slate-200 hover:bg-primary hover:text-white transition-all text-slate-700">
                                                <Clipboard className="h-3 w-3 mr-2" /> View Diagnostics
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
