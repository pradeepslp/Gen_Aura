"use client";

import React, { useState, useEffect } from 'react';
import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    Check,
    Clock,
    Shield,
    Users,
    X,
    Search
} from 'lucide-react';
import { Button } from '@/components/Button';
import { adminApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await adminApi.getAllUsers();
                setUsers(response.data.users);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 py-10 px-4 md:px-8 animate-in fade-in duration-500 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div>
                    <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 italic">Authorized Users</h1>
                    <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-[10px] font-bold">Directory of all approved identities across the network</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl hover:bg-slate-50" onClick={() => router.push('/admin')}>
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </header>

            <div className="glass rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">Identity Directory ({users.length})</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                                <th className="p-6 font-bold">User</th>
                                <th className="p-6 font-bold">Role</th>
                                <th className="p-6 font-bold">Status</th>
                                <th className="p-6 font-bold">Registered Date</th>
                                <th className="p-6 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-slate-400 font-mono text-xs uppercase italic">
                                        No authorized users found.
                                    </td>
                                </tr>
                            ) : users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-primary shadow-sm group-hover:scale-110 transition-transform">
                                                {user.email.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 italic group-hover:text-primary transition-colors">{user.email}</p>
                                                {user.role?.name === 'DOCTOR' && user.doctorProfile?.specialization && (
                                                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">{user.doctorProfile.specialization}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/5 border border-primary/20 text-[9px] font-bold tracking-widest text-primary uppercase">
                                            {user.role?.name || 'USER'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${user.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            user.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                'bg-red-50 text-red-600 border border-red-100'
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'APPROVED' ? 'bg-emerald-500' : user.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-xs font-mono text-slate-500 font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            {user.role?.name !== 'ADMIN' && (
                                                <>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm(`Are you sure you want to revoke access for ${user.email}? They will need re-authorization.`)) {
                                                                try {
                                                                    await adminApi.unauthorizeUser(user.id);
                                                                    setUsers(users.filter(u => u.id !== user.id));
                                                                } catch (e) {
                                                                    alert('Failed to unauthorize user');
                                                                }
                                                            }
                                                        }}
                                                        className="h-9 px-4 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-amber-100 shadow-sm"
                                                    >
                                                        Revoke
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm(`CRITICAL WARNING: Are you sure you want to PERMANENTLY delete ${user.email} and all associated data? This cannot be undone.`)) {
                                                                try {
                                                                    await adminApi.deleteUser(user.id);
                                                                    setUsers(users.filter(u => u.id !== user.id));
                                                                } catch (e) {
                                                                    alert('Failed to delete user');
                                                                }
                                                            }
                                                        }}
                                                        className="h-9 w-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100 flex items-center justify-center shadow-sm"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
