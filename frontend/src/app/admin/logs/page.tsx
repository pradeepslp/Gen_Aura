'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Wifi, Cpu, AlertOctagon, Filter, Eye, RefreshCw, ArrowLeft } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function AnomalyLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getAnomalyLogs();
            setLogs(response.data.logs);
        } catch (error) {
            console.error('Failed to fetch anomaly logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-10 px-4 md:px-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500" onClick={() => router.push('/admin')}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 italic flex items-center gap-3">
                            <Activity className="w-8 h-8 text-primary" />
                            Anomaly Logs
                        </h1>
                        <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-[10px] font-bold">Behavioral Heuristics & Threat Intelligence</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="flex items-center gap-2 px-6 h-11 text-slate-600 font-bold uppercase tracking-widest text-[10px] border border-slate-200 rounded-xl hover:bg-slate-50">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                    <Button
                        onClick={fetchLogs}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 h-11 bg-cyan-50 text-cyan-700 font-bold uppercase tracking-widest text-[10px] border border-cyan-100 rounded-xl hover:bg-cyan-600 hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-cyan-100/50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl border border-slate-200 border-l-[6px] border-l-red-500 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                            <ShieldAlert className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">High Risk Events</p>
                            <p className="text-2xl font-black text-slate-900 italic tracking-tight">
                                {logs.filter(l => l.riskScore > 70).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-slate-200 border-l-[6px] border-l-amber-500 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                            <AlertOctagon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Quarantined Logs</p>
                            <p className="text-2xl font-black text-slate-900 italic tracking-tight">
                                {logs.filter(l => l.status === 'QUARANTINED').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-slate-200 border-l-[6px] border-l-cyan-500 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-100">
                            <Cpu className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Scanning Engine</p>
                            <p className="text-2xl font-black text-slate-900 italic tracking-tight">ACTIVE</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-24 glass rounded-3xl border border-slate-200 shadow-sm">
                        <Activity className="w-10 h-10 text-cyan-500 animate-pulse mx-auto mb-4" />
                        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-bold">Scanning Log Streams...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-24 glass rounded-3xl border border-slate-200 shadow-sm">
                        <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-bold italic">No anomalies detected in the current timeframe.</p>
                    </div>
                ) : logs.map((anomaly) => (
                    <div key={anomaly.id} className="glass rounded-3xl border border-slate-200 overflow-hidden group transition-all hover:shadow-md hover:border-cyan-200 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-6 p-6 items-start lg:items-center justify-between">
                            {/* Diagnostic Info */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-100">
                                        <Wifi className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 italic tracking-tight uppercase">
                                        {anomaly.type}
                                    </h3>
                                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest px-2 py-0.5 border border-slate-100 rounded-md">
                                        {new Date(anomaly.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 font-mono leading-relaxed font-medium italic">
                                    <span className="text-cyan-500/70 mr-1">{'>'}</span> {anomaly.description}
                                </p>
                            </div>

                            {/* Analytics & Meta */}
                            <div className="flex flex-wrap lg:flex-nowrap gap-6 items-center w-full lg:w-auto bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <div className="min-w-[120px]">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 px-0.5">Risk Score</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${anomaly.riskScore > 90 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : anomaly.riskScore > 70 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]'}`}
                                                style={{ width: `${anomaly.riskScore}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-black font-mono ${anomaly.riskScore > 90 ? 'text-red-600' : anomaly.riskScore > 70 ? 'text-orange-600' : 'text-yellow-600'}`}>
                                            {anomaly.riskScore}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                                <div>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 px-0.5">Sensor & Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-600 font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                                            {anomaly.sensor}
                                        </span>
                                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full uppercase font-black tracking-widest border ${anomaly.status === 'BLOCKED' ? 'bg-red-50 text-red-600 border-red-100' :
                                            anomaly.status === 'QUARANTINED' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                anomaly.status === 'CHALLENGED' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                    'bg-cyan-50 text-cyan-600 border-cyan-100'
                                            }`}>
                                            {anomaly.status}
                                        </span>
                                    </div>
                                </div>

                                <button className="ml-auto lg:ml-4 h-10 w-10 flex items-center justify-center bg-white border border-slate-200 hover:border-cyan-200 hover:text-cyan-600 text-slate-400 rounded-xl transition-all shadow-sm group-hover:scale-105">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-8">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest px-4 py-2 border border-slate-100 rounded-full bg-slate-50">
                    Showing last 24 hours of anomaly intel • Data retention: <span className="text-primary italic">30 days</span>
                </span>
            </div>
        </div>
    );
}
