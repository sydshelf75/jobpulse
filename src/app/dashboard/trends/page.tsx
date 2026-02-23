import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTrends } from "@/lib/mock-data";
import { formatSalary } from "@/lib/utils";
import { TrendingUp, TrendingDown, MapPin, Briefcase, IndianRupee, BarChart3 } from "lucide-react";

export default function TrendsPage() {
    const topGrowers = [...mockTrends].sort((a, b) => b.change - a.change).slice(0, 3);
    const topPaying = [...mockTrends].sort((a, b) => b.avgSalary - a.avgSalary).slice(0, 3);
    const totalOpenings = mockTrends.reduce((sum, t) => sum + t.count, 0);
    const avgChange = Math.round(mockTrends.reduce((sum, t) => sum + t.change, 0) / mockTrends.length);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Job Market Trends</h1>
                <p className="text-[var(--text-secondary)] mt-1">Weekly insights from scraped job data</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{totalOpenings.toLocaleString()}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Openings</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{avgChange >= 0 ? "+" : ""}{avgChange}%</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Avg Weekly Change</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{mockTrends.length}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Roles Tracked</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fastest Growing */}
                <Card><CardHeader><CardTitle>🚀 Fastest Growing</CardTitle></CardHeader>
                    <div className="space-y-3">
                        {topGrowers.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-[var(--text-muted)] w-6">{i + 1}</span>
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--text-primary)]">{t.role}</h4>
                                        <p className="text-xs text-[var(--text-tertiary)]"><MapPin className="w-3 h-3 inline" /> {t.location} · {t.count} openings</p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-400"><TrendingUp className="w-4 h-4" />+{t.change}%</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Highest Paying */}
                <Card><CardHeader><CardTitle>💰 Highest Paying</CardTitle></CardHeader>
                    <div className="space-y-3">
                        {topPaying.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-[var(--text-muted)] w-6">{i + 1}</span>
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--text-primary)]">{t.role}</h4>
                                        <p className="text-xs text-[var(--text-tertiary)]"><MapPin className="w-3 h-3 inline" /> {t.location}</p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 text-sm font-semibold text-amber-400"><IndianRupee className="w-4 h-4" />{formatSalary(t.avgSalary)}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Table */}
            <Card><CardHeader><CardTitle>All Role Trends</CardTitle></CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-xs text-[var(--text-tertiary)] border-b border-[var(--border-default)]">
                            <th className="pb-3 font-medium">Role</th><th className="pb-3 font-medium">Location</th>
                            <th className="pb-3 font-medium text-right">Openings</th><th className="pb-3 font-medium text-right">Avg Salary</th>
                            <th className="pb-3 font-medium text-right">Change</th>
                        </tr></thead>
                        <tbody>
                            {mockTrends.map((t, i) => (
                                <tr key={i} className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-tertiary)]">
                                    <td className="py-3 font-medium text-[var(--text-primary)]">{t.role}</td>
                                    <td className="py-3 text-[var(--text-secondary)]">{t.location}</td>
                                    <td className="py-3 text-right text-[var(--text-primary)]">{t.count}</td>
                                    <td className="py-3 text-right text-[var(--text-primary)]">{formatSalary(t.avgSalary)}</td>
                                    <td className="py-3 text-right">
                                        <span className={`inline-flex items-center gap-1 font-medium ${t.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                            {t.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {t.change >= 0 ? "+" : ""}{t.change}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
