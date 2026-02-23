import { NextRequest, NextResponse } from "next/server";
import { mockUser } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json({ user: mockUser });
}

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const updatedUser = { ...mockUser, ...body, updatedAt: new Date().toISOString() };
    return NextResponse.json({ user: updatedUser });
}
