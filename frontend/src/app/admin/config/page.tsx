'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Server, Shield, Database, Lock, Globe, HardDrive, ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function SystemConfigPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        mfaEnabled: true,
        sessionTimeout: 15,
        jwtExpiry: '15m',
        strictAudit: false,
        logRetention: 2190,
        phiRedaction: 'Full Redaction',
        anomalyEngine: true,
        lockoutThreshold: 5
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await adminApi.getConfig();
                if (response.data.success) {
                    setConfig(response.data.config);
                }
            } catch (error) {
                console.error('Failed to fetch config:', error);
                toast.error('Failed to load system configuration');
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await adminApi.updateConfig(config);
            if (response.data.success) {
                toast.success('Configuration deployed successfully');
            }
        } catch (error) {
            console.error('Failed to save config:', error);
            toast.error('Deployment failed. Please check backend logs.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-10 px-4 md:px-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-200 hover:bg-slate-50 shrink-0 text-slate-500" onClick={() => router.push('/admin')}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 italic flex items-center gap-3">
                            <Settings className="w-8 h-8 text-primary" />
                            System Configuration
                        </h1>
                        <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest text-[10px] font-bold">Core Platform Parameters & Security Modules</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Authentication Settings */}
                <div className="glass p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4 italic">
                        <Lock className="w-5 h-5 text-primary" />
                        Authentication
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Force Multi-Factor Auth (MFA)</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Require MFA for all clinical staff.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={config.mfaEnabled}
                                    onChange={(e) => handleChange('mfaEnabled', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Session Timeout</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Auto-logout duration in minutes.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={config.sessionTimeout}
                                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                                    className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-slate-900 font-mono text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                                <span className="text-[10px] font-bold text-slate-400">MIN</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">JWT Access Expiry</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Lifespan of secure access tokens.</p>
                            </div>
                            <select
                                value={config.jwtExpiry}
                                onChange={(e) => handleChange('jwtExpiry', e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                            >
                                <option>15m</option>
                                <option>30m</option>
                                <option>1h</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Audit & Logging */}
                <div className="glass p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4 italic">
                        <Database className="w-5 h-5 text-purple-600" />
                        Audit & Compliance
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Strict Audit Mode</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Block actions if logging fails.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={config.strictAudit}
                                    onChange={(e) => handleChange('strictAudit', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 shadow-sm"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Log Retention</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">HIPAA Req: 2190 Days (6 Years)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={config.logRetention}
                                    onChange={(e) => handleChange('logRetention', parseInt(e.target.value))}
                                    className="w-24 bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-slate-900 font-mono text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                                <span className="text-[10px] font-bold text-slate-400">DAYS</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">PHI Redaction Level</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Mask sensitive data in general logs.</p>
                            </div>
                            <select
                                value={config.phiRedaction}
                                onChange={(e) => handleChange('phiRedaction', e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                            >
                                <option>Full Redaction</option>
                                <option>Partial (Last 4)</option>
                                <option>None (Admin Only)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Threat Detection */}
                <div className="glass p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4 italic">
                        <Shield className="w-5 h-5 text-primary" />
                        Threat Detection
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Anomaly AI Engine</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Real-time behavior analysis module.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={config.anomalyEngine}
                                    onChange={(e) => handleChange('anomalyEngine', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 shadow-sm"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Lockout Threshold</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Failed logins before identity freeze.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={config.lockoutThreshold}
                                    onChange={(e) => handleChange('lockoutThreshold', parseInt(e.target.value))}
                                    className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-slate-900 font-mono text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                                <span className="text-[10px] font-bold text-slate-400">ATT</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">IP Geofencing</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Restriction to approved geo-regions.</p>
                            </div>
                            <Button variant="outline" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest border-slate-200 hover:bg-slate-50 rounded-xl">
                                Configure
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Infrastructure */}
                <div className="glass p-8 rounded-[2rem] border border-slate-200 shadow-sm bg-slate-50/30">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4 italic">
                        <Server className="w-5 h-5 text-emerald-600" />
                        Infrastructure <span className="text-[10px] font-mono not-italic text-slate-400 ml-auto uppercase font-bold tracking-tighter">Read-Only</span>
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-500" /> Primary Node</span>
                            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">us-east-cluster-1a</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Database className="w-4 h-4 text-emerald-500" /> DB Cluster</span>
                            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">psql://secure-main</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><HardDrive className="w-4 h-4 text-emerald-500" /> Vault Storage</span>
                            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">S3: securecare-vault</span>
                        </div>
                    </div>
                    <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">All Core Nodes Operational</span>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-end gap-4 pb-12">
                <Button
                    variant="ghost"
                    className="h-14 px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
                    onClick={() => router.back()}
                    disabled={saving}
                >
                    Cancel Changes
                </Button>
                <Button
                    className="h-14 px-12 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-cyan-600 transition-all shadow-xl shadow-primary/30 flex items-center gap-2 min-w-[240px] justify-center"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Deploying...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Deploy Global Configuration
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
