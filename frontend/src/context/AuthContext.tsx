"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface AuthContextType {
    user: any | null;
    login: (credentials: any) => Promise<void>;
    adminLogin: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await authApi.login(credentials);
            const { user: userData, accessToken } = response.data.data;

            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            // Redirect based on role or status
            if (userData.status === 'PENDING') {
                router.push('/pending-approval');
            } else {
                switch (userData.role) {
                    case 'ADMIN': router.push('/admin'); break;
                    case 'DOCTOR': router.push('/doctor'); break;
                    case 'PATIENT': router.push('/patient'); break;
                    default: router.push('/patient');
                }
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const adminLogin = async (credentials: any) => {
        try {
            const response = await authApi.adminLogin(credentials);
            const { admin: adminData, accessToken } = response.data.data;

            localStorage.setItem('token', accessToken);
            // Label as admin to differentiate
            const userData = { ...adminData, role: 'ADMIN' };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            router.push('/admin');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Admin authentication failed');
        }
    };

    const register = async (data: any) => {
        try {
            await authApi.register(data);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, adminLogin, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
