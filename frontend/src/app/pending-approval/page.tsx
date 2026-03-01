"use client";

import React from 'react';
import { Mail, Clock, ShieldCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function PendingApprovalPage() {
    const { logout, user } = useAuth();

    // Check if user is verified
    const isVerified = user?.emailVerified;

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className={`absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[100px] ${isVerified ? 'bg-amber-500/5' : 'bg-blue-500/5'}`} />

            <div className="w-full max-w-[500px] glass p-10 md:p-12 rounded-3xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className={`relative mx-auto h-20 w-20 rounded-full border flex items-center justify-center ${isVerified
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                    }`}>
                    {isVerified ? (
                        <Clock className="h-10 w-10 animate-pulse" />
                    ) : (
                        <Mail className="h-10 w-10 animate-pulse" />
                    )}
                    <div className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-slate-900 border flex items-center justify-center ${isVerified ? 'border-amber-500/30' : 'border-blue-500/30'
                        }`}>
                        <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold font-display tracking-tight">
                        {isVerified ? 'Authorization Pending' : 'Verify Your Email'}
                    </h1>
                    <p className="text-slate-400 leading-relaxed">
                        {isVerified
                            ? 'Your identity has been verified, but your access to clinical and security protocols requires manual authorization by a System Administrator.'
                            : 'We have sent a verification link to your email address. In compliance with our Zero-Trust architecture, you must verify your identity before your account enters the Administrator Approval queue.'
                        }
                    </p>
                </div>

                <div className="glass bg-white/5 p-6 rounded-2xl border border-white/5 text-left">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Verification Steps</h3>
                    <ul className="space-y-3">
                        <li className={`flex gap-3 text-sm items-center ${isVerified ? 'text-green-400' : 'text-amber-500'}`}>
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isVerified ? 'bg-green-400/10' : 'bg-amber-500/10'
                                }`}>1</div>
                            <span>Identity Vault Initialization</span>
                        </li>
                        <li className={`flex gap-3 text-sm items-center ${isVerified ? 'text-amber-500' : 'text-slate-500'}`}>
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isVerified ? 'bg-amber-500/10' : 'bg-white/5'
                                }`}>2</div>
                            <span>Administrator Role Validation</span>
                        </li>
                        <li className="flex gap-3 text-sm items-center text-slate-500">
                            <div className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">3</div>
                            <span>Zero-Trust Token Issuance</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <Button onClick={() => window.location.reload()} className="w-full">
                        {isVerified ? 'Check Status' : 'I have verified my email'}
                    </Button>
                    <Button variant="ghost" onClick={logout} className="w-full flex gap-2">
                        <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                </div>

                <p className="text-[10px] text-slate-500 pt-4" suppressHydrationWarning>
                    Reference ID: {Math.random().toString(36).substring(7).toUpperCase()} | SecureCare Identity Protocol v4.2
                </p>
            </div>
        </div>
    );
}
