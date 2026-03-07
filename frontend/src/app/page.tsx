import Link from 'next/link';
import { Shield, Lock, Activity, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 pl-1 pr-4 py-1.5 text-sm font-medium text-primary mb-8 animate-fade-in group hover:bg-primary/10 transition-all cursor-default">
            <img src="/vercel.svg" alt="SecureCare" className="h-6 w-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Standardized Healthcare Security v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
            Secure Access for <br />
            <span className="gradient-text italic">Modern Healthcare</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed italic">
            Zero-trust security meets effortless access management. Protect patient data,
            detect anomalies in real-time, and maintain absolute compliance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] bg-primary text-white hover:opacity-90 shadow-xl shadow-primary/20 w-full sm:w-auto h-16 px-10 text-lg uppercase tracking-widest text-sm"
            >
              Secure Your Platform <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 w-full sm:w-auto h-16 px-10 text-lg uppercase tracking-widest text-sm"
            >
              Member Login
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 grayscale opacity-30 contrast-125">
            <div className="flex items-center justify-center font-bold text-xl tracking-tighter italic">HEALTHNET</div>
            <div className="flex items-center justify-center font-bold text-xl tracking-tighter italic">MEDICURE</div>
            <div className="flex items-center justify-center font-bold text-xl tracking-tighter italic">BIOGUARD</div>
            <div className="flex items-center justify-center font-bold text-xl tracking-tighter italic">CARELINK</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 uppercase tracking-tight italic">Unmatched Security Layers</h2>
            <p className="text-slate-500 max-w-xl mx-auto italic">
              Our zero-trust architecture ensures that every access request is verified,
              authorized, and inspected every single time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="h-6 w-6" />,
                title: "RBAC & ABAC Control",
                description: "Fine-grained access control based on roles and dynamic attributes of users and environment."
              },
              {
                icon: <Activity className="h-6 w-6" />,
                title: "Anomaly Detection",
                description: "Real-time monitoring and AI-driven risk scoring to prevent unauthorized data access."
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Unified Identity",
                description: "Centralized identity management for doctors, patients, and administrative staff."
              }
            ].map((feature, i) => (
              <div key={i} className="glass p-8 rounded-3xl hover:border-primary/30 transition-all group border border-slate-200 bg-white/50 shadow-sm">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 italic">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-accent p-12 rounded-[3rem] border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-primary/5">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6 text-slate-900 italic line-clamp-2">Designed for HIPAA & HL7 Compliance</h2>
              <div className="space-y-4">
                {[
                  "End-to-End Encryption for all Health Records",
                  "Automated Audit Trails for Forensic Analysis",
                  "Emergency Break-Glass access protocols",
                  "Dynamic Risk Verification system"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium italic">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-slate-500 font-mono ml-2">securecare-monitoring.sh</span>
              </div>
              <div className="space-y-2 font-mono text-[11px] text-blue-400">
                <p>Initializing SecureCare OS v4.2...</p>
                <p className="text-emerald-400 font-bold">[OK] Zero-Trust Module Loaded</p>
                <p className="text-emerald-400 font-bold">[OK] Encryption Keys Verified</p>
                <p className="text-slate-500">&gt; Scanning for anomalies...</p>
                <p className="text-slate-500">&gt; Status: 100% Secure</p>
                <p className="text-primary animate-pulse">_</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-100 text-center space-y-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <img src="/vercel.svg" alt="SecureCare Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">Secure<span className="text-primary">Care</span></span>
          </div>
          <p className="text-slate-500 text-sm italic max-w-md mb-8">
            Protecting healthcare data with advanced zero-trust protocols and real-time monitoring.
          </p>
          <div className="flex justify-center gap-8 mb-8">
            <Link href="/admin/login" className="text-[10px] text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors font-bold">
              Admin Portal
            </Link>
            <Link href="#" className="text-[10px] text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors font-bold">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[10px] text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors font-bold">
              Compliance
            </Link>
          </div>
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">© 2026 SecureCare Platforms Inc. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
