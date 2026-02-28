"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, ShieldAlert, Lock, ArrowRight, AlertCircle, Cpu } from 'lucide-react';
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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[#050505]">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="w-full max-w-[420px] rounded-2xl border border-red-500/20 bg-black/80 backdrop-blur-xl p-8 shadow-[0_0_50px_-12px_rgba(220,38,38,0.2)]">
                <div className="text-center mb-8">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 mb-6 group">
                        <Terminal className="h-7 w-7 text-red-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-2xl font-bold font-display tracking-tight text-white uppercase italic">
                        Security <span className="text-red-500">Terminal</span>
                    </h1>
                    <p className="text-slate-500 text-xs mt-2 font-mono uppercase tracking-widest">
                        Restricted Access • Administrator Identity Required
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3 text-xs text-red-400 items-start font-mono animate-shake">
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        <div>
                            <p className="font-bold uppercase mb-1">Authorization Error</p>
                            <p className="opacity-80">{error}</p>
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
                            icon={<Cpu className="text-red-500/50" />}
                            className="bg-black/40 border-red-500/10 focus-visible:ring-red-500 focus-visible:border-red-500 font-mono text-xs"
                        />
                        <Input
                            label="Encrypted Signature (Password)"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            icon={<Lock className="text-red-500/50" />}
                            className="bg-black/40 border-red-500/10 focus-visible:ring-red-500 focus-visible:border-red-500 font-mono text-xs"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                        isLoading={isLoading}
                    >
                        Initialize Auth <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] text-red-500/80 font-mono uppercase font-bold">Secure Connection Active</span>
                    </div>
                    <Link href="/login" className="text-[10px] text-slate-500 uppercase font-bold tracking-widest hover:text-white transition-colors">
                        Return to Standard Access
                    </Link>
                </div>
            </div>
        </div>
    );
}
