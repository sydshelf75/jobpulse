import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
    return (
        <div
            className={cn(
                "glass-card p-6",
                hover && "hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-glow)]",
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-default)]",
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardTitle({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h3
            className={cn(
                "text-lg font-semibold text-[var(--text-primary)]",
                className
            )}
        >
            {children}
        </h3>
    );
}
