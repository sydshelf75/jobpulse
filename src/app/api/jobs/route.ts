import { NextRequest, NextResponse } from "next/server";
import { searchAllPlatforms } from "@/lib/scraper";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "software developer";

    const jobs = await searchAllPlatforms(q);

    return NextResponse.json({
        jobs,
        total: jobs.length,
        source: "scraper",
    });
}

export async function POST() {
    return NextResponse.json({
        message: "Scrape triggered",
        jobsFound: 0,
        jobsNew: 0,
    });
}
