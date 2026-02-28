"use client";

import React from 'react';
import { Calendar, Clock, MapPin, Video, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function AppointmentsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-white italic">Care Sessions</h1>
                <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-tighter">In-person and virtual consultation schedule</p>
            </div>

            <div className="space-y-6">
                {[
                    { type: 'VIRTUAL', doctor: 'Dr. James Smith', speciality: 'Primary Care', date: 'Tomorrow', time: '10:30 AM', status: 'Awaiting Check-in' },
                    { type: 'IN-PERSON', doctor: 'Dr. Elena Rossi', speciality: 'Cardiology', date: 'March 25, 2024', time: '2:15 PM', status: 'Confirmed' }
                ].map((apt, i) => (
                    <div key={i} className="glass rounded-3xl border border-white/5 p-8 hover:border-primary/20 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-primary shadow-2xl transition-transform group-hover:scale-110 ${apt.type === 'VIRTUAL' ? 'bg-primary/10 border border-primary/20' : 'bg-slate-800 border border-white/5'
                                    }`}>
                                    {apt.type === 'VIRTUAL' ? <Video size={28} /> : <Calendar size={28} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${apt.type === 'VIRTUAL' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-800 text-slate-400 border-white/5'
                                            }`}>
                                            {apt.type}
                                        </span>
                                        <span className="text-primary font-bold text-[8px] uppercase tracking-widest italic">{apt.status}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white italic uppercase tracking-tight">{apt.doctor}</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-1">{apt.speciality}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:items-end gap-1">
                                <div className="flex items-center gap-2 text-white font-bold italic text-sm">
                                    <Clock size={14} className="text-primary" /> {apt.date} at {apt.time}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 font-mono text-[10px] uppercase">
                                    <MapPin size={10} /> {apt.type === 'VIRTUAL' ? 'SECURE_TELEHEALTH_NODE' : 'MAIN_CAMPUS_WING_C'}
                                </div>
                            </div>

                            <div className="md:border-l md:border-white/5 md:pl-8">
                                <Button className={`w-full md:w-auto px-8 font-bold uppercase tracking-widest text-[10px] h-12 ${apt.status === 'Awaiting Check-in' ? 'bg-primary hover:bg-emerald-600' : 'bg-white/5 border border-white/10 text-slate-400'
                                    }`}>
                                    {apt.status === 'Awaiting Check-in' ? 'Initialize Check-in' : 'View Details'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-white uppercase text-[10px] font-bold">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Return to Hub
                </Button>
            </div>
        </div>
    );
}
