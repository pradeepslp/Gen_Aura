"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await login({ email, password });
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

            <div className="w-full max-w-[400px] glass p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="text-center mb-10">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold font-display italic text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 text-sm mt-2">Enter your credentials to access your secure vault</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 text-[11px] text-red-600 items-start animate-shake">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold uppercase mb-0.5 tracking-tight">Authentication Failed</p>
                            <p className="opacity-90">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={<Mail size={18} />}
                        className="bg-slate-50 border-slate-200 text-slate-900"
                    />
                    <div className="space-y-1">
                        <div className="flex justify-between items-center mb-1.5 px-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                            <Link href="#" className="text-[10px] text-primary font-bold uppercase hover:underline">Forgot password?</Link>
                        </div>
                        <Input
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            icon={<Lock size={18} />}
                            className="bg-slate-50 border-slate-200 text-slate-900"
                        />
                    </div>

                    <Button type="submit" className="w-full h-14 bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:opacity-90" isLoading={isLoading}>
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-8">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-primary font-bold hover:underline">
                        Create an account
                    </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <Link href="/admin/login" className="text-[10px] text-slate-400 uppercase tracking-widest font-bold hover:text-red-500 transition-colors">
                        System Administrator? Access Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
