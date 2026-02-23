import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                {
                    "gradient-primary text-white hover:opacity-90 hover:scale-[1.02]":
                        variant === "primary",
                    "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]":
                        variant === "secondary",
                    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]":
                        variant === "ghost",
                    "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20":
                        variant === "danger",
                    "border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50 hover:text-[var(--brand-primary-light)]":
                        variant === "outline",
                },
                {
                    "px-3 py-1.5 text-xs": size === "sm",
                    "px-4 py-2 text-sm": size === "md",
                    "px-6 py-3 text-base": size === "lg",
                },
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
