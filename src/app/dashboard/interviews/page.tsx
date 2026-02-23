import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { mockInterviews } from "@/lib/mock-data";
import {
    CalendarDays,
    Clock,
    Video,
    Phone,
    Building2,
    FileText,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

const typeIcons: Record<string, typeof Video> = {
    video: Video,
    phone: Phone,
    technical: FileText,
    onsite: Building2,
    hr: Phone,
};

export default function InterviewsPage() {
    const upcoming = mockInterviews.filter(
        (i) => new Date(i.scheduledAt) > new Date()
    );
    const past = mockInterviews.filter(
        (i) => new Date(i.scheduledAt) <= new Date()
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Interviews
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    Manage your upcoming interviews and prep notes
                </p>
            </div>

            {/* Upcoming */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    Upcoming ({upcoming.length})
                </h2>
                <div className="space-y-4">
                    {upcoming.map((interview) => {
                        const TypeIcon = typeIcons[interview.type || "video"] || Video;
                        const date = new Date(interview.scheduledAt);
                        const isToday =
                            date.toDateString() === new Date().toDateString();
                        const isTomorrow =
                            date.toDateString() ===
                            new Date(Date.now() + 86400000).toDateString();

                        return (
                            <Card key={interview.id}>
                                <div className="flex items-start gap-4">
                                    {/* Date Badge */}
                                    <div className="w-16 h-16 rounded-xl bg-[var(--brand-primary)]/10 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs text-[var(--brand-primary-light)] font-medium uppercase">
                                            {date.toLocaleDateString("en-IN", { month: "short" })}
                                        </span>
                                        <span className="text-xl font-bold text-[var(--text-primary)]">
                                            {date.getDate()}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                                                    {interview.application.job.title}
                                                </h3>
                                                <p className="text-sm text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5" />
                                                    {interview.application.job.company}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {(isToday || isTomorrow) && (
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${isToday
                                                                ? "bg-red-500/15 text-red-400"
                                                                : "bg-amber-500/15 text-amber-400"
                                                            }`}
                                                    >
                                                        {isToday ? "Today" : "Tomorrow"}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-[var(--bg-elevated)] text-[var(--text-secondary)] capitalize">
                                                    <TypeIcon className="w-3 h-3" />
                                                    {interview.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-tertiary)]">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {date.toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CalendarDays className="w-3.5 h-3.5" />
                                                {date.toLocaleDateString("en-IN", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                })}
                                            </span>
                                        </div>

                                        {/* Notes */}
                                        {interview.notes && (
                                            <div className="mt-3 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
                                                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                                                    📝 Notes
                                                </p>
                                                <p className="text-sm text-[var(--text-tertiary)]">
                                                    {interview.notes}
                                                </p>
                                            </div>
                                        )}

                                        {/* Prep Notes */}
                                        {interview.prepNotes && (
                                            <div className="mt-2 p-3 rounded-lg bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/15">
                                                <p className="text-xs font-medium text-[var(--brand-primary-light)] mb-1">
                                                    🎯 Prep Notes
                                                </p>
                                                <p className="text-sm text-[var(--text-secondary)]">
                                                    {interview.prepNotes}
                                                </p>
                                            </div>
                                        )}

                                        {/* Reminder Status */}
                                        <div className="mt-3 flex items-center gap-2 text-xs">
                                            {interview.reminded ? (
                                                <span className="flex items-center gap-1 text-emerald-400">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Reminder sent
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[var(--text-muted)]">
                                                    <Clock className="w-3 h-3" />
                                                    Reminder scheduled 2h before
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Past */}
            {past.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[var(--text-muted)]" />
                        Past ({past.length})
                    </h2>
                    <div className="space-y-3 opacity-60">
                        {past.map((interview) => (
                            <Card key={interview.id} hover={false}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center">
                                        <CalendarDays className="w-5 h-5 text-[var(--text-muted)]" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--text-primary)]">
                                            {interview.application.job.title} @ {interview.application.job.company}
                                        </h4>
                                        <p className="text-xs text-[var(--text-tertiary)]">
                                            {new Date(interview.scheduledAt).toLocaleDateString("en-IN")} · {interview.type}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {upcoming.length === 0 && past.length === 0 && (
                <div className="text-center py-16">
                    <CalendarDays className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-secondary)]">
                        No interviews scheduled
                    </h3>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">
                        Add interviews from the Applications page or via WhatsApp
                    </p>
                </div>
            )}
        </div>
    );
}
