import { NextRequest, NextResponse } from "next/server";
import { searchJobs } from "@/lib/jsearch";
import { mockJobs } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const location = searchParams.get("location") || "";
    const remoteOnly = searchParams.get("remoteOnly") === "true";
    const page = parseInt(searchParams.get("page") || "1");

    if (!process.env.JSEARCH_API_KEY) {
        // Fallback to mock data when API key is not configured
        const query = q.toLowerCase();
        let jobs = [...mockJobs];
        if (query) {
            jobs = jobs.filter(
                (j) =>
                    j.title.toLowerCase().includes(query) ||
                    j.company.toLowerCase().includes(query) ||
                    j.skills.some((s) => s.toLowerCase().includes(query))
            );
        }
        return NextResponse.json({
            jobs,
            total: jobs.length,
            page: 1,
            totalPages: 1,
            source: "mock",
        });
    }

    try {
        const jobs = await searchJobs({
            query: q || "software engineer",
            location: location || undefined,
            remoteOnly,
            page,
        });

        const mapped = jobs.map((j) => ({
            id: j.job_id,
            title: j.job_title,
            company: j.employer_name,
            location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(', '),
            salary: j.job_min_salary && j.job_max_salary
                ? `$${j.job_min_salary.toLocaleString()}–$${j.job_max_salary.toLocaleString()}`
                : null,
            salaryMin: j.job_min_salary ?? null,
            salaryMax: j.job_max_salary ?? null,
            url: j.job_apply_link,
            source: "jsearch",
            description: j.job_description ?? null,
            skills: j.job_required_skills ?? [],
            jobType: j.job_is_remote ? "remote" : (j.job_employment_type?.toLowerCase() ?? "fulltime"),
            postedAt: j.job_posted_at_datetime_utc ?? null,
            active: true,
        }));

        return NextResponse.json({
            jobs: mapped,
            total: mapped.length,
            page,
            totalPages: page, // JSearch doesn't return total count
            source: "jsearch",
        });
    } catch (error) {
        console.error("[JSearch API Error]", error);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

export async function POST() {
    // Trigger a scrape (mock)
    return NextResponse.json({
        message: "Scrape triggered",
        jobsFound: 12,
        jobsNew: 5,
    });
}
