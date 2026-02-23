"use client";

import { Bell, Search } from "lucide-react";
import { useState } from "react";

export function Topbar() {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="h-[var(--topbar-height)] border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left - Page Title or Search */}
            <div className="flex items-center gap-4 flex-1 ml-10 md:ml-0">
                {searchOpen ? (
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search jobs, companies, applications..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)]/50"
                                onBlur={() => setSearchOpen(false)}
                            />
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all"
                    >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Search...</span>
                        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)]">
                            ⌘K
                        </kbd>
                    </button>
                )}
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--brand-danger)] animate-pulse" />
                </button>

                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                    D
                </div>
            </div>
        </header>
    );
}
