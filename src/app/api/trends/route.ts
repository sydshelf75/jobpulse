import { NextResponse } from "next/server";
import { mockTrends } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({
        trends: mockTrends,
        generatedAt: new Date().toISOString(),
        period: "weekly",
    });
}
