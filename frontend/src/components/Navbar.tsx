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
        <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    {!isHome && (
                        <button
                            onClick={() => router.back()}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Go Back"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-all">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Secure<span className="text-primary">Care</span>
                        </span>
                    </Link>
                </div>

                <div className="hidden md:block">
                    <div className="flex items-center space-x-8">
                        {!user ? (
                            <>
                                <Link href="/#platform" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                    Platform
                                </Link>
                                <Link href="/#compliance" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                    Compliance
                                </Link>
                                <Link href="/#security" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                    Zero-Trust
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient'}
                                className="flex items-center gap-2 text-sm font-bold text-primary italic uppercase tracking-widest hover:brightness-125 transition-all"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                {user.role} Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                                Log in
                            </Button>
                            <Button size="sm" onClick={() => router.push('/register')}>
                                Get Started
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-[10px] font-bold text-white leading-none uppercase italic">{user.email.split('@')[0]}</span>
                                <span className="text-[8px] text-primary font-mono uppercase tracking-tighter leading-none mt-1">{user.role}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={logout} className="border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30">
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
