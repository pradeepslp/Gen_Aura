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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white italic underline decoration-primary/30 underline-offset-8 decoration-2">System Overview</h1>
                    <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-xs">Real-time surveillance and identity management</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Shield, label: 'Security Score', value: `${stats?.securityScore}/100`, color: 'text-green-500', bg: 'bg-green-500/10' },
                        { icon: AlertTriangle, label: 'Active Anomalies', value: stats?.activeAnomalies || 0, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { icon: Users, label: 'Authorized Users', value: stats?.authorizedUsers || 0, color: 'text-blue-500', bg: 'bg-blue-500/10', link: '/admin/users' },
                        { icon: Activity, label: 'System Uptime', value: stats?.systemUptime || '99.9%', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    ].map((item, i) => {
                        const CardContent = (
                            <div className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <item.icon className="h-16 w-16" />
                                </div>
                                <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-4`}>
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <p className="text-slate-400 text-sm font-medium">{item.label}</p>
                                <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
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
                    <div className="lg:col-span-2 glass rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <h2 className="font-bold text-white uppercase tracking-wider text-sm">Pending Authorizations</h2>
                            </div>
                            <Link href="/admin/users" className="text-[10px] text-slate-500 uppercase font-bold hover:text-white transition-colors flex items-center gap-1">
                                View all <ArrowRight className="h-2 w-2" />
                            </Link>
                        </div>
                        <div className="divide-y divide-white/5">
                            {pendingUsers.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 font-mono text-sm uppercase italic">
                                    No authorization requests pending
                                </div>
                            ) : pendingUsers.map((user: any) => (
                                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-primary border border-white/5">
                                            {user.email.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white italic">{user.email}</p>
                                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{user.role.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            className="h-8 w-8 rounded-lg border border-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border-red-500/30 transition-all"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security Feed */}
                    <div className="glass rounded-2xl border border-white/5 flex flex-col">
                        <div className="p-6 border-b border-white/5 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-red-500" />
                            <h2 className="font-bold text-white uppercase tracking-wider text-sm">Security Pulse</h2>
                        </div>
                        <div className="p-6 flex-1 space-y-6 overflow-y-auto max-h-[400px]">
                            {(stats?.recentActivity || []).map((log: any, i: number) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i !== (stats?.recentActivity || []).length - 1 && (
                                        <div className="absolute left-2 top-8 bottom-[-24px] w-px bg-white/5" />
                                    )}
                                    <div className={`h-4 w-4 rounded-full mt-1 shrink-0 ${log.action.includes('REJECTED') ? 'bg-red-500' : 'bg-amber-500'} shadow-[0_0_10px_rgba(239,68,68,0.3)]`} />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-white uppercase italic">{log.action}</p>
                                            <span className="text-[10px] text-slate-600 font-mono"><Clock className="h-2 w-2 inline mr-1" />{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-mono tracking-tight leading-relaxed">
                                            Source: {log.ip || 'INTERNAL'}<br />
                                            User: {log.user?.email || 'SYSTEM'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-white/5">
                            <Link href="/admin/audit">
                                <Button variant="outline" className="w-full text-[10px] uppercase font-bold h-10 border-white/5">
                                    Access Full Audit Logs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Compliance Footer */}
                <div className="glass-accent p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Shield className="h-64 w-64" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="h-20 w-20 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-primary shadow-2xl">
                            <Check className="h-10 w-10" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold text-white italic underline decoration-primary/20 decoration-2 underline-offset-4">Automated Compliance Scan</h3>
                            <p className="text-slate-400 mt-1 max-w-xl text-sm font-mono tracking-tight">The latest vulnerability assessment was completed 45 minutes ago. No critical findings detected.</p>
                        </div>
                        <div className="md:ml-auto">
                            <Link href="/admin/compliance">
                                <Button className="font-mono text-[10px] uppercase tracking-widest px-8">Download HIPAA Report</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
