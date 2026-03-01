"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get('token');
    const { hydrateSession } = useAuth();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email securely...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token found in the link.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await api.get(`/auth/verify-email?token=${token}`);

                if (response.data?.success) {
                    const { tokens, user } = response.data.data;

                    // If the backend provided tokens, the user is automatically logged in 
                    if (tokens && user) {
                        localStorage.setItem('token', tokens.accessToken);
                        localStorage.setItem('user', JSON.stringify(user));
                    }

                    setStatus('success');
                    setMessage('Email verified successfully. Your account is now awaiting administrator authorization.');
                    await hydrateSession(); // Update global context immediately
                } else {
                    setStatus('error');
                    setMessage(response.data?.message || 'Invalid or expired token.');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link might be invalid or expired.');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />

            <div className="w-full max-w-[440px] glass p-10 rounded-3xl text-center shadow-xl animate-in fade-in zoom-in-95 duration-500">
                {status === 'loading' && (
                    <div className="flex flex-col items-center space-y-6">
                        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                        <h2 className="text-xl font-bold font-display text-white">Verifying Identity</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center space-y-6">
                        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold font-display text-white">Verification Complete</h2>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
                        </div>
                        <div className="w-full pt-4">
                            <Link href="/login" className="block w-full">
                                <Button className="w-full h-12">Return to Login</Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center space-y-6">
                        <div className="mx-auto h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold font-display text-white">Verification Failed</h2>
                        <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left flex gap-3 items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-red-200 text-sm leading-relaxed">{message}</p>
                        </div>
                        <div className="w-full pt-4 space-y-3">
                            <Link href="/login" className="block w-full">
                                <Button variant="outline" className="w-full h-12">Return to Login</Button>
                            </Link>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                Need a new link? <Link href="/login" className="text-primary hover:underline">Sign in</Link> to request another one.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
