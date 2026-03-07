'use client';

import React, { useState, useEffect } from 'react';
import { workflowApi } from '@/lib/api';
import { Button } from '@/components/Button';
import { toast } from 'react-hot-toast';

interface WorkflowRequest {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    patient: {
        id: string;
        email: string;
        patientProfile: {
            firstName: true;
            lastName: true;
        };
    };
    updatedAt: string;
}

export const StaffTaskBoard = () => {
    const [queue, setQueue] = useState<WorkflowRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<any[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
    const [transferDeptId, setTransferDeptId] = useState('');
    const [actionComments, setActionComments] = useState('');

    useEffect(() => {
        fetchQueue();
        fetchDepartments();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await workflowApi.getQueue();
            setQueue(res.data.queue);
        } catch (error) {
            console.error('Failed to fetch queue', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await workflowApi.getDepartments();
            setDepartments(res.data.departments);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    const handleAction = async (requestId: string, status: string, nextDeptId?: string) => {
        try {
            await workflowApi.moveRequest(requestId, {
                status,
                toDeptId: nextDeptId,
                actionTaken: status === 'COMPLETED' ? 'COMPLETED' : 'TRANSFERRED',
                comments: actionComments || `Status updated to ${status}`
            });
            toast.success(`Request ${status.toLowerCase()} successfully`);
            setSelectedRequest(null);
            setActionComments('');
            fetchQueue();
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading department queue...</div>;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-800">Department Task Board</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {queue.length} Tasks Active
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Patient</th>
                            <th className="px-6 py-4 font-semibold">Request</th>
                            <th className="px-6 py-4 font-semibold">Priority</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Last Update</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {queue.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    No active requests in your department's queue.
                                </td>
                            </tr>
                        ) : (
                            queue.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {req.patient.patientProfile ? `${req.patient.patientProfile.firstName} ${req.patient.patientProfile.lastName}` : 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-500">{req.patient.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-800">{req.title}</div>
                                        <div className="text-xs text-gray-500 truncate w-48">{req.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
                                            req.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                                req.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {req.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center text-sm ${req.status === 'OPEN' ? 'text-green-600' :
                                            req.status === 'IN_PROGRESS' ? 'text-blue-600' :
                                                req.status === 'TRANSFERRED' ? 'text-purple-600' :
                                                    'text-gray-600'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full mr-2 ${req.status === 'OPEN' ? 'bg-green-600' :
                                                req.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                                                    req.status === 'TRANSFERRED' ? 'bg-purple-600' :
                                                        'bg-gray-600'
                                                }`}></span>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(req.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setSelectedRequest(req.id)}
                                        >
                                            Transfer
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => handleAction(req.id, 'COMPLETED')}
                                        >
                                            Complete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Transfer Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Transfer Request</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Department</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={transferDeptId}
                                    onChange={(e) => setTransferDeptId(e.target.value)}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Add notes for the next department..."
                                    value={actionComments}
                                    onChange={(e) => setActionComments(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <Button variant="secondary" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                                <Button
                                    variant="primary"
                                    disabled={!transferDeptId}
                                    onClick={() => handleAction(selectedRequest, 'TRANSFERRED', transferDeptId)}
                                >
                                    Confirm Transfer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
