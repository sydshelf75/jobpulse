import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Shared ioredis connection for BullMQ
export const redis = new IORedis(redisUrl, {
    maxRetriesPerRequest: null, // required by BullMQ
});

// ─── Queue Definitions ────────────────────────────────────

export const jobScrapeQueue = new Queue("job-scrape", {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});

export const briefingQueue = new Queue("briefing", {
    connection: redis,
    defaultJobOptions: {
        attempts: 2,
        backoff: { type: "fixed", delay: 3000 },
        removeOnComplete: 50,
        removeOnFail: 20,
    },
});

// ─── Job Types ────────────────────────────────────────────

export interface ScrapeJobData {
    source: string;
    query?: string;
    location?: string;
}

export interface BriefingJobData {
    userId: string;
    chatId: string;
}

// ─── Queue Helpers ────────────────────────────────────────

export async function enqueueScrape(data: ScrapeJobData) {
    return jobScrapeQueue.add("scrape", data);
}

export async function enqueueBriefing(data: BriefingJobData) {
    return briefingQueue.add("send-briefing", data);
}
