"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2, Activity } from 'lucide-react';
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
            <div className="min-h-screen flex items-center justify-center p-4 bg-white">
                <div className="w-full max-w-[440px] glass p-10 rounded-3xl text-center space-y-6 border border-slate-100 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-500">
                    <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold font-display italic text-slate-900 line-clamp-1">Account Requested</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        A verification link has been sent to your email.
                        Please verify your email before logging in. Your account will then await administrator authorization.
                    </p>
                    <Link href="/" className="block">
                        <Button className="w-full h-12 bg-primary text-white font-bold uppercase tracking-widest text-xs">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-20 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

            <div className="w-full max-w-[480px] glass p-8 md:p-12 rounded-3xl animate-in fade-in zoom-in-95 duration-500 border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="text-center mb-10">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold font-display italic text-slate-900">Join SecureCare</h1>
                    <p className="text-slate-500 text-sm mt-2">Initialize your healthcare identity and access controls</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-[11px] text-red-600 border border-red-100 flex gap-2 items-center animate-shake">
                        <CheckCircle2 className="h-4 w-4 shrink-0 rotate-180" />
                        <p className="font-bold uppercase tracking-tight">{error}</p>
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
                            className="bg-slate-50 border-slate-200 text-slate-900"
                        />
                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                            className="bg-slate-50 border-slate-200 text-slate-900"
                        />
                    </div>

                    <Input
                        label="Email Address"
                        placeholder="john@hospital.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        icon={<Mail size={18} />}
                        className="bg-slate-50 border-slate-200 text-slate-900"
                    />

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Account Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, roleId: 'PATIENT' })}
                                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all ${formData.roleId === 'PATIENT'
                                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                                    }`}
                            >
                                <User className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase">Patient</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, roleId: 'DOCTOR' })}
                                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all ${formData.roleId === 'DOCTOR'
                                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                                    }`}
                            >
                                <Shield className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase">Doctor</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, roleId: 'LAB_TECHNICIAN' })}
                                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all ${formData.roleId === 'LAB_TECHNICIAN'
                                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                                    }`}
                            >
                                <Activity className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase text-center leading-tight">Lab Tech</span>
                            </button>
                        </div>
                    </div>

                    {formData.roleId === 'DOCTOR' && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Medical Specialization</label>
                            <select
                                className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium italic"
                                value={(formData as any).specialization || ""}
                                onChange={(e) => setFormData({ ...formData, ['specialization' as any]: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select your specialty</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Oncologist">Oncologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                                <option value="Endocrinologist">Endocrinologist</option>
                                <option value="Pediatrician">Pediatrician</option>
                                <option value="Ophthalmologist">Ophthalmologist</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            icon={<Lock size={18} />}
                            className="bg-slate-50 border-slate-200 text-slate-900"
                        />
                        <div className="grid grid-cols-4 gap-2 h-1 px-1">
                            <div className="rounded-full bg-primary" />
                            <div className="rounded-full bg-primary" />
                            <div className="rounded-full bg-primary/20" />
                            <div className="rounded-full bg-primary/20" />
                        </div>
                        <p className="text-[10px] text-slate-500 px-1 font-mono uppercase tracking-tighter">Security Strength: Medium | Use 12+ characters</p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex gap-3 items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                            By registering, you agree to the <strong className="text-slate-700">HIPAA Data Processing Addendum</strong> and our
                            Zero-Trust privacy protocols.
                        </p>
                    </div>

                    <Button type="submit" className="w-full h-14 bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:opacity-90" isLoading={isLoading}>
                        Create Secure Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-8">
                    Member already?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Login to access
                    </Link>
                </p>
            </div>
        </div>
    );
}
