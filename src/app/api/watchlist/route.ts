import { NextRequest, NextResponse } from "next/server";
import { mockWatchlist } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ watchlist: mockWatchlist });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const newItem = {
        id: `wl-${Date.now()}`,
        companyName: body.companyName,
        careerUrl: body.careerUrl || null,
        lastChecked: null,
        createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ watchlistItem: newItem }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    return NextResponse.json({ deleted: id });
}
