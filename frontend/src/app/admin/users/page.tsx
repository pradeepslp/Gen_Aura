"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 py-10 px-4 md:px-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white italic underline decoration-primary/30 underline-offset-8 decoration-2">Authorized Users</h1>
                    <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-xs">Directory of all approved identities across the network</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="gap-2" onClick={() => router.push('/admin')}>
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </header>

            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h2 className="font-bold text-white uppercase tracking-wider text-sm">Identity Directory ({users.length})</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                                <th className="p-4 font-bold">User</th>
                                <th className="p-4 font-bold">Role</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold">Registered Date</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500 font-mono text-sm uppercase italic">
                                        No authorized users found.
                                    </td>
                                </tr>
                            ) : users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-primary border border-white/5 shadow-sm group-hover:border-primary/30 transition-colors">
                                            {user.email.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-black/40 border border-white/10 text-[10px] font-mono tracking-widest text-white uppercase">
                                            {user.role.name}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${user.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            user.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                            <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs font-mono text-slate-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        {user.role.name !== 'ADMIN' && (
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
                                                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest border border-amber-500/20"
                                                >
                                                    Unauthorize
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
                                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest border border-red-500/20 flex items-center gap-1"
                                                >
                                                    <X size={12} /> Delete
                                                </button>
                                            </>
                                        )}
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
