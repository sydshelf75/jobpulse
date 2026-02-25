"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUser } from "@/lib/mock-data";
import { Save, User, Bell, Briefcase, MapPin, Clock, Plus, X, FileText, Upload, CheckCircle } from "lucide-react";

export default function SettingsPage() {
    const [profile, setProfile] = useState(mockUser);
    const [newSkill, setNewSkill] = useState("");
    const [saved, setSaved] = useState(false);

    // Resume state
    const [resumeFileName, setResumeFileName] = useState<string | null>(null);
    const [resumeUpdatedAt, setResumeUpdatedAt] = useState<string | null>(null);
    const [hasResume, setHasResume] = useState(false);
    const [resumeUploading, setResumeUploading] = useState(false);
    const [resumeMsg, setResumeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/user/resume")
            .then((r) => r.json())
            .then((data) => {
                setResumeFileName(data.resumeFileName);
                setResumeUpdatedAt(data.resumeUpdatedAt);
                setHasResume(data.hasResume);
            })
            .catch(() => {});
    }, []);

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setResumeUploading(true);
        setResumeMsg(null);
        const form = new FormData();
        form.append("resume", file);
        try {
            const res = await fetch("/api/user/resume", { method: "POST", body: form });
            const data = await res.json();
            if (res.ok) {
                setResumeFileName(data.fileName);
                setResumeUpdatedAt(new Date().toISOString());
                setHasResume(true);
                setResumeMsg({ type: "success", text: `Uploaded: ${data.fileName} (${data.textLength.toLocaleString()} chars extracted)` });
            } else {
                setResumeMsg({ type: "error", text: data.error || "Upload failed" });
            }
        } catch {
            setResumeMsg({ type: "error", text: "Network error — please try again" });
        } finally {
            setResumeUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const addSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage your profile and preferences</p>
                </div>
                <Button onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    {saved ? "Saved!" : "Save Changes"}
                </Button>
            </div>

            {/* Profile */}
            <Card>
                <CardHeader><CardTitle><User className="w-5 h-5 inline mr-2" />Profile</CardTitle></CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Name" id="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                    <Input label="Email" id="email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                    <Input label="Telegram Chat ID" id="phone" value={profile.phone || ""} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
                </div>
            </Card>

            {/* Job Preferences */}
            <Card>
                <CardHeader><CardTitle><Briefcase className="w-5 h-5 inline mr-2" />Job Preferences</CardTitle></CardHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Preferred Role" id="role" value={profile.preferredRole} onChange={(e) => setProfile((p) => ({ ...p, preferredRole: e.target.value }))} />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Experience Level</label>
                            <select
                                value={profile.experienceLevel}
                                onChange={(e) => setProfile((p) => ({ ...p, experienceLevel: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none"
                            >
                                <option value="fresher">Fresher</option>
                                <option value="junior">Junior (1-3y)</option>
                                <option value="mid">Mid (3-5y)</option>
                                <option value="senior">Senior (5-8y)</option>
                                <option value="lead">Lead (8y+)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Preferred Location" id="location" value={profile.preferredLocation || ""} onChange={(e) => setProfile((p) => ({ ...p, preferredLocation: e.target.value }))} placeholder="e.g. Bangalore, India" />
                        <div className="grid grid-cols-2 gap-2">
                            <Input label="Min Salary (₹)" id="salary-min" type="number" value={profile.salaryMin || ""} onChange={(e) => setProfile((p) => ({ ...p, salaryMin: parseInt(e.target.value) || 0 }))} />
                            <Input label="Max Salary (₹)" id="salary-max" type="number" value={profile.salaryMax || ""} onChange={(e) => setProfile((p) => ({ ...p, salaryMax: parseInt(e.target.value) || 0 }))} />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--text-secondary)]">Skills</label>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill) => (
                                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary-light)] text-xs border border-[var(--brand-primary)]/20">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input id="new-skill" placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} />
                            <Button variant="outline" size="sm" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
                        </div>
                    </div>

                    {/* Job Types */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--text-secondary)]">Job Types</label>
                        <div className="flex gap-2">
                            {["remote", "hybrid", "onsite"].map((type) => (
                                <button key={type} onClick={() => setProfile((p) => ({
                                    ...p,
                                    jobTypes: p.jobTypes.includes(type)
                                        ? p.jobTypes.filter((t) => t !== type)
                                        : [...p.jobTypes, type],
                                }))}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${profile.jobTypes.includes(type)
                                            ? "bg-[var(--brand-primary)]/15 text-[var(--brand-primary-light)] border-[var(--brand-primary)]/30"
                                            : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-[var(--border-default)] hover:border-[var(--border-hover)]"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Resume */}
            <Card>
                <CardHeader><CardTitle><FileText className="w-5 h-5 inline mr-2" />Resume</CardTitle></CardHeader>
                <div className="space-y-3">
                    {hasResume && resumeFileName ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{resumeFileName}</p>
                                {resumeUpdatedAt && (
                                    <p className="text-xs text-[var(--text-tertiary)]">
                                        Updated {new Date(resumeUpdatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--text-tertiary)]">No resume uploaded yet. Claude will use your profile preferences only.</p>
                    )}

                    <div className="flex items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleResumeUpload}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={resumeUploading}
                        >
                            <Upload className="w-4 h-4" />
                            {resumeUploading ? "Uploading..." : hasResume ? "Replace Resume" : "Upload Resume"}
                        </Button>
                        <span className="text-xs text-[var(--text-tertiary)]">PDF only, max 5MB</span>
                    </div>

                    {resumeMsg && (
                        <p className={`text-sm ${resumeMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
                            {resumeMsg.text}
                        </p>
                    )}
                </div>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader><CardTitle><Bell className="w-5 h-5 inline mr-2" />Notifications</CardTitle></CardHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Daily Briefing Time" id="briefing-time" type="time" value={profile.briefingTime} onChange={(e) => setProfile((p) => ({ ...p, briefingTime: e.target.value }))} />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Timezone</label>
                            <select value={profile.timezone} onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm focus:outline-none">
                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                <option value="America/New_York">America/New_York (EST)</option>
                                <option value="Europe/London">Europe/London (GMT)</option>
                                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { key: "briefingEnabled", label: "Daily Briefing", desc: "Receive daily job briefings on Telegram" },
                            { key: "trendAlerts", label: "Market Trend Alerts", desc: "Weekly market trend updates" },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">{item.desc}</p>
                                </div>
                                <button onClick={() => setProfile((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                                    className={`w-11 h-6 rounded-full transition-all relative ${profile[item.key as keyof typeof profile] ? "bg-[var(--brand-primary)]" : "bg-[var(--bg-elevated)]"
                                        }`}>
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${profile[item.key as keyof typeof profile] ? "left-5.5" : "left-0.5"
                                        }`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
