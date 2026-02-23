import { NextRequest, NextResponse } from "next/server";
import { mockJobs } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const source = searchParams.get("source") || "";
    const jobType = searchParams.get("jobType") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let jobs = [...mockJobs];

    if (query) {
        jobs = jobs.filter(
            (j) =>
                j.title.toLowerCase().includes(query) ||
                j.company.toLowerCase().includes(query) ||
                j.skills.some((s) => s.toLowerCase().includes(query))
        );
    }
    if (source) jobs = jobs.filter((j) => j.source === source);
    if (jobType) jobs = jobs.filter((j) => j.jobType === jobType);

    const total = jobs.length;
    const start = (page - 1) * limit;
    const paginated = jobs.slice(start, start + limit);

    return NextResponse.json({
        jobs: paginated,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
}

export async function POST() {
    // Trigger a scrape (mock)
    return NextResponse.json({
        message: "Scrape triggered",
        jobsFound: 12,
        jobsNew: 5,
    });
}
