import { z } from "zod";

// ─── Job Schemas ──────────────────────────────────────────

export const jobFilterSchema = z.object({
    query: z.string().optional(),
    location: z.string().optional(),
    source: z.string().optional(),
    jobType: z.string().optional(),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    experience: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().default(20),
});

export type JobFilter = z.infer<typeof jobFilterSchema>;

// ─── Application Schemas ──────────────────────────────────

export const createApplicationSchema = z.object({
    jobId: z.string(),
    notes: z.string().optional(),
    status: z.enum(["APPLIED", "IN_REVIEW", "INTERVIEW", "OFFER", "REJECTED"]).default("APPLIED"),
});

export const updateApplicationSchema = z.object({
    status: z.enum(["APPLIED", "IN_REVIEW", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
    notes: z.string().optional(),
});

export type CreateApplication = z.infer<typeof createApplicationSchema>;
export type UpdateApplication = z.infer<typeof updateApplicationSchema>;

// ─── Interview Schemas ────────────────────────────────────

export const createInterviewSchema = z.object({
    applicationId: z.string(),
    scheduledAt: z.string().datetime(),
    type: z.string().optional(),
    notes: z.string().optional(),
});

export type CreateInterview = z.infer<typeof createInterviewSchema>;

// ─── Watchlist Schemas ────────────────────────────────────

export const createWatchlistSchema = z.object({
    companyName: z.string().min(1),
    careerUrl: z.string().url().optional(),
});

export type CreateWatchlist = z.infer<typeof createWatchlistSchema>;

// ─── User Profile Schema ─────────────────────────────────

export const updateProfileSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    preferredRole: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experienceLevel: z.string().optional(),
    preferredLocation: z.string().optional(),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    jobTypes: z.array(z.string()).optional(),
    briefingTime: z.string().optional(),
    timezone: z.string().optional(),
    briefingEnabled: z.boolean().optional(),
    trendAlerts: z.boolean().optional(),
    reminderBefore: z.number().optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// ─── Chat Schema ──────────────────────────────────────────

export const chatMessageSchema = z.object({
    message: z.string().min(1),
    conversationId: z.string().optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// ─── WhatsApp Webhook Schema ──────────────────────────────

export const whatsappWebhookSchema = z.object({
    From: z.string(),
    Body: z.string(),
    MessageSid: z.string().optional(),
    NumMedia: z.string().optional(),
});

export type WhatsAppWebhook = z.infer<typeof whatsappWebhookSchema>;
