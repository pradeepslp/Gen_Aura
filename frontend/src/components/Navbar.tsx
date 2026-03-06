"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, User, LogOut, ChevronLeft } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isHome = pathname === '/';
    const isDashboardRoot = ['/admin', '/doctor', '/patient'].includes(pathname);

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    {!isHome && (
                        <button
                            onClick={() => router.back()}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            title="Go Back"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-all text-primary">
                            <Shield className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Secure<span className="text-primary">Care</span>
                        </span>
                    </Link>
                </div>

                <div className="hidden md:block">
                    <div className="flex items-center space-x-8">
                        {!user ? (
                            <>
                                <Link href="/#platform" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors uppercase tracking-widest text-[10px]">
                                    Platform
                                </Link>
                                <Link href="/#compliance" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors uppercase tracking-widest text-[10px]">
                                    Compliance
                                </Link>
                                <Link href="/#security" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors uppercase tracking-widest text-[10px]">
                                    Zero-Trust
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : user.role === 'LAB_TECHNICIAN' ? '/lab-technician' : '/patient'}
                                className="flex items-center gap-2 text-[10px] font-bold text-primary italic uppercase tracking-widest hover:opacity-80 transition-all"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                {user.role.replace('_', ' ')} Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/login')} className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                                Log in
                            </Button>
                            <Button size="sm" onClick={() => router.push('/register')} className="bg-primary text-white font-bold uppercase tracking-widest text-[10px] px-6">
                                Get Started
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-[10px] font-bold text-slate-900 leading-none uppercase italic">{user.email.split('@')[0]}</span>
                                <span className="text-[8px] text-primary font-mono uppercase tracking-tighter leading-none mt-1">{user.role.replace('_', ' ')}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={logout} className="border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold uppercase tracking-widest text-[10px]">
                                <LogOut className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
