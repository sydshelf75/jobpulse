import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                className={cn(
                    "w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)]/50 focus:ring-1 focus:ring-[var(--brand-primary)]/20 transition-all",
                    error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export function Select({
    label,
    options,
    className,
    id,
    ...props
}: SelectProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                    {label}
                </label>
            )}
            <select
                id={id}
                className={cn(
                    "w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--brand-primary)]/50 focus:ring-1 focus:ring-[var(--brand-primary)]/20 transition-all appearance-none cursor-pointer",
                    className
                )}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={cn(
                    "w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)]/50 focus:ring-1 focus:ring-[var(--brand-primary)]/20 transition-all resize-none",
                    className
                )}
                rows={4}
                {...props}
            />
        </div>
    );
}
