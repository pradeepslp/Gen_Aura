'use client';

import React, { useState, useEffect } from 'react';
import { Database, Download, Search, RefreshCw, AlertCircle, FileText } from 'lucide-react';

interface AuditLog {
    id: string;
    action: string;
    userId: string | null;
    ip: string;
    createdAt: string;
    user?: {
        email: string;
    } | null;
}
import { adminApi } from '@/lib/api';

export default function AuditTrailPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await adminApi.getAuditLogs();
                setLogs(response.data.logs);
            } catch (error) {
                console.error('Failed to fetch audit logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip?.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-fade-in relative z-10 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3">
                        <Database className="w-8 h-8 text-indigo-400" />
                        FULL AUDIT TRAIL
                    </h1>
                    <p className="text-blue-200/60 uppercase tracking-widest text-xs mt-2 font-bold select-none">
                        Immutable Security Ledger
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/80 border border-slate-700/50 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 w-64 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition-colors text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-slate-900/50">
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actor</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">IP Address</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                                    Loading ledger...
                                </td>
                            </tr>
                        ) : filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 text-sm text-slate-400 font-mono">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-sm font-bold text-white font-mono tracking-tight">
                                        {log.action}
                                    </td>
                                    <td className="p-4 text-sm text-slate-300">
                                        {log.user?.email || <span className="text-slate-500 italic">anonymous</span>}
                                    </td>
                                    <td className="p-4 text-sm text-slate-400 font-mono">
                                        {log.ip}
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded border ${log.action.includes('DENIED') || log.action.includes('REJECTED')
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            }`}>
                                            {log.action.includes('DENIED') || log.action.includes('REJECTED') ? 'REJECTED' : 'VERIFIED'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-slate-400 bg-slate-900/30">
                    <div>Showing 1 to {filteredLogs.length} entries</div>
                    <div className="flex gap-2 text-xs uppercase tracking-widest font-bold">
                        <span className="text-slate-600 hover:text-slate-400 cursor-pointer">Prev</span>
                        <span className="text-indigo-400 cursor-pointer">1</span>
                        <span className="text-slate-600 hover:text-slate-400 cursor-pointer">Next</span>
                    </div>
                </div>
            </div>

            <button className="mt-6 mx-auto flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-bold">
                <FileText className="w-4 h-4" />
                Back to Terminal
            </button>
        </div>
    );
}
