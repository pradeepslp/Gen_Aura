import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Activity,
    ShieldAlert,
    Settings,
    FileText,
    UserCircle,
    Clipboard,
    Activity as Pulse,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const menuItemsByRole: Record<string, any[]> = {
    ADMIN: [
        { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
        { icon: Users, label: 'Identity Mgmt', href: '/admin/users' },
        { icon: ShieldAlert, label: 'Security Alerts', href: '/admin/alerts' },
        { icon: Activity, label: 'Anomaly Logs', href: '/admin/logs' },
        { icon: FileText, label: 'Audit Trail', href: '/admin/audit' },
        { icon: Settings, label: 'System Config', href: '/admin/config' },
    ],
    DOCTOR: [
        { icon: LayoutDashboard, label: 'Clinical Portal', href: '/doctor' },
        { icon: Users, label: 'My Patients', href: '/doctor/patients' },
        { icon: Clipboard, label: 'Prescriptions', href: '/doctor/prescriptions' },
        { icon: FileText, label: 'Lab Analysis', href: '/doctor/labs' },
        { icon: Settings, label: 'Profile', href: '/doctor/profile' },
    ],
    PATIENT: [
        { icon: LayoutDashboard, label: 'Member Home', href: '/patient' },
        { icon: FileText, label: 'Medical Records', href: '/patient/records' },
        { icon: Clipboard, label: 'My Meds', href: '/patient/prescriptions' },
        { icon: Activity, label: 'Vitals Log', href: '/patient/vitals' },
        { icon: UserCircle, label: 'Digital Identity', href: '/patient/profile' },
    ]
};

export const Sidebar = () => {
    const pathname = usePathname();
    const { user } = useAuth();

    const role = user?.role || 'PATIENT';
    const menuItems = menuItemsByRole[role] || menuItemsByRole.PATIENT;

    return (
        <div className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl md:block">
            <div className="flex h-full flex-col p-4">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-white/5 group',
                                pathname === item.href ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white'
                            )}
                        >
                            <item.icon className={cn(
                                'h-5 w-5 transition-transform group-hover:scale-110',
                                pathname === item.href ? 'text-primary' : 'text-slate-500 group-hover:text-white'
                            )} />
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="mt-auto p-2">
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <ShieldAlert className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-xs font-bold text-primary italic uppercase tracking-widest">Zero-Trust Active</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                            {user?.email}<br />
                            <span className="opacity-50">NODE: AP-SOUTH-1</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
