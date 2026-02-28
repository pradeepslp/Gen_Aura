'use client';

import React from 'react';
import { Settings, Server, Shield, Database, Lock, Globe, HardDrive } from 'lucide-react';

export default function SystemConfigPage() {
    return (
        <div className="space-y-6 animate-fade-in relative z-10 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3">
                    <Settings className="w-8 h-8 text-blue-400" />
                    SYSTEM CONFIGURATION
                </h1>
                <p className="text-blue-200/60 uppercase tracking-widest text-xs mt-2 font-bold select-none">
                    Core Platform Parameters & Security Modules
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Authentication Settings */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2 border-b border-blue-900/30 pb-3">
                        <Lock className="w-5 h-5 text-blue-400" />
                        Authentication
                    </h2>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Force Multi-Factor Auth (MFA)</p>
                                <p className="text-xs text-slate-400">Require MFA for all clinical staff.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Session Timeout (Minutes)</p>
                                <p className="text-xs text-slate-400">Auto-logout idle users.</p>
                            </div>
                            <input type="number" defaultValue={15} className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-center text-white font-mono text-sm" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">JWT Access Expiry</p>
                                <p className="text-xs text-slate-400">Lifespan of access tokens.</p>
                            </div>
                            <select className="bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono text-sm">
                                <option>15m</option>
                                <option>30m</option>
                                <option>1h</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Audit & Logging */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2 border-b border-blue-900/30 pb-3">
                        <Database className="w-5 h-5 text-purple-400" />
                        Audit & Compliance
                    </h2>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Strict Audit Mode</p>
                                <p className="text-xs text-slate-400">Block actions if logging fails.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Log Retention (Days)</p>
                                <p className="text-xs text-slate-400">HIPAA minimum requirement: 2190 (6 years)</p>
                            </div>
                            <input type="number" defaultValue={2190} className="w-24 bg-slate-900 border border-slate-700 rounded p-1 text-center text-white font-mono text-sm" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">PHI Redaction Level</p>
                                <p className="text-xs text-slate-400">Mask patient data in general logs.</p>
                            </div>
                            <select className="bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono text-sm">
                                <option>Full Redaction</option>
                                <option>Partial (Last 4)</option>
                                <option>None (Admin Only)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Threat Detection */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2 border-b border-blue-900/30 pb-3">
                        <Shield className="w-5 h-5 text-red-400" />
                        Threat Detection
                    </h2>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Anomaly AI Engine</p>
                                <p className="text-xs text-slate-400">Real-time behavioral analysis.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Auto-Suspend Threshold</p>
                                <p className="text-xs text-slate-400">Failed logins before lockout.</p>
                            </div>
                            <input type="number" defaultValue={5} className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-center text-white font-mono text-sm" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">IP Geofencing</p>
                                <p className="text-xs text-slate-400">Restrict access to approved regions.</p>
                            </div>
                            <button className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-600 hover:bg-slate-700 transition-colors">
                                CONFIGURE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Infrastructure */}
                <div className="glass-panel p-6 opacity-80">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2 border-b border-blue-900/30 pb-3">
                        <Server className="w-5 h-5 text-emerald-400" />
                        Infrastructure (Read-Only)
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2"><Globe className="w-4 h-4" /> Primary Node</span>
                            <span className="text-emerald-400 font-mono">us-east-cluster-1a</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2"><Database className="w-4 h-4" /> DB Connection</span>
                            <span className="text-emerald-400 font-mono">postgres://secure...</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2"><HardDrive className="w-4 h-4" /> Storage</span>
                            <span className="text-emerald-400 font-mono">S3: securecare-vault</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-8 flex justify-end">
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    SAVE CONFIGURATION
                </button>
            </div>
        </div>
    );
}
