import Link from 'next/link';
import { Shield, Lock, Activity, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-fade-in">
            <Shield className="h-4 w-4" />
            <span>Standardized Healthcare Security v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Secure Access for <br />
            <span className="gradient-text">Modern Healthcare</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
            Zero-trust security meets effortless access management. Protect patient data,
            detect anomalies in real-time, and maintain absolute compliance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] bg-primary text-white hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] w-full sm:w-auto h-14 px-8 text-lg"
            >
              Secure Your Platform <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] border border-border bg-transparent hover:bg-white/5 w-full sm:w-auto h-14 px-8 text-lg"
            >
              Member Login
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 grayscale opacity-50 contrast-125">
            <div className="flex items-center justify-center font-bold text-xl">HEALTHNET</div>
            <div className="flex items-center justify-center font-bold text-xl">MEDICURE</div>
            <div className="flex items-center justify-center font-bold text-xl">BIOGUARD</div>
            <div className="flex items-center justify-center font-bold text-xl">CARELINK</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Unmatched Security Layers</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
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
              <div key={i} className="glass p-8 rounded-2xl hover:border-primary/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-accent p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6">Designed for HIPAA & HL7 Compliance</h2>
              <div className="space-y-4">
                {[
                  "End-to-End Encryption for all Health Records",
                  "Automated Audit Trails for Forensic Analysis",
                  "Emergency Break-Glass access protocols",
                  "Dynamic Risk Verification system"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-md bg-black/40 border border-white/5 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-slate-500 ml-2">securecare-monitoring.sh</span>
              </div>
              <div className="space-y-2 font-mono text-[11px] text-blue-400">
                <p>Initializing SecureCare OS v4.2...</p>
                <p className="text-green-400">[OK] Zero-Trust Module Loaded</p>
                <p className="text-green-400">[OK] Encryption Keys Verified</p>
                <p className="text-slate-400">&gt; Scanning for anomalies...</p>
                <p className="text-slate-400">&gt; Status: 100% Secure</p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center space-y-4">
        <p className="text-slate-500 text-sm">© 2026 SecureCare Platforms Inc. All Rights Reserved.</p>
        <div className="flex justify-center gap-6">
          <Link href="/admin/login" className="text-[10px] text-slate-600 uppercase tracking-widest hover:text-primary transition-colors font-bold">
            Admin Portal
          </Link>
          <Link href="#" className="text-[10px] text-slate-600 uppercase tracking-widest hover:text-white transition-colors font-bold">
            Privacy Policy
          </Link>
          <Link href="#" className="text-[10px] text-slate-600 uppercase tracking-widest hover:text-white transition-colors font-bold">
            Compliance
          </Link>
        </div>
      </footer>
    </div>
  );
}
