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
    Activity,
    Clipboard,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { labApi, patientApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function LabPatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: patientId } = use(params);
    const [patient, setPatient] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [reportUrl, setReportUrl] = useState("");
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientRes = await patientApi.getProfile(patientId);
                setPatient(patientRes.data.profile);

                const labsRes = await patientApi.getLabs(patientId);
                setReports(labsRes.data.reports);

            } catch (error) {
                console.error("Failed to fetch patient data", error);
                setMessage({ type: 'error', text: 'Failed to load patient profile for diagnostics.' });
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
            await labApi.uploadReport({ patientId, reportUrl });
            setMessage({ type: 'success', text: 'Diagnostic report processed and filed successfully!' });
            setReportUrl("");
            // Refresh reports
            const labsRes = await patientApi.getLabs(patientId);
            setReports(labsRes.data.reports);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to file report' });
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
                <p className="text-slate-500">Patient identity not found in diagnostics database.</p>
                <Link href="/lab-technician">
                    <Button variant="outline" className="mt-4">Return to Laboratory Portal</Button>
                </Link>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['LAB_TECHNICIAN']}>
            <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-6">
                        <Link href="/lab-technician">
                            <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">Diagnostic Portal</span>
                                <span className="text-slate-400 font-mono text-[10px]">SUBJECT_ID: {patient.id.substring(0, 8)}...</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 italic">
                                {patient.patientProfile?.firstName} {patient.patientProfile?.lastName}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                                <Activity className="h-3 w-3" /> READY FOR FILING
                            </span>
                        </div>
                    </div>
                </header>

                {message.text && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-600' : 'bg-red-500/10 border border-red-500/20 text-red-600'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Patient Information */}
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl border border-slate-200 space-y-8 shadow-sm">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <UserIcon className="h-5 w-5 text-primary" />
                                <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Subject Metadata</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">Verified Email</p>
                                    <div className="flex items-center gap-2 text-slate-950">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium">{patient.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">Registration Date</p>
                                    <div className="flex items-center gap-2 text-slate-950">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium">{new Date(patient.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-primary/60 mb-2">
                                    <Shield className="h-3 w-3" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Laboratory Protocol v2</span>
                                </div>
                                <p className="text-[9px] text-slate-500 font-mono leading-tight">
                                    REPORTS FILED THROUGH THIS PORTAL ARE SUBJECT TO HIPAA AUDIT AND MEDICAL VALIDATION.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reports and Upload */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Upload Form */}
                        <div className="glass p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <Upload className="h-5 w-5 text-primary" />
                                <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">File New Diagnostic Result</h2>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="relative">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Result Storage Reference (URL)</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="https://diagnostics.cdn/archives/report-XYZ.pdf"
                                            value={reportUrl}
                                            onChange={(e) => setReportUrl(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full font-mono placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={isUploading} className="bg-primary h-14 px-12 uppercase font-bold text-xs shadow-xl shadow-primary/30 min-w-full sm:min-w-[240px] text-white hover:opacity-90">
                                        Process & File Result
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Recent Reports List */}
                        <div className="glass rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Clipboard className="h-5 w-5 text-primary" />
                                    <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Recent Diagnostics History</h2>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {reports.length === 0 ? (
                                    <div className="p-16 text-center text-slate-400 font-mono text-xs uppercase italic">
                                        No recent diagnostic results on file for this subject.
                                    </div>
                                ) : reports.slice(0, 5).map((report) => (
                                    <div key={report.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold italic group-hover:text-primary transition-colors text-slate-900">Lab Reference: {report.id.substring(0, 8)}</p>
                                                <p className="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-tighter">
                                                    Filed on {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" className="h-10 px-6 text-[10px] uppercase font-bold border-slate-200 hover:bg-primary hover:text-white transition-all text-slate-700">
                                                View Source
                                            </Button>
                                        </a>
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
