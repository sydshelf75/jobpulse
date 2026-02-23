import { cn, getStatusColor, getStatusLabel } from "@/lib/utils";

interface BadgeProps {
    status: string;
    className?: string;
}

export function Badge({ status, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                getStatusColor(status),
                className
            )}
        >
            {getStatusLabel(status)}
        </span>
    );
}

interface SourceBadgeProps {
    source: string;
    className?: string;
}

const sourceColors: Record<string, string> = {
    linkedin: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    naukri: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    indeed: "bg-purple-500/15 text-purple-400 border-purple-500/25",
    jsearch: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    company: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize",
                sourceColors[source] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
                className
            )}
        >
            {source}
        </span>
    );
}
