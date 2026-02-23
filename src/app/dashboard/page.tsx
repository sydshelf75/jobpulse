import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Briefcase,
    KanbanSquare,
    CalendarDays,
    TrendingUp,
    ArrowRight,
    MapPin,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { mockJobs, mockApplications, mockInterviews, mockTrends } from "@/lib/mock-data";
import { formatRelativeTime, getSourceIcon } from "@/lib/utils";

export default function DashboardOverview() {
    const activeApps = mockApplications.filter((a) => a.status !== "REJECTED");
    const upcomingInterviews = mockInterviews.filter(
        (i) => new Date(i.scheduledAt) > new Date()
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Dashboard
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    Welcome back! Here&apos;s your job search overview.
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <StatCard
                    icon={Briefcase}
                    label="New Jobs Today"
                    value={mockJobs.length}
                    trend={12}
                    color="text-blue-400"
                    bgColor="bg-blue-400/10"
                />
                <StatCard
                    icon={KanbanSquare}
                    label="Active Applications"
                    value={activeApps.length}
                    trend={5}
                    color="text-purple-400"
                    bgColor="bg-purple-400/10"
                />
                <StatCard
                    icon={CalendarDays}
                    label="Upcoming Interviews"
                    value={upcomingInterviews.length}
                    color="text-amber-400"
                    bgColor="bg-amber-400/10"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Market Pulse"
                    value="+12%"
                    trend={12}
                    color="text-emerald-400"
                    bgColor="bg-emerald-400/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Jobs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Job Matches</CardTitle>
                        <Link
                            href="/dashboard/jobs"
                            className="text-sm text-[var(--brand-primary-light)] hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </CardHeader>
                    <div className="space-y-3">
                        {mockJobs.slice(0, 5).map((job) => (
                            <div
                                key={job.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-lg shrink-0">
                                    {getSourceIcon(job.source)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-primary-light)] transition-colors truncate">
                                        {job.title}
                                    </h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                        {job.company}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-tertiary)]">
                                        {job.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {job.location}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatRelativeTime(job.postedAt!)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-[var(--brand-accent)] font-medium shrink-0">
                                    {job.salary}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Application Pipeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Application Pipeline</CardTitle>
                        <Link
                            href="/dashboard/applications"
                            className="text-sm text-[var(--brand-primary-light)] hover:underline flex items-center gap-1"
                        >
                            View Board <ArrowRight className="w-3 h-3" />
                        </Link>
                    </CardHeader>
                    <div className="space-y-3">
                        {mockApplications.map((app) => (
                            <div
                                key={app.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
                                        {app.job.title}
                                    </h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                        {app.job.company} · Applied {formatRelativeTime(app.appliedAt)}
                                    </p>
                                </div>
                                <Badge status={app.status} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Upcoming Interviews & Market Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Interviews */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Interviews</CardTitle>
                        <Link
                            href="/dashboard/interviews"
                            className="text-sm text-[var(--brand-primary-light)] hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </CardHeader>
                    {upcomingInterviews.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingInterviews.map((interview) => (
                                <div
                                    key={interview.id}
                                    className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-[var(--text-primary)]">
                                                {interview.application.job.title}
                                            </h4>
                                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                                {interview.application.job.company}
                                            </p>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/25 capitalize">
                                            {interview.type}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                                        <CalendarDays className="w-3 h-3" />
                                        {new Date(interview.scheduledAt).toLocaleDateString("en-IN", {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--text-tertiary)] text-center py-8">
                            No upcoming interviews
                        </p>
                    )}
                </Card>

                {/* Market Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Market Trends</CardTitle>
                        <Link
                            href="/dashboard/trends"
                            className="text-sm text-[var(--brand-primary-light)] hover:underline flex items-center gap-1"
                        >
                            Details <ArrowRight className="w-3 h-3" />
                        </Link>
                    </CardHeader>
                    <div className="space-y-3">
                        {mockTrends.slice(0, 5).map((trend, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                                <div>
                                    <h4 className="text-sm font-medium text-[var(--text-primary)]">
                                        {trend.role}
                                    </h4>
                                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                                        {trend.location} · {trend.count} openings
                                    </p>
                                </div>
                                <span
                                    className={`text-xs font-medium ${trend.change >= 0 ? "text-emerald-400" : "text-red-400"
                                        }`}
                                >
                                    {trend.change >= 0 ? "↑" : "↓"} {Math.abs(trend.change)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
