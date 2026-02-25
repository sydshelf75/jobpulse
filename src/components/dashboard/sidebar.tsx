"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Zap,
    LayoutDashboard,
    Briefcase,
    KanbanSquare,
    CalendarDays,
    Eye,
    Settings,
    TrendingUp,
    Menu,
    X,
    LogOut,
    MessageCircle,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
    { href: "/dashboard/applications", label: "Applications", icon: KanbanSquare },
    { href: "/dashboard/interviews", label: "Interviews", icon: CalendarDays },
    { href: "/dashboard/watchlist", label: "Watchlist", icon: Eye },
    { href: "/dashboard/trends", label: "Trends", icon: TrendingUp },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass"
            >
                <Menu className="w-5 h-5 text-[var(--text-primary)]" />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full w-[var(--sidebar-width)] bg-[var(--bg-secondary)] border-r border-[var(--border-default)] flex flex-col z-40 transition-transform duration-300",
                    "md:translate-x-0",
                    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="h-[var(--topbar-height)] flex items-center gap-3 px-6 border-b border-[var(--border-default)]">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                        JobPulse
                    </span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden ml-auto p-1 rounded text-[var(--text-tertiary)]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-[var(--brand-primary)]/15 text-[var(--brand-primary-light)] border border-[var(--brand-primary)]/20"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                                )}
                            >
                                <item.icon className="w-4.5 h-4.5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-3 border-t border-[var(--border-default)] space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                    >
                        <MessageCircle className="w-4.5 h-4.5" />
                        Telegram Chat
                    </Link>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
                        <LogOut className="w-4.5 h-4.5" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
