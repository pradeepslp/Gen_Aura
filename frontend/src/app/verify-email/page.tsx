"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Separate component that uses useSearchParams - must be inside Suspense
function VerifyEmailContent() {
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
            // Artificial delay to show off the loading animation
            await new Promise(resolve => setTimeout(resolve, 1500));

            try {
                const response = await api.get(`/auth/verify-email?token=${token}`);

                if (response.data?.success) {
                    const { tokens, user } = response.data.data;

                    if (tokens && user) {
                        localStorage.setItem('token', tokens.accessToken);
                        localStorage.setItem('user', JSON.stringify(user));
                    }

                    setStatus('success');
                    setMessage('Email verified successfully. Your account is now awaiting administrator authorization.');
                    await hydrateSession();
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

    const statusConfig = {
        loading: {
            color: 'primary',
            icon: <Loader2 className="h-10 w-10 text-primary animate-spin" />,
            title: 'Verifying Identity',
            bgGlow: 'bg-primary/5'
        },
        success: {
            color: 'emerald',
            icon: <CheckCircle2 className="h-10 w-10 text-emerald-400" />,
            title: 'Verification Complete',
            bgGlow: 'bg-emerald-500/10'
        },
        error: {
            color: 'red',
            icon: <XCircle className="h-10 w-10 text-red-500" />,
            title: 'Verification Failed',
            bgGlow: 'bg-red-500/10'
        }
    };

    const current = statusConfig[status];

    return (
        <div className="relative w-full max-w-[480px]">
            {/* Background Decorative Rings */}
            <div className={`absolute inset-0 -z-10 blur-3xl opacity-30 transition-colors duration-1000 ${current.bgGlow}`} />

            <div className="glass p-1 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                {/* Inner Card Glow/Reflection */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2.3rem] p-10 flex flex-col items-center space-y-8">
                    {/* Status Icon */}
                    <div className="relative">
                        <div className={`absolute inset-0 blur-2xl opacity-40 animate-pulse ${status === 'success' ? 'bg-emerald-400' : status === 'error' ? 'bg-red-500' : 'bg-primary'
                            }`} />
                        <div className={`relative h-20 w-20 rounded-full border-2 flex items-center justify-center shadow-inner transition-colors duration-700 ${status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                                status === 'error' ? 'bg-red-500/10 border-red-500/30' :
                                    'bg-primary/10 border-primary/30'
                            }`}>
                            {current.icon}
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="text-center space-y-3">
                        <h2 className={`text-3xl font-black font-display tracking-tight text-white italic transition-all duration-700 ${status === 'success' ? 'text-emerald-400' : ''
                            }`}>
                            {current.title}
                        </h2>
                        <div className={`p-4 rounded-2xl border transition-all duration-700 ${status === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 shadow-inner' :
                                status === 'error' ? 'bg-red-500/5 border-red-500/10' :
                                    'bg-primary/5 border-primary/10'
                            }`}>
                            {status === 'error' && (
                                <AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-2" />
                            )}
                            <p className="text-slate-300 text-sm font-medium leading-relaxed tracking-wide">
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full pt-4 animate-in slide-in-from-bottom-4 duration-1000">
                        {status === 'success' ? (
                            <Link href="/pending-approval" className="block w-full">
                                <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 group">
                                    <span className="flex items-center justify-center gap-2">
                                        Account Dashboard
                                        <CheckCircle2 className="w-4 h-4 transition-transform group-hover:scale-125" />
                                    </span>
                                </Button>
                            </Link>
                        ) : status === 'error' ? (
                            <div className="space-y-4 w-full">
                                <Link href="/login" className="block w-full">
                                    <Button variant="outline" className="w-full h-14 border-slate-700 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/5">
                                        Return to Login
                                    </Button>
                                </Link>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black text-center">
                                    Need help? Contact <span className="text-primary hover:underline cursor-pointer">Support</span>
                                </p>
                            </div>
                        ) : (
                            <div className="h-14 flex items-center justify-center">
                                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em] animate-pulse">
                                    Authenticating Data Stream...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className={`h-1 mx-auto rounded-full blur-sm transition-all duration-1000 w-32 mt-6 ${status === 'success' ? 'bg-emerald-500' : status === 'error' ? 'bg-red-500' : 'bg-primary'
                }`} />
        </div>
    );
}

// Loading fallback for Suspense
function VerifyEmailFallback() {
    return (
        <div className="w-full max-w-[480px] glass p-10 rounded-[2.5rem] text-center shadow-xl animate-pulse">
            <div className="flex flex-col items-center space-y-8">
                <div className="h-24 w-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center animate-spin">
                    <Loader2 className="h-10 w-10 text-slate-600" />
                </div>
                <div className="space-y-4 w-full">
                    <div className="h-8 bg-slate-800 rounded-lg w-3/4 mx-auto" />
                    <div className="h-16 bg-slate-800 rounded-xl w-full" />
                </div>
            </div>
        </div>
    );
}

// Main page component wraps content in Suspense (required for useSearchParams)
export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
            {/* Ambient Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 -z-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 -z-20 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px] animate-pulse delay-700" />

            <Suspense fallback={<VerifyEmailFallback />}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
