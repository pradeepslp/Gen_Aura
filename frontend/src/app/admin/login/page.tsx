"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CircleUser, ShieldAlert, Lock, ArrowRight, AlertCircle, Cpu } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { adminLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await adminLogin({ email, password });
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white relative overflow-hidden">
            {/* Light Grid Background */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="w-full max-w-[420px] rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 border border-slate-200 mb-6 group shadow-inner">
                        <CircleUser className="h-12 w-12 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 italic">
                        Admin <span className="text-primary">Login</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest font-bold">
                        Restricted Access • Administrator Identity Required
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 text-[11px] text-red-600 items-start font-mono animate-shake">
                        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold uppercase mb-0.5 tracking-tight">Authorization Error</p>
                            <p className="opacity-90">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="System Identifier (Email)"
                            placeholder="admin@securecare.local"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={<Cpu className="text-primary/50" />}
                            className="bg-slate-50 border-slate-200 focus-visible:ring-primary focus-visible:border-primary font-mono text-xs text-slate-900"
                        />
                        <Input
                            label="Encrypted Signature (Password)"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            icon={<Lock className="text-primary/50" />}
                            className="bg-slate-50 border-slate-200 focus-visible:ring-primary focus-visible:border-primary font-mono text-xs text-slate-900"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-cyan-600 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20"
                        isLoading={isLoading}
                    >
                        Initialize Auth <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] text-primary font-mono uppercase font-bold">Secure Connection Active</span>
                    </div>
                    <Link href="/login" className="text-[10px] text-slate-400 uppercase font-bold tracking-widest hover:text-primary transition-colors">
                        Return to Standard Access
                    </Link>
                </div>
            </div>
        </div>
    );
}
