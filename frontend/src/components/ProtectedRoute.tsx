"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                // Not logged in -> Login
                router.push('/login');
                return;
            }

            if (user.status === 'PENDING') {
                // Needs approval/verification -> Pending Page
                router.push('/pending-approval');
                return;
            }

            if (allowedRoles && !allowedRoles.includes(user.role)) {
                // Role mismatch
                router.push('/unauthorized'); // or fallback to safe route
                return;
            }
        }
    }, [user, isLoading, router, allowedRoles, pathname]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#0a0f1c]">
                <div className="flex flex-col items-center gap-4">
                    <ShieldAlert className="h-10 w-10 text-primary animate-pulse" />
                    <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Verifying Zero-Trust Access Token...</p>
                </div>
            </div>
        );
    }

    // Optional: render children only if access checks have definitively passed
    if (!user || user.status === 'PENDING' || (allowedRoles && !allowedRoles.includes(user.role))) {
        return null; // Don't flash protected content while routing
    }

    return <>{children}</>;
}
