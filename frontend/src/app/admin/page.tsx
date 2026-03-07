"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Check,
    Clock,
    Shield,
    Users,
    X
} from 'lucide-react';
import { Button } from '@/components/Button';

import { adminApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, pendingRes] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getPendingUsers()
                ]);
                setStats(statsRes.data.stats);
                setPendingUsers(pendingRes.data.users);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApprove = async (userId: string) => {
        try {
            await adminApi.approveUser(userId);
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            alert("Approval failed");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 italic">System Overview</h1>
                        <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-[10px] font-bold">Real-time surveillance and identity management</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Shield, label: 'Security Score', value: `${stats?.securityScore}/100`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { icon: AlertTriangle, label: 'Active Anomalies', value: stats?.activeAnomalies || 0, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                        { icon: Users, label: 'Authorized Users', value: stats?.authorizedUsers || 0, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/10', link: '/admin/users' },
                        { icon: Activity, label: 'System Uptime', value: stats?.systemUptime || '99.9%', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                    ].map((item, i) => {
                        const CardContent = (
                            <div className={cn(
                                "glass p-6 rounded-3xl border transition-all group relative overflow-hidden h-full shadow-sm hover:shadow-md",
                                item.border || "border-slate-200"
                            )}>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <item.icon className="h-16 w-16" />
                                </div>
                                <div className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-4 shadow-sm`}>
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{item.label}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1 italic">{item.value}</p>
                            </div>
                        );

                        return item.link ? (
                            <Link href={item.link} key={i} className="block cursor-pointer">
                                {CardContent}
                            </Link>
                        ) : (
                            <div key={i}>{CardContent}</div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Pending Authorizations */}
                    <div className="lg:col-span-2 glass rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-primary" />
                                <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">Pending Authorizations</h2>
                            </div>
                            <Link href="/admin/users" className="text-[10px] text-slate-400 uppercase font-bold hover:text-primary transition-colors flex items-center gap-1">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {pendingUsers.length === 0 ? (
                                <div className="p-16 text-center text-slate-400 font-mono text-xs uppercase italic">
                                    No authorization requests pending
                                </div>
                            ) : pendingUsers.map((user: any) => (
                                <div key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors grouo">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-primary shadow-sm group-hover:scale-105 transition-transform">
                                            {user.email.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 italic group-hover:text-primary transition-colors">{user.email}</p>
                                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter mt-1">
                                                {user.role?.name || 'USER'}
                                                {user.role?.name === 'DOCTOR' && user.doctorProfile?.specialization && (
                                                    <span className="text-primary font-bold ml-2">• {user.doctorProfile.specialization}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all shadow-sm"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
                                        >
                                            <Check className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security Feed */}
                    <div className="glass rounded-3xl border border-slate-200 flex flex-col shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                            <Activity className="h-5 w-5 text-primary" />
                            <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">Security Pulse</h2>
                        </div>
                        <div className="p-6 flex-1 space-y-6 overflow-y-auto max-h-[500px]">
                            {(stats?.recentActivity || []).length === 0 ? (
                                <p className="text-center text-slate-400 font-mono text-[10px] italic py-8">No recent activity detected.</p>
                            ) : (stats?.recentActivity || []).map((log: any, i: number) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i !== (stats?.recentActivity || []).length - 1 && (
                                        <div className="absolute left-2 top-8 bottom-[-24px] w-px bg-slate-100" />
                                    )}
                                    <div className={`h-4 w-4 rounded-full mt-1 shrink-0 ${log.action.includes('REJECTED') ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`} />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] font-bold text-slate-900 uppercase italic tracking-tight">{log.action}</p>
                                            <span className="text-[9px] text-slate-400 font-mono"><Clock className="h-2 w-2 inline mr-1" />{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter leading-relaxed">
                                            SRC: {log.ip || 'INTERNAL'}<br />
                                            USR: {log.user?.email || 'SYSTEM'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 border-t border-slate-100">
                            <Link href="/admin/audit">
                                <Button variant="outline" className="w-full text-[10px] uppercase font-bold h-10 border-slate-200 text-slate-600 hover:bg-slate-50">
                                    Access Full Audit Logs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Compliance Footer */}
                <div className="glass-accent p-8 rounded-[2.5rem] border border-primary/20 relative overflow-hidden group shadow-lg shadow-primary/5">
                    <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Shield className="h-64 w-64 text-primary" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="h-20 w-20 rounded-[2rem] bg-white border border-primary/10 flex items-center justify-center text-primary shadow-xl">
                            <Check className="h-10 w-10" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-slate-900 italic">Automated Compliance Scan</h3>
                            <p className="text-slate-500 mt-1 max-w-xl text-xs font-mono tracking-tight font-medium uppercase">Assessment status: <span className="text-emerald-600 font-bold italic">Passed</span> • No critical findings detected.</p>
                        </div>
                        <div className="md:ml-auto">
                            <Link href="/admin/compliance">
                                <Button className="font-bold text-[10px] uppercase tracking-widest px-10 h-12 bg-primary text-white shadow-lg shadow-primary/20">Download HIPAA Report</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

// Helper for conditional classes
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
