'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Wifi, Cpu, AlertOctagon, Filter, Eye, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AnomalyLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        <div className="space-y-6 animate-fade-in relative z-10 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3 animate-pulse">
                        <Activity className="w-8 h-8 text-cyan-400" />
                        AI ANOMALY LOGS
                    </h1>
                    <p className="text-blue-200/60 uppercase tracking-widest text-xs mt-2 font-bold select-none">
                        Behavioral Heuristics & Threat Intelligence
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-300 rounded border border-slate-700 hover:bg-slate-700 transition-colors text-xs font-bold uppercase tracking-wider">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button
                        onClick={fetchLogs}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-900/30 text-cyan-400 rounded-lg hover:bg-cyan-800/40 transition-colors text-xs font-bold uppercase tracking-wider border border-cyan-500/20 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-red-500">
                    <div className="p-3 bg-red-500/20 rounded-lg">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">High Risk Events</p>
                        <p className="text-2xl font-black text-white tracking-tighter">12</p>
                    </div>
                </div>
                <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-yellow-500">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <AlertOctagon className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quarantined Streams</p>
                        <p className="text-2xl font-black text-white tracking-tighter">3</p>
                    </div>
                </div>
                <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-cyan-500">
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <Cpu className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Models Active</p>
                        <p className="text-2xl font-black text-white tracking-tighter">18/18</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <Activity className="w-8 h-8 text-cyan-500 animate-pulse mx-auto mb-4" />
                        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Scanning Log Streams...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12 glass-panel border border-slate-700/50">
                        <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">No anomalies detected in the current timeframe.</p>
                    </div>
                ) : logs.map((anomaly) => (
                    <div key={anomaly.id} className="glass-panel overflow-hidden border border-slate-700/50 group transition-colors hover:border-cyan-500/30">
                        <div className="flex flex-col lg:flex-row gap-4 p-5 items-start lg:items-center justify-between">

                            {/* Diagnostic Info */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                        <Wifi className="w-4 h-4 text-cyan-500" />
                                        {anomaly.type}
                                    </h3>
                                    <span className="text-xs text-slate-500 font-mono tracking-wider">
                                        {new Date(anomaly.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                                    <span className="text-cyan-400/70">{'>'}</span> {anomaly.description}
                                </p>
                            </div>

                            {/* Analytics & Meta */}
                            <div className="flex flex-wrap lg:flex-nowrap gap-6 items-center w-full lg:w-auto bg-black/20 p-3 rounded-lg border border-white/5">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Risk Score</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-16 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${anomaly.riskScore > 90 ? 'bg-red-500' : anomaly.riskScore > 70 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                                                style={{ width: `${anomaly.riskScore}%` }}
                                            />
                                        </div>
                                        <span className={`text-sm font-black font-mono ${anomaly.riskScore > 90 ? 'text-red-400' : anomaly.riskScore > 70 ? 'text-orange-400' : 'text-yellow-400'}`}>
                                            {anomaly.riskScore}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden sm:block w-px h-8 bg-slate-700/50"></div>

                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Sensor & Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                            {anomaly.sensor}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-widest border ${anomaly.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                            anomaly.status === 'QUARANTINED' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' :
                                                anomaly.status === 'CHALLENGED' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                                                    'bg-cyan-500/10 text-cyan-500 border-cyan-500/30'
                                            }`}>
                                            {anomaly.status}
                                        </span>
                                    </div>
                                </div>

                                <button className="ml-auto lg:ml-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors group-hover:text-cyan-400 group-hover:bg-cyan-900/30">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-4">
                <span className="text-xs text-slate-500 font-mono">
                    Showing last 24 hours of anomaly intel. Data retention: 30 days.
                </span>
            </div>
        </div>
    );
}
