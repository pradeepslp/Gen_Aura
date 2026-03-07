"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Calendar,
    Phone,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Clipboard,
    Heart,
    Activity,
    Pill,
    CheckCircle2,
    Shield
} from 'lucide-react';
import { Button } from '@/components/Button';
import { appointmentApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const COMPLAINT_OPTIONS = ['Fever', 'Headache', 'Chest pain', 'Stomach pain', 'Others'];
const HISTORY_OPTIONS = ['Diabetes', 'Blood Pressure', 'Asthma', 'Heart disease', 'Previous surgeries', 'Others'];
const MEDICATION_OPTIONS = ['BP tablets', 'Diabetes tablets', 'Pain killers', 'Others'];

export default function BookAppointmentPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: '',
        contactNumber: '',
        address: '',
        chiefComplaint: [] as string[],
        complaintDetails: '',
        medicalHistory: [] as string[],
        historyDetails: '',
        currentMedications: [] as string[],
        medicationDetails: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (option: string, field: 'chiefComplaint' | 'medicalHistory' | 'currentMedications') => {
        setFormData(prev => {
            const current = (prev[field] as string[]);
            if (current.includes(option)) {
                return { ...prev, [field]: current.filter(o => o !== option) };
            } else {
                return { ...prev, [field]: [...current, option] };
            }
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await appointmentApi.book(formData);
            setMessage({ type: 'success', text: 'Appointment booked successfully!' });
            setTimeout(() => {
                router.push('/patient');
            }, 2000);
        } catch (error: any) {
            console.error("Booking failed", error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to book appointment' });
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <ProtectedRoute allowedRoles={['PATIENT']}>
            <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Shield size={12} /> Secure Booking Portal
                    </div>
                    <h1 className="text-4xl font-bold text-white italic">Book with Symptoms</h1>
                    <p className="text-slate-200 mt-2 font-mono text-xs uppercase tracking-tighter italic font-bold">Step {step} of 4: {step === 1 ? 'Identity Confirmation' : step === 2 ? 'Chief Complaints' : step === 3 ? 'Medical History' : 'Medications'}</p>
                </header>

                <div className="bg-slate-50/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 p-8 md:p-12 relative overflow-hidden shadow-2xl ring-1 ring-slate-100">
                    <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
                        <Activity size={300} className="text-primary" />
                    </div>

                    {message.text && (
                        <div className={`mb-8 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' : 'bg-red-50 border border-red-100 text-red-600'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={24} /> : <Activity size={24} />}
                            <p className="font-black italic uppercase tracking-widest text-[10px]">{message.text}</p>
                        </div>
                    )}

                    {/* Form Steps */}
                    <div className="space-y-10">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center gap-3 text-primary border-b border-slate-100 pb-4">
                                    <User size={20} className="drop-shadow-sm" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] italic">Personal Identity</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 drop-shadow-sm">Full Identity Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm outline-none"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 drop-shadow-sm">Age / DOB</label>
                                        <input
                                            type="text"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm outline-none"
                                            placeholder="e.g. 28"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 drop-shadow-sm">Gender Identity</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none shadow-sm outline-none"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Non-Binary / Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 drop-shadow-sm">Secure Contact Number</label>
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm outline-none"
                                            placeholder="e.g. +1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 drop-shadow-sm">Residential Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none shadow-sm"
                                            placeholder="Full physical address..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center gap-3 text-primary border-b border-slate-100 pb-4">
                                    <Activity size={20} className="drop-shadow-sm" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] italic">Chief Complaints (Main Problem)</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {COMPLAINT_OPTIONS.map(opt => (
                                        <div
                                            key={opt}
                                            onClick={() => handleCheckboxChange(opt, 'chiefComplaint')}
                                            className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 shadow-sm ${formData.chiefComplaint.includes(opt)
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary/20'
                                                : 'bg-white border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.chiefComplaint.includes(opt) ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                                                }`}>
                                                {formData.chiefComplaint.includes(opt) && <div className="h-2 w-2 bg-white rounded-full" />}
                                            </div>
                                            <span className={`text-sm font-black uppercase tracking-widest italic transition-colors ${formData.chiefComplaint.includes(opt) ? 'text-primary' : 'text-slate-600'}`}>{opt}</span>
                                        </div>
                                    ))}
                                </div>
                                {formData.chiefComplaint.includes('Others') && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 drop-shadow-sm">Specify Other Concerns</label>
                                        <textarea
                                            name="complaintDetails"
                                            value={formData.complaintDetails}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none shadow-sm outline-none"
                                            placeholder="Please describe your problem in detail..."
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center gap-3 text-primary border-b border-slate-100 pb-4">
                                    <Clipboard size={20} className="drop-shadow-sm" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] italic">Medical History</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {HISTORY_OPTIONS.map(opt => (
                                        <div
                                            key={opt}
                                            onClick={() => handleCheckboxChange(opt, 'medicalHistory')}
                                            className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 shadow-sm ${formData.medicalHistory.includes(opt)
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary/20'
                                                : 'bg-white border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.medicalHistory.includes(opt) ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                                                }`}>
                                                {formData.medicalHistory.includes(opt) && <div className="h-2 w-2 bg-white rounded-full" />}
                                            </div>
                                            <span className={`text-sm font-black uppercase tracking-widest italic transition-colors ${formData.medicalHistory.includes(opt) ? 'text-primary' : 'text-slate-600'}`}>{opt}</span>
                                        </div>
                                    ))}
                                </div>
                                {formData.medicalHistory.includes('Others') && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 drop-shadow-sm">Specify Other Conditions / History</label>
                                        <textarea
                                            name="historyDetails"
                                            value={formData.historyDetails}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none shadow-sm outline-none"
                                            placeholder="Any other significant medical events or conditions..."
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center gap-3 text-primary border-b border-slate-100 pb-4">
                                    <Pill size={20} className="drop-shadow-sm" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] italic">Current Medications</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {MEDICATION_OPTIONS.map(opt => (
                                        <div
                                            key={opt}
                                            onClick={() => handleCheckboxChange(opt, 'currentMedications')}
                                            className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 shadow-sm ${formData.currentMedications.includes(opt)
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary/20'
                                                : 'bg-white border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.currentMedications.includes(opt) ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                                                }`}>
                                                {formData.currentMedications.includes(opt) && <div className="h-2 w-2 bg-white rounded-full" />}
                                            </div>
                                            <span className={`text-sm font-black uppercase tracking-widest italic transition-colors ${formData.currentMedications.includes(opt) ? 'text-primary' : 'text-slate-600'}`}>{opt}</span>
                                        </div>
                                    ))}
                                </div>
                                {formData.currentMedications.includes('Others') && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 drop-shadow-sm">List Other Active Medicines</label>
                                        <textarea
                                            name="medicationDetails"
                                            value={formData.medicationDetails}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none shadow-sm outline-none"
                                            placeholder="Dosage and frequency if possible..."
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="mt-12 flex justify-between gap-4 border-t border-white/5 pt-8">
                        <Button
                            variant="ghost"
                            onClick={step === 1 ? () => router.back() : prevStep}
                            className="text-slate-400 hover:text-white uppercase text-[10px] font-bold tracking-widest"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" /> {step === 1 ? 'Back to Portal' : 'Previous Section'}
                        </Button>

                        {step < 4 ? (
                            <Button
                                onClick={nextStep}
                                className="bg-primary hover:bg-emerald-600 px-10 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white shadow-xl shadow-primary/20"
                            >
                                Continue <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                isLoading={isLoading}
                                className="bg-primary hover:bg-emerald-600 px-10 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white shadow-xl shadow-primary/20"
                            >
                                Secure My Appointment <CheckCircle2 className="h-4 w-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="mt-8 p-6 rounded-[2rem] bg-white/5 border border-white/5 flex items-start gap-4 ring-1 ring-white/10 shadow-sm">
                    <Shield className="text-primary h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Encrypted Submission</p>
                        <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                            YOUR INPUT DATA IS PROTECTED BY AES-256 AUTOMATIC ENCRYPTION. ONLY AUTHORIZED CLINICAL STAFF CAN DECRYPT THIS RECORD DURING YOUR VISIT.
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
