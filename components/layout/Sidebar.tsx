"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Briefcase,
    CreditCard,
    BarChart,
    Settings,
    LogOut,
    Menu
} from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_NAME, COMPANY_NAME } from "@/utils/constants";
import { useUserStore } from "@/store/useUserStore";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ['admin', 'employee'] },
    { name: "Employees", href: "/employees", icon: Users, roles: ['admin'] },
    { name: "Attendance", href: "/attendance", icon: CalendarCheck, roles: ['admin', 'employee'] },
    { name: "Leave", href: "/leave", icon: Briefcase, roles: ['admin', 'employee'] },
    { name: "Payroll", href: "/payroll", icon: CreditCard, roles: ['admin', 'employee'] },
    { name: "Reports", href: "/reports", icon: BarChart, roles: ['admin'] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ['admin', 'employee'] },
];

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useUserStore();
    const userRole = user?.role || 'employee'; // Default to employee if not set, though should be protected

    const filteredItems = sidebarItems.filter(item => item.roles.includes(userRole));

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden",
                    sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "absolute left-0 top-0 z-20 flex h-screen w-72 flex-col overflow-y-hidden border-r border-stone-200/50 bg-white/60 backdrop-blur-md transition-transform duration-300 ease-in-out dark:border-stone-800/50 dark:bg-stone-950/60 lg:static lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center px-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xs">C</span>
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-foreground">
                            {APP_NAME}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3">
                    <div className="mb-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Menu
                    </div>
                    <nav className="space-y-0.5">
                        {filteredItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-secondary text-secondary-foreground"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">{COMPANY_NAME}</p>
                            <p className="text-xs text-muted-foreground">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
