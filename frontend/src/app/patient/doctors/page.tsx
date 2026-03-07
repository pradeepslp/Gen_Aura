"use client";

import React, { useEffect, useState } from 'react';
import { patientApi } from '@/lib/api';
import { User, Activity, Calendar, Shield, Search, ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await patientApi.getAllDoctors();
                setDoctors(res.data.doctors);
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc =>
        `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['PATIENT']}>
            <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Shield size={12} /> Secure Doctor Directory
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white italic mb-4">
                        Direct Booking Portal
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg italic">
                        Instantly connect with our network of certified medical professionals without prior triage.
                    </p>
                </header>

                <div className="relative mb-12 max-w-2xl mx-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or specialization..."
                        className="w-full h-16 pl-16 pr-8 rounded-3xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium text-white italic placeholder:text-slate-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map((doc) => (
                        <div
                            key={doc.id}
                            className="glass rounded-[2.5rem] border border-white/5 p-8 hover:border-primary/30 transition-all group relative overflow-hidden bg-white/5 active:scale-[0.98]"
                        >
                            <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform text-primary">
                                <Activity size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white italic">Dr. {doc.firstName} {doc.lastName}</h3>
                                        <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1 italic">{doc.specialization}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Clock size={14} className="text-primary/60" />
                                        <span className="font-mono uppercase">9:00 AM - 5:00 PM</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <MapPin size={14} className="text-primary/60" />
                                        <span className="font-mono uppercase">Main Campus - Wing B</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-amber-500 text-xs font-bold">
                                        <Star size={14} fill="currentColor" /> 4.9 <span className="text-slate-500 font-normal ml-1">(120+ Reviews)</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => router.push(`/patient/appointments/book?doctorId=${doc.id}&doctorName=${encodeURIComponent(`Dr. ${doc.firstName} ${doc.lastName}`)}`)}
                                    className="w-full bg-primary hover:bg-emerald-600 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white shadow-xl shadow-primary/20 transition-all group-hover:translate-y-[-2px]"
                                >
                                    Instant Book <Calendar size={14} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filteredDoctors.length === 0 && (
                        <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-dashed border-2 border-white/10">
                            <p className="text-slate-500 italic uppercase font-bold tracking-widest">No medical professionals match your search.</p>
                        </div>
                    )}
                </div>

                <div className="mt-20 text-center">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/patient')}
                        className="text-slate-500 hover:text-white font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft size={14} className="mr-2" /> Return to Dashboard
                    </Button>
                </div>
            </div>
        </ProtectedRoute>
    );
}
