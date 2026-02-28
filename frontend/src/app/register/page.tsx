"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roleId: 'PATIENT' // Default role for demo
    });
    const [error, setError] = useState("");
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await register(formData);
            setIsLoading(false);
            setStep(2);
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    if (step === 2) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
                <div className="w-full max-w-[440px] glass p-10 rounded-3xl text-center space-y-6">
                    <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-display">Account Requested</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Your secure registration request has been submitted. An administrator will review
                        your credentials and activate your zero-trust vault within 24 hours.
                    </p>
                    <Link href="/" className="block">
                        <Button variant="outline" className="w-full">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-20">
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />

            <div className="w-full max-w-[480px] glass p-8 md:p-12 rounded-3xl animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold font-display">Join SecureCare</h1>
                    <p className="text-slate-400 text-sm mt-2">Initialize your healthcare identity and access controls</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Email Address"
                        placeholder="john@hospital.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <div className="space-y-4">
                        <label className="text-xs font-medium text-slate-400">Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, roleId: 'PATIENT' })}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.roleId === 'PATIENT'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                <User className="h-4 w-4" />
                                <span className="text-sm">Patient</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, roleId: 'DOCTOR' })}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.roleId === 'DOCTOR'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-white/10 border-white/10 text-slate-400 hover:bg-white/20'
                                    }`}
                            >
                                <Shield className="h-4 w-4" />
                                <span className="text-sm">Doctor</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-4 gap-2 h-1 px-1">
                            <div className="rounded-full bg-primary" />
                            <div className="rounded-full bg-primary" />
                            <div className="rounded-full bg-primary/20" />
                            <div className="rounded-full bg-primary/20" />
                        </div>
                        <p className="text-[10px] text-slate-500 px-1">Security Strength: Medium | Use 12+ characters</p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/5 p-4 flex gap-3 items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed">
                            By registering, you agree to the <strong>HIPAA Data Processing Addendum</strong> and our
                            Zero-Trust privacy protocols.
                        </p>
                    </div>

                    <Button type="submit" className="w-full h-12" isLoading={isLoading}>
                        Create Secure Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-8">
                    Member already?{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Login to access
                    </Link>
                </p>
            </div>
        </div>
    );
}
