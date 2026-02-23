import { NextRequest, NextResponse } from "next/server";
import { mockApplications } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ applications: mockApplications });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const newApp = {
        id: `app-${Date.now()}`,
        userId: "demo-user",
        jobId: body.jobId,
        status: body.status || "APPLIED",
        notes: body.notes || null,
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        job: null,
    };
    return NextResponse.json({ application: newApp }, { status: 201 });
}
