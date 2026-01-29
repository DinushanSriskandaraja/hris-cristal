"use client";

import { Bell, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
    const { user, logout } = useUserStore();

    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-stone-200/50 bg-white/60 backdrop-blur-md px-4 shadow-sm sm:px-6 lg:px-8 dark:border-stone-800/50 dark:bg-stone-950/60">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="lg:hidden text-muted-foreground hover:text-foreground"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="relative hidden sm:block w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full rounded-md border border-input bg-secondary pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{user?.role || 'Guest'}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout} className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
