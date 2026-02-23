"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockApplications } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import {
    GripVertical,
    ExternalLink,
    MoreHorizontal,
    Plus,
    Clock,
    Building2,
} from "lucide-react";

const COLUMNS = [
    { id: "APPLIED", label: "Applied", color: "border-blue-500/50" },
    { id: "IN_REVIEW", label: "In Review", color: "border-amber-500/50" },
    { id: "INTERVIEW", label: "Interview", color: "border-purple-500/50" },
    { id: "OFFER", label: "Offer", color: "border-emerald-500/50" },
    { id: "REJECTED", label: "Rejected", color: "border-red-500/50" },
];

export default function ApplicationsPage() {
    const [applications, setApplications] = useState(mockApplications);

    const getColumnApps = (status: string) =>
        applications.filter((app) => app.status === status);

    const moveApplication = (appId: string, newStatus: string) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === appId
                    ? { ...app, status: newStatus as typeof app.status }
                    : app
            )
        );
    };

    return (
        <div className="max-w-full mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Application Tracker
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Track your applications across different stages
                    </p>
                </div>
                <Button size="sm">
                    <Plus className="w-4 h-4" />
                    Add Application
                </Button>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {COLUMNS.map((column) => {
                    const columnApps = getColumnApps(column.id);
                    return (
                        <div
                            key={column.id}
                            className="min-w-[280px] flex-1"
                        >
                            {/* Column Header */}
                            <div
                                className={`flex items-center justify-between mb-3 pb-2 border-b-2 ${column.color}`}
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                                        {column.label}
                                    </h3>
                                    <span className="px-1.5 py-0.5 rounded-md text-xs bg-[var(--bg-elevated)] text-[var(--text-tertiary)]">
                                        {columnApps.length}
                                    </span>
                                </div>
                            </div>

                            {/* Column Cards */}
                            <div className="space-y-3 kanban-column">
                                {columnApps.map((app) => (
                                    <div
                                        key={app.id}
                                        className="glass-card p-4 kanban-item group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <GripVertical className="w-4 h-4 text-[var(--text-muted)] cursor-grab" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {COLUMNS.filter((c) => c.id !== app.status).map(
                                                    (target) => (
                                                        <button
                                                            key={target.id}
                                                            onClick={() =>
                                                                moveApplication(app.id, target.id)
                                                            }
                                                            className="hidden group-hover:block p-1 rounded text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                                                            title={`Move to ${target.label}`}
                                                        >
                                                            →
                                                        </button>
                                                    )
                                                )}
                                                <button className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                                            {app.job.title}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-2">
                                            <Building2 className="w-3 h-3" />
                                            {app.job.company}
                                        </div>

                                        {app.notes && (
                                            <p className="text-xs text-[var(--text-tertiary)] mb-2 line-clamp-2">
                                                {app.notes}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)]">
                                            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                                <Clock className="w-3 h-3" />
                                                {formatRelativeTime(app.appliedAt)}
                                            </span>
                                            <a
                                                href={app.job.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--text-muted)] hover:text-[var(--brand-primary-light)] transition-colors"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                ))}

                                {columnApps.length === 0 && (
                                    <div className="text-center py-8 text-xs text-[var(--text-muted)] border-2 border-dashed border-[var(--border-default)] rounded-lg">
                                        No applications
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
