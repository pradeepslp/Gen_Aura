'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Activity, Filter, RefreshCw, XCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function SecurityAlertsPage() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getAlerts();
            setAlerts(response.data.alerts);
        } catch (error) {
            console.error('Failed to fetch security alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id: string) => {
        try {
            await adminApi.resolveAlert(id);
            fetchAlerts(); // Refresh the list
        } catch (error) {
            console.error('Failed to resolve alert:', error);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-10 px-4 md:px-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500" onClick={() => router.push('/admin')}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 italic flex items-center gap-3">
                            <ShieldAlert className="w-8 h-8 text-primary" />
                            Active Threat Alerts
                        </h1>
                        <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-[10px] font-bold">Real-time AI anomaly detection engine</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-6 h-11 text-slate-600 font-bold uppercase tracking-widest text-[10px] border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                    <Button
                        onClick={fetchAlerts}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 h-11 bg-primary/10 text-primary font-bold uppercase tracking-widest text-[10px] border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-primary/5"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </header>

            {/* Alert List */}
            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center py-24 glass rounded-3xl border border-slate-200 shadow-sm">
                        <Activity className="w-10 h-10 text-primary animate-pulse mx-auto mb-4" />
                        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-bold">Scanning Threat Intelligence...</p>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="text-center py-24 glass rounded-3xl border border-slate-200 shadow-sm">
                        <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-bold font-italic">No active security alerts detected.</p>
                    </div>
                ) : alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`glass p-8 rounded-3xl border transition-all hover:shadow-md border-l-[6px] ${alert.riskScore > 90 ? 'border-l-red-500 border-slate-200' :
                            alert.riskScore > 70 ? 'border-l-orange-500 border-slate-200' :
                                'border-l-yellow-500 border-slate-200'
                            }`}
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
                            <div className="flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${alert.riskScore > 90 ? 'bg-red-50 text-red-600' : alert.riskScore > 70 ? 'bg-orange-50 text-orange-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                    {alert.riskScore > 90 ? (
                                        <XCircle className="w-6 h-6 animate-pulse" />
                                    ) : alert.riskScore > 70 ? (
                                        <AlertTriangle className="w-6 h-6" />
                                    ) : (
                                        <Activity className="w-6 h-6" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-xl font-bold text-slate-900 italic tracking-tight uppercase">
                                            {alert.type}
                                        </h3>
                                        <span className={`px-2.5 py-1 text-[9px] rounded-md font-black tracking-widest uppercase ${alert.riskScore > 90 ? 'bg-red-600 text-white shadow-lg shadow-red-200' :
                                            alert.riskScore > 70 ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' :
                                                'bg-yellow-500 text-white shadow-lg shadow-yellow-200'
                                            }`}>
                                            Risk: {alert.riskScore}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase font-bold tracking-tighter">
                                        Ref: {alert.id.substring(0, 8)} • Target: <span className="text-slate-900">{alert.user ? alert.user.email : 'SYSTEM'}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 text-[9px] rounded-full uppercase font-black tracking-widest border ${!alert.resolved ? 'bg-red-50 text-red-600 border-red-100' :
                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    }`}>
                                    {!alert.resolved ? '● Active' : '● Resolved'}
                                </span>
                                <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">{new Date(alert.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <p className="text-sm text-slate-600 leading-relaxed font-mono font-medium italic">
                                &gt; {alert.description}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="h-10 px-6 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all text-[10px] font-bold rounded-xl uppercase tracking-widest border border-slate-200 shadow-sm">
                                View Metadata
                            </button>
                            {!alert.resolved && (
                                <button
                                    onClick={() => handleResolve(alert.id)}
                                    className="h-10 px-6 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-bold rounded-xl uppercase tracking-widest border border-emerald-100 flex items-center gap-2 shadow-sm"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Authorize Resolution
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
