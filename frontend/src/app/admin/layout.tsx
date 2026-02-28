"use client";

import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-[#050505]">
            <Sidebar />
            <div className="flex-1 md:pl-64">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
