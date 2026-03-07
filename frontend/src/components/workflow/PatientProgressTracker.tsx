'use client';

import React, { useState, useEffect } from 'react';
import { workflowApi } from '@/lib/api';
import { CheckCircle2, Clock, ArrowRightLeft, Check, AlertCircle } from 'lucide-react';

interface WorkflowStep {
    id: string;
    actionTaken: string;
    comments: string;
    createdAt: string;
    toDept: { name: string };
    fromDept: { name: string } | null;
    actor: {
        email: string;
        doctorProfile?: { firstName: string; lastName: string; specialization: string };
        labTechnicianProfile?: { firstName: string; lastName: string };
    };
}

interface WorkflowRequest {
    id: string;
    title: string;
    status: string;
    currentDept: { name: string };
    steps: WorkflowStep[];
}

export const PatientProgressTracker = ({ requestId }: { requestId: string }) => {
    const [request, setRequest] = useState<WorkflowRequest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await workflowApi.getHistory(requestId);
                setRequest(res.data.request);
            } catch (error) {
                console.error('Failed to fetch workflow history', error);
            } finally {
                setLoading(false);
            }
        };

        if (requestId) fetchHistory();
    }, [requestId]);

    if (loading) return <div className="p-4 text-center text-gray-500">Loading tracker...</div>;
    if (!request) return <div className="p-4 text-center text-red-500">Request not found.</div>;

    const getStatusIcon = (action: string) => {
        switch (action) {
            case 'REQUEST_CREATED': return <Clock className="w-5 h-5 text-blue-500" />;
            case 'TRANSFERRED': return <ArrowRightLeft className="w-5 h-5 text-purple-500" />;
            case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{request.title}</h3>
                    <p className="text-sm text-gray-500">Tracking ID: {request.id.slice(0, 8)}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-semibold ${request.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 font-pulse'
                    }`}>
                    {request.status}
                </div>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100"></div>

                <div className="space-y-8">
                    {request.steps.map((step, index) => (
                        <div key={step.id} className="relative flex items-start pl-12">
                            {/* Icon Circle */}
                            <div className={`absolute left-0 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 ${index === request.steps.length - 1 ? 'bg-blue-50' : 'bg-gray-50'
                                }`}>
                                {getStatusIcon(step.actionTaken)}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-800">
                                        {step.actionTaken === 'REQUEST_CREATED' && 'Request Submitted'}
                                        {step.actionTaken === 'TRANSFERRED' && `Moved to ${step.toDept.name}`}
                                        {step.actionTaken === 'COMPLETED' && 'Requirement Satisfied'}
                                        {step.actionTaken === 'IN_PROGRESS' && 'Processing Started'}
                                    </h4>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {new Date(step.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 italic">"{step.comments}"</p>
                                <div className="mt-2 text-xs font-medium text-gray-500 flex items-center">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">Action by</span>
                                    {step.actor.doctorProfile
                                        ? `Dr. ${step.actor.doctorProfile.firstName} ${step.actor.doctorProfile.lastName} (${step.actor.doctorProfile.specialization})`
                                        : step.actor.labTechnicianProfile
                                            ? `${step.actor.labTechnicianProfile.firstName} ${step.actor.labTechnicianProfile.lastName} (Lab)`
                                            : step.actor.email
                                    }
                                </div>
                            </div>
                        </div>
                    ))}

                    {request.status !== 'COMPLETED' && (
                        <div className="relative flex items-start pl-12 opacity-50">
                            <div className="absolute left-0 w-12 h-12 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center shadow-sm z-10">
                                <Clock className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-400">Next Step</h4>
                                <p className="text-sm text-gray-400">Currently with {request.currentDept.name}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
