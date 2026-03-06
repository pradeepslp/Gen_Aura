"use client";

import React, { useEffect, useState, use } from 'react';
import {
    ChevronLeft,
    FileText,
    Upload,
    Calendar,
    Mail,
    User as UserIcon,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Plus,
    Clipboard,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { doctorApi, patientApi, appointmentApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: patientId } = use(params);
    const [patient, setPatient] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [reportUrl, setReportUrl] = useState("");
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientRes, reportsRes, appointmentsRes] = await Promise.all([
                    patientApi.getProfile(patientId),
                    doctorApi.getPatientReports(patientId),
                    appointmentApi.getPatientAppointments(patientId)
                ]);
                setPatient(patientRes.data.profile);
                setReports(reportsRes.data.reports);
                setAppointments(appointmentsRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch patient data", error);
                setMessage({ type: 'error', text: 'Failed to load patient data.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [patientId]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportUrl) return;

        setIsUploading(true);
        setMessage({ type: '', text: '' });

        try {
            await doctorApi.uploadLab({ patientId, reportUrl });
            setMessage({ type: 'success', text: 'Report uploaded successfully!' });
            setReportUrl("");
            // Refresh reports
            const reportsRes = await doctorApi.getPatientReports(patientId);
            setReports(reportsRes.data.reports);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload report' });
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-8 text-center min-h-screen pt-24 bg-white">
                <p className="text-slate-500">Patient not found.</p>
                <Link href="/doctor">
                    <Button variant="outline" className="mt-4">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['DOCTOR']}>
            <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-6">
                        <Link href="/doctor">
                            <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">Clinical Record</span>
                                <span className="text-slate-400 font-mono text-[10px]">UID: {patient.id.substring(0, 8)}...</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 italic">
                                {patient.firstName} {patient.lastName}
                            </h1>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/doctor/prescribe/${patient.id}`}>
                            <Button className="h-11 px-6 bg-primary shadow-lg shadow-primary/20 text-xs font-bold uppercase text-white hover:opacity-90">
                                <Plus className="h-4 w-4 mr-2" /> New Prescription
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Appointments History - New Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-primary" />
                                <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Secure Appointment History</h2>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {appointments.length === 0 ? (
                                    <div className="p-16 text-center text-slate-400 font-mono text-xs uppercase italic">
                                        No booked appointments found for this patient.
                                    </div>
                                ) : appointments.map((app) => (
                                    <div key={app.id} className="p-8 space-y-6 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Clipboard className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold italic text-slate-900">Case ID: {app.id.substring(0, 8)}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono uppercase italic">{new Date(app.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-widest">
                                                {app.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/50 p-6 rounded-2xl border border-slate-100">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Chief Complaints</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.chiefComplaint.map((c: string) => (
                                                            <span key={c} className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-md border border-red-100">{c}</span>
                                                        ))}
                                                    </div>
                                                    {app.complaintDetails && (
                                                        <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                            "{app.complaintDetails}"
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Current Medications</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.currentMedications.map((m: string) => (
                                                            <span key={m} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100">{m}</span>
                                                        ))}
                                                    </div>
                                                    {app.medicationDetails && (
                                                        <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                            "{app.medicationDetails}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Medical History</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.medicalHistory.map((h: string) => (
                                                            <span key={h} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200">{h}</span>
                                                        ))}
                                                    </div>
                                                    {app.historyDetails && (
                                                        <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                            "{app.historyDetails}"
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="pt-2 border-t border-slate-100">
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Verified Identity Data</p>
                                                    <div className="text-[10px] space-y-1">
                                                        <p><span className="text-slate-500">Contact:</span> <span className="font-bold">{app.contactNumber}</span></p>
                                                        <p><span className="text-slate-500">Address:</span> <span className="font-bold">{app.address}</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reports List */}
                        <div className="glass rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Clipboard className="h-5 w-5 text-primary" />
                                    <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Validated Diagnostic Results</h2>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                                    {reports.length} Records Found
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {reports.length === 0 ? (
                                    <div className="p-16 text-center text-slate-400 font-mono text-xs uppercase italic">
                                        No validated diagnostic results on file.
                                    </div>
                                ) : reports.map((report) => (
                                    <div key={report.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold italic group-hover:text-primary transition-colors text-slate-900">Lab Analysis Ref: {report.id.substring(0, 8)}</p>
                                                <p className="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-tighter">
                                                    Uploaded on {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" className="h-10 px-6 text-[10px] uppercase font-bold border-slate-200 hover:bg-primary hover:text-white transition-all text-slate-700">
                                                View Document
                                            </Button>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Patient Information Side Panel */}
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl border border-slate-200 space-y-8 shadow-sm">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <UserIcon className="h-5 w-5 text-primary" />
                                <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Medical Identity</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">Registered Email</p>
                                    <div className="flex items-center gap-2 text-slate-950">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium">{patient.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">Date of Birth</p>
                                    <div className="flex items-center gap-2 text-slate-950">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium">
                                            {patient.patientProfile?.dateOfBirth ? new Date(patient.patientProfile.dateOfBirth).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">Clinical Notes</p>
                                    <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 min-h-[100px]">
                                        {patient.patientProfile?.medicalNotes || "No clinical history documented."}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-primary/60 mb-2">
                                    <Shield className="h-3 w-3" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Security Protocol</span>
                                </div>
                                <p className="text-[9px] text-slate-500 font-mono leading-tight">
                                    END-TO-END ENCRYPTED ACCESS ACTIVATED. AUDIT LOGS FOR THIS SESSION ARE BEING RECORDED.
                                </p>
                            </div>
                        </div>

                        {/* Upload Form */}
                        <div className="glass p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <Upload className="h-5 w-5 text-primary" />
                                <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Add Investigation Result</h2>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="relative">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Source Repository URL</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="s3://clinical-data/archives/report-001.pdf"
                                            value={reportUrl}
                                            onChange={(e) => setReportUrl(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full font-mono placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={isUploading} className="bg-primary h-14 px-12 uppercase font-bold text-xs shadow-xl shadow-primary/30 min-w-full text-white hover:opacity-90">
                                        Process Result
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
