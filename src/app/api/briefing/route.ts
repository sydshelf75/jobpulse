import { NextResponse } from "next/server";
import { mockJobs, mockApplications, mockInterviews } from "@/lib/mock-data";
import { formatBriefing } from "@/lib/whatsapp";

// This endpoint is triggered by cron to compose and send daily briefings
export async function POST() {
    // In production, this would iterate over all users and send personalized briefings
    const newJobs = mockJobs.slice(0, 3).map((j) => ({
        title: j.title,
        company: j.company,
        salary: j.salary || undefined,
    }));

    const statusCounts: Record<string, number> = {};
    mockApplications.forEach((a) => {
        statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    const applications = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
    }));

    const interviews = mockInterviews
        .filter((i) => new Date(i.scheduledAt) > new Date())
        .map((i) => ({
            company: i.application.job.company,
            role: i.application.job.title,
            time: new Date(i.scheduledAt).toLocaleString("en-IN"),
        }));

    const briefingMessage = formatBriefing({
        newJobs,
        applications,
        interviews,
        trend: "Frontend roles in Bangalore up 12% this week",
    });

    // In production: send via WhatsApp to each user
    console.log("[Daily Briefing] Composed:\n", briefingMessage);

    return NextResponse.json({
        message: "Briefing composed",
        usersNotified: 1,
        preview: briefingMessage,
    });
}

export async function GET() {
    return NextResponse.json({
        status: "Daily briefing endpoint active",
        info: "POST to trigger briefing dispatch",
    });
}
