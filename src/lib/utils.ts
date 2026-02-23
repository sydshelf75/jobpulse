import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatSalary(min?: number | null, max?: number | null): string {
    if (!min && !max) return "Not disclosed";
    const fmt = (n: number) => {
        if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
        if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
        return `₹${n}`;
    };
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max!)}`;
}

export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        APPLIED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        IN_REVIEW: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        INTERVIEW: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        OFFER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        APPLIED: "Applied",
        IN_REVIEW: "In Review",
        INTERVIEW: "Interview",
        OFFER: "Offer",
        REJECTED: "Rejected",
    };
    return labels[status] || status;
}

export function getSourceIcon(source: string): string {
    const icons: Record<string, string> = {
        linkedin: "💼",
        naukri: "🔵",
        indeed: "🟣",
        jsearch: "🔍",
        company: "🏢",
    };
    return icons[source] || "📄";
}

export const APPLICATION_STATUSES = [
    "APPLIED",
    "IN_REVIEW",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
] as const;

export const JOB_SOURCES = [
    "linkedin",
    "naukri",
    "indeed",
    "jsearch",
    "company",
] as const;

export const EXPERIENCE_LEVELS = [
    "fresher",
    "junior",
    "mid",
    "senior",
    "lead",
] as const;

export const JOB_TYPES = ["remote", "hybrid", "onsite"] as const;
