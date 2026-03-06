'use client';

import React, { useState, useEffect } from 'react';
import { Database, Download, Search, RefreshCw, AlertCircle, FileText, ArrowLeft } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

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

export default function AuditTrailPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

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
        <div className="max-w-7xl mx-auto space-y-8 py-10 px-4 md:px-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500" onClick={() => router.push('/admin')}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 italic flex items-center gap-3">
                            <Database className="w-8 h-8 text-primary" />
                            Full Audit Trail
                        </h1>
                        <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-[10px] font-bold">Immutable Security Ledger</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-900 placeholder:text-slate-400 w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 px-6 h-12 border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-50 shadow-sm">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </header>

            {/* Table */}
            <div className="glass rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                                <th className="p-6 font-bold">Timestamp</th>
                                <th className="p-6 font-bold">Action</th>
                                <th className="p-6 font-bold">Actor</th>
                                <th className="p-6 font-bold">IP Address</th>
                                <th className="p-6 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center text-slate-400">
                                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                                        <p className="font-mono text-[10px] uppercase tracking-widest font-bold">Synchronizing ledger...</p>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center text-slate-300">
                                        <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-50" />
                                        <p className="font-mono text-[10px] uppercase tracking-widest font-bold font-italic">No records matched your query.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-6 text-xs text-slate-500 font-mono font-medium">
                                            {new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-slate-900 font-mono tracking-tight uppercase italic group-hover:text-primary transition-colors">
                                                {log.action}
                                            </p>
                                        </td>
                                        <td className="p-6 text-sm text-slate-600 font-medium">
                                            {log.user?.email || <span className="text-slate-400 italic font-normal text-xs uppercase tracking-tighter">anonymous_node</span>}
                                        </td>
                                        <td className="p-6 text-xs text-slate-500 font-mono">
                                            {log.ip}
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${log.action.includes('DENIED') || log.action.includes('REJECTED')
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {log.action.includes('DENIED') || log.action.includes('REJECTED') ? 'Unauthorized' : 'Verified'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing <span className="text-slate-700">1</span> to <span className="text-slate-700">{filteredLogs.length}</span> entries
                    </div>
                    <div className="flex gap-4 text-[10px] uppercase tracking-widest font-black">
                        <button className="text-slate-400 hover:text-primary transition-colors disabled:opacity-30" disabled>PREV_NODE</button>
                        <span className="h-6 w-6 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">1</span>
                        <button className="text-slate-400 hover:text-primary transition-colors disabled:opacity-30" disabled>NEXT_NODE</button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={() => router.push('/admin')}
                    className="flex items-center gap-2 text-[10px] text-slate-400 hover:text-primary transition-all font-black uppercase tracking-widest group"
                >
                    <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Back to Security Terminal
                </button>
            </div>
        </div>
    );
}
