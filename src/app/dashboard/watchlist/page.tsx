"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { mockWatchlist } from "@/lib/mock-data";
import {
    Plus,
    ExternalLink,
    Trash2,
    Building2,
    Globe,
    RefreshCw,
    Clock,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState(mockWatchlist);
    const [showAdd, setShowAdd] = useState(false);
    const [newCompany, setNewCompany] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const handleAdd = () => {
        if (!newCompany.trim()) return;
        const newItem = {
            id: `wl-${Date.now()}`,
            companyName: newCompany.trim(),
            careerUrl: newUrl.trim() || null,
            lastChecked: null,
        };
        setWatchlist((prev) => [...prev, newItem]);
        setNewCompany("");
        setNewUrl("");
        setShowAdd(false);
    };

    const handleRemove = (id: string) => {
        setWatchlist((prev) => prev.filter((w) => w.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Company Watchlist
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Track specific companies for new job postings
                    </p>
                </div>
                <Button size="sm" onClick={() => setShowAdd(true)}>
                    <Plus className="w-4 h-4" />
                    Add Company
                </Button>
            </div>

            {/* Watchlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchlist.map((company) => (
                    <Card key={company.id} className="group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-[var(--brand-primary-light)]" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                                        {company.companyName}
                                    </h3>
                                    {company.lastChecked && (
                                        <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            Checked {formatRelativeTime(company.lastChecked)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemove(company.id)}
                                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
                            {company.careerUrl ? (
                                <a
                                    href={company.careerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-[var(--brand-primary-light)] hover:underline"
                                >
                                    <Globe className="w-3 h-3" />
                                    Career Page
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            ) : (
                                <span className="text-xs text-[var(--text-muted)]">
                                    No career page set
                                </span>
                            )}
                            <Button variant="ghost" size="sm">
                                <RefreshCw className="w-3 h-3" />
                                Check Now
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {watchlist.length === 0 && (
                <div className="text-center py-16">
                    <Building2 className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-secondary)]">
                        No companies in your watchlist
                    </h3>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">
                        Add companies to monitor their career pages for new postings
                    </p>
                </div>
            )}

            {/* Add Modal */}
            <Modal
                isOpen={showAdd}
                onClose={() => setShowAdd(false)}
                title="Add Company to Watchlist"
            >
                <div className="space-y-4">
                    <Input
                        label="Company Name"
                        id="company-name"
                        placeholder="e.g. Google, Stripe, Razorpay"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                    />
                    <Input
                        label="Career Page URL (optional)"
                        id="career-url"
                        type="url"
                        placeholder="https://careers.example.com"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setShowAdd(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} disabled={!newCompany.trim()}>
                            Add Company
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
