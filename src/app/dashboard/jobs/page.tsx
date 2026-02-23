"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, SourceBadge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { mockJobs } from "@/lib/mock-data";
import { formatRelativeTime, getSourceIcon } from "@/lib/utils";
import {
    Search,
    MapPin,
    Clock,
    ExternalLink,
    Bookmark,
    Filter,
    X,
    Briefcase,
} from "lucide-react";

export default function JobsPage() {
    const [search, setSearch] = useState("");
    const [filterSource, setFilterSource] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const filteredJobs = mockJobs.filter((job) => {
        const matchesSearch =
            !search ||
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.company.toLowerCase().includes(search.toLowerCase()) ||
            job.skills.some((s) =>
                s.toLowerCase().includes(search.toLowerCase())
            );
        const matchesSource =
            filterSource === "all" || job.source === filterSource;
        const matchesType = filterType === "all" || job.jobType === filterType;
        return matchesSearch && matchesSource && matchesType;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Job Listings
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        {filteredJobs.length} jobs matched to your profile
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="w-4 h-4" />
                    Filters
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search by title, company, or skill..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)]/50"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="glass-card p-4 flex flex-wrap gap-4 animate-fade-in">
                        <Select
                            label="Source"
                            id="filter-source"
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            options={[
                                { value: "all", label: "All Sources" },
                                { value: "linkedin", label: "LinkedIn" },
                                { value: "naukri", label: "Naukri" },
                                { value: "indeed", label: "Indeed" },
                                { value: "jsearch", label: "JSearch" },
                                { value: "company", label: "Company" },
                            ]}
                        />
                        <Select
                            label="Job Type"
                            id="filter-type"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            options={[
                                { value: "all", label: "All Types" },
                                { value: "remote", label: "Remote" },
                                { value: "hybrid", label: "Hybrid" },
                                { value: "onsite", label: "Onsite" },
                            ]}
                        />
                    </div>
                )}
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                    <Card key={job.id} className="group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center text-xl shrink-0">
                                    {getSourceIcon(job.source)}
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary-light)] transition-colors">
                                        {job.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {job.company}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--brand-primary-light)] hover:bg-[var(--brand-primary)]/10 transition-all opacity-0 group-hover:opacity-100">
                                <Bookmark className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 mb-3">
                            {job.description}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {job.skills.slice(0, 4).map((skill) => (
                                <span
                                    key={skill}
                                    className="px-2 py-0.5 rounded-md text-xs bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)]"
                                >
                                    {skill}
                                </span>
                            ))}
                            {job.skills.length > 4 && (
                                <span className="px-2 py-0.5 rounded-md text-xs text-[var(--text-muted)]">
                                    +{job.skills.length - 4} more
                                </span>
                            )}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
                            <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
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
                                <SourceBadge source={job.source} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[var(--brand-accent)]">
                                    {job.salary}
                                </span>
                                <a
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--brand-primary-light)] transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                    <Briefcase className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-secondary)]">
                        No jobs found
                    </h3>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">
                        Try adjusting your search or filters
                    </p>
                </div>
            )}
        </div>
    );
}
