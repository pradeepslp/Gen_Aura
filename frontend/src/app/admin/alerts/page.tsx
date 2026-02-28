'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Activity, Filter, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function SecurityAlertsPage() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        <div className="space-y-6 animate-fade-in relative z-10 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                        ACTIVE THREAT ALERTS
                    </h1>
                    <p className="text-blue-200/60 uppercase tracking-widest text-xs mt-2 font-bold select-none">
                        Real-time AI anomaly detection engine
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-800/40 transition-colors text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button
                        onClick={fetchAlerts}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-800/40 transition-colors text-xs font-bold uppercase tracking-wider border border-blue-500/20 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Alert List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12">
                        <Activity className="w-8 h-8 text-blue-500 animate-pulse mx-auto mb-4" />
                        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Loading Threat Intelligence...</p>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="text-center py-12 glass-panel border border-slate-700/50">
                        <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">No active security alerts detected.</p>
                    </div>
                ) : alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`glass-panel p-6 border-l-4 transition-all hover:translate-x-1 ${alert.riskScore > 90 ? 'border-l-red-500' :
                            alert.riskScore > 70 ? 'border-l-orange-500' :
                                'border-l-yellow-500'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                {alert.riskScore > 90 ? (
                                    <XCircle className="w-6 h-6 text-red-500 animate-pulse" />
                                ) : alert.riskScore > 70 ? (
                                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                                ) : (
                                    <Activity className="w-6 h-6 text-yellow-500" />
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-3">
                                        {alert.type}
                                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-black tracking-widest ${alert.riskScore > 90 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                            alert.riskScore > 70 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            }`}>
                                            RISK: {alert.riskScore}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-blue-300/50 font-mono mt-1">ID: {alert.id.substring(0, 8)} • TARGET: {alert.user ? alert.user.email : 'SYSTEM'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 text-[10px] rounded uppercase font-bold tracking-wider ${!alert.resolved ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                    'bg-green-500/10 text-green-500 border border-green-500/20'
                                    }`}>
                                    {!alert.resolved ? 'OPEN' : 'RESOLVED'}
                                </span>
                                <div className="text-xs text-slate-400 font-mono mt-2">{new Date(alert.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <p className="text-sm text-slate-300 leading-relaxed font-mono">
                                &gt; {alert.description}
                            </p>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-bold rounded uppercase tracking-wider border border-blue-500/20">
                                View Logs
                            </button>
                            {!alert.resolved && (
                                <button
                                    onClick={() => handleResolve(alert.id)}
                                    className="px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-xs font-bold rounded uppercase tracking-wider border border-green-500/20 flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark Resolved
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
