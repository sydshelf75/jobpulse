import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    trend?: number;
    color?: string;
    bgColor?: string;
}

export function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    color = "text-[var(--brand-primary-light)]",
    bgColor = "bg-[var(--brand-primary)]/10",
}: StatCardProps) {
    return (
        <div className="glass-card p-5 group">
            <div className="flex items-start justify-between mb-3">
                <div
                    className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        bgColor
                    )}
                >
                    <Icon className={cn("w-5 h-5", color)} />
                </div>
                {trend !== undefined && (
                    <div
                        className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            trend >= 0 ? "text-emerald-400" : "text-red-400"
                        )}
                    >
                        {trend >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                {value}
            </div>
            <div className="text-sm text-[var(--text-tertiary)]">{label}</div>
        </div>
    );
}
