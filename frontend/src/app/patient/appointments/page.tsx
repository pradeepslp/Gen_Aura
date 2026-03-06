"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Video, ArrowLeft, ChevronRight, Clipboard as ClipboardIcon, Phone, Activity } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { patientApi, appointmentApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AppointmentsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                const [docRes, appRes] = await Promise.all([
                    patientApi.getAssignedDoctors(user.id),
                    appointmentApi.getHistory()
                ]);
                setDoctors(docRes.data.doctors || []);
                setBookedAppointments(appRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch appointment data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white italic">Care Hub</h1>
                    <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-tighter italic">Manage your secure consultations</p>
                </div>
                <Button onClick={() => router.push('/patient/appointments/book')} className="bg-primary hover:bg-emerald-600 h-10 px-6 font-bold uppercase tracking-widest text-[10px] text-white">
                    Book New Session
                </Button>
            </div>

            <div className="space-y-12">
                {/* Booked Appointments Section */}
                {bookedAppointments.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest w-fit">
                            <ClipboardIcon size={12} /> My Booked Consultations
                        </div>
                        <div className="grid gap-4">
                            {bookedAppointments.map((app) => (
                                <div key={app.id} className="glass rounded-2xl border border-white/5 p-6 hover:border-primary/20 transition-all group bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white italic">{app.fullName}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-mono text-slate-500 uppercase">{app.gender} • {app.age} yrs</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[8px] font-bold uppercase border border-white/5">{app.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 font-mono uppercase">Primary Complaint</p>
                                            <p className="text-xs font-bold text-primary italic uppercase tracking-tight truncate max-w-[150px]">
                                                {app.chiefComplaint.join(', ')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Contact Identity</p>
                                            <div className="flex items-center gap-2 text-white text-xs">
                                                <Phone size={12} className="text-primary/60" /> {app.contactNumber}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Encrypted Locality</p>
                                            <div className="flex items-center gap-2 text-white text-xs truncate">
                                                <MapPin size={12} className="text-primary/60" /> {app.address}
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Registration Date</p>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                <Clock size={12} className="text-primary/60" /> {new Date(app.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Original Assigned Doctors Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-widest w-fit">
                        <Activity size={12} /> Active Care Assignments
                    </div>
                    {doctors.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 font-mono text-xs uppercase italic bg-black/40 rounded-3xl border border-white/5">
                            No active care sessions. Patient has no assigned doctors.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {doctors.map((doc, i) => {
                                const type = i % 2 === 0 ? 'VIRTUAL' : 'IN-PERSON';
                                const docName = `Dr. ${doc.firstName || 'Medical'} ${doc.lastName || 'Professional'}`;
                                const status = 'Awaiting Check-in';
                                const dateStr = i % 2 === 0 ? 'Tomorrow' : 'Later this week';
                                const timeStr = '10:30 AM';
                                const speciality = doc.specialization || 'General Care';

                                return (
                                    <div key={i} className="glass rounded-3xl border border-white/5 p-8 hover:border-primary/20 transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="flex items-start gap-6">
                                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-primary shadow-2xl transition-transform group-hover:scale-110 ${type === 'VIRTUAL' ? 'bg-primary/10 border border-primary/20' : 'bg-slate-800 border border-white/5'
                                                    }`}>
                                                    {type === 'VIRTUAL' ? <Video size={28} /> : <Calendar size={28} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${type === 'VIRTUAL' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-800 text-slate-400 border-white/5'
                                                            }`}>
                                                            {type}
                                                        </span>
                                                        <span className="text-primary font-bold text-[8px] uppercase tracking-widest italic">{status}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white italic uppercase tracking-tight">{docName}</h3>
                                                    <p className="text-xs text-slate-500 font-mono mt-1">{speciality}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:items-end gap-1">
                                                <div className="flex items-center gap-2 text-white font-bold italic text-sm">
                                                    <Clock size={14} className="text-primary" /> {dateStr} at {timeStr}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600 font-mono text-[10px] uppercase">
                                                    <MapPin size={10} /> {type === 'VIRTUAL' ? 'SECURE_TELEHEALTH_NODE' : 'MAIN_CAMPUS_WING_C'}
                                                </div>
                                            </div>

                                            <div className="md:border-l md:border-white/5 md:pl-8">
                                                <Button className={`w-full md:w-auto px-8 font-bold uppercase tracking-widest text-[10px] h-12 ${status === 'Awaiting Check-in' ? 'bg-primary hover:bg-emerald-600' : 'bg-white/5 border border-white/10 text-slate-400'
                                                    }`}>
                                                    {status === 'Awaiting Check-in' ? 'Initialize Check-in' : 'View Details'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>

            <div className="mt-12 flex justify-center">
                <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-white uppercase text-[10px] font-bold">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Return to Hub
                </Button>
            </div>
        </div>
    );
}
