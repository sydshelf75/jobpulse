import { NextRequest, NextResponse } from "next/server";
import { mockInterviews } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ interviews: mockInterviews });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const newInterview = {
        id: `int-${Date.now()}`,
        applicationId: body.applicationId,
        scheduledAt: body.scheduledAt,
        type: body.type || "video",
        notes: body.notes || null,
        prepNotes: null,
        reminded: false,
        createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ interview: newInterview }, { status: 201 });
}
